import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// FORCE_REBUILD_TIMESTAMP_2024_01_14_15_30_00 - Added to force Git recognition
// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"
  return `visitor_track_${ip}`
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(key)

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit (100 requests per hour)
    rateLimitMap.set(key, { count: 1, resetTime: now + 60 * 60 * 1000 })
    return false
  }

  if (limit.count >= 100) {
    return true
  }

  limit.count++
  return false
}

function validateVisitorData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Required fields validation
  if (!data.visitorId || typeof data.visitorId !== "string") {
    errors.push("Invalid visitorId")
  }

  if (!data.sessionId || typeof data.sessionId !== "string") {
    errors.push("Invalid sessionId")
  }

  if (!data.page || typeof data.page !== "string") {
    errors.push("Invalid page")
  }

  // Sanitize and validate optional fields
  if (data.userAgent && typeof data.userAgent !== "string") {
    errors.push("Invalid userAgent")
  }

  if (data.referrer && typeof data.referrer !== "string") {
    errors.push("Invalid referrer")
  }

  // Validate UTM parameters
  const utmFields = ["utmSource", "utmMedium", "utmCampaign", "utmTerm", "utmContent"]
  for (const field of utmFields) {
    if (data[field] && (typeof data[field] !== "string" || data[field].length > 255)) {
      errors.push(`Invalid ${field}`)
    }
  }

  // Validate affiliate code
  if (data.affiliate && (typeof data.affiliate !== "string" || data.affiliate.length > 50)) {
    errors.push("Invalid affiliate code")
  }

  // Validate page views count
  if (data.pageViews && (!Number.isInteger(data.pageViews) || data.pageViews < 0 || data.pageViews > 10000)) {
    errors.push("Invalid pageViews count")
  }

  return { isValid: errors.length === 0, errors }
}

function getValidIpAddress(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const remoteAddress = request.headers.get("x-vercel-forwarded-for")

  // Try different IP sources in order of preference
  const possibleIps = [forwarded ? forwarded.split(",")[0].trim() : null, realIp, remoteAddress].filter(Boolean)

  for (const ip of possibleIps) {
    if (ip && ip !== "unknown" && isValidIpAddress(ip)) {
      return ip
    }
  }

  return null // Return null for invalid/unknown IPs instead of "unknown"
}

function isValidIpAddress(ip: string): boolean {
  // IPv4 regex
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

  // IPv6 regex (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/

  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

interface PageHistoryItem {
  page?: string
  timestamp?: string
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request)
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 })
    }

    const data = await request.json()

    const validation = validateVisitorData(data)
    if (!validation.isValid) {
      console.warn("Invalid visitor data:", validation.errors)
      return NextResponse.json({ success: false, error: "Invalid data", details: validation.errors }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: "public",
      },
      global: {
        headers: {
          "x-application-name": "kuhlekt-tracking-system",
        },
      },
    })

    const validIpAddress = getValidIpAddress(request)

    const sanitizedData = {
      visitor_id: data.visitorId.substring(0, 100),
      session_id: data.sessionId.substring(0, 100),
      page: data.page.substring(0, 500),
      user_agent: data.userAgent?.substring(0, 1000) || null,
      referrer: data.referrer?.substring(0, 500) || null,
      utm_source: data.utmSource?.substring(0, 255) || null,
      utm_medium: data.utmMedium?.substring(0, 255) || null,
      utm_campaign: data.utmCampaign?.substring(0, 255) || null,
      utm_term: data.utmTerm?.substring(0, 255) || null,
      utm_content: data.utmContent?.substring(0, 255) || null,
      affiliate: data.affiliate?.substring(0, 50) || null,
      page_views: Math.min(Math.max(data.pageViews || 1, 1), 10000),
      first_visit: data.firstVisit || new Date().toISOString(),
      last_visit: data.lastVisit || new Date().toISOString(),
      ip_address: validIpAddress,
      is_new_user: data.isNewUser || false, // Track if this is a new user sign-on
      session_duration: data.sessionDuration || 0, // Track session length for real-time analytics
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (typeof supabase.from !== "function") {
      console.error("Supabase client not properly configured")
      return NextResponse.json({ success: false, error: "Database configuration error" }, { status: 500 })
    }

    const { error: healthError } = await supabase.from("visitor_tracking").select("id").limit(1)
    if (healthError && healthError.code === "PGRST301") {
      console.error("Supabase connection error:", healthError)
      return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
    }

    const { data: upsertData, error: upsertError } = await supabase
      .from("visitor_tracking")
      .upsert(sanitizedData, {
        onConflict: "visitor_id",
        ignoreDuplicates: false,
      })
      .select("id, is_new_user, session_duration")

    if (upsertError) {
      console.error("Supabase upsert error:", {
        code: upsertError.code,
        message: upsertError.message,
        details: upsertError.details,
        hint: upsertError.hint,
      })

      // Handle specific Supabase errors
      if (upsertError.code === "23505") {
        // Unique constraint violation
        console.warn("Duplicate visitor ID detected, updating existing record")
        const { error: updateError } = await supabase
          .from("visitor_tracking")
          .update({
            ...sanitizedData,
            updated_at: new Date().toISOString(),
          })
          .eq("visitor_id", sanitizedData.visitor_id)

        if (updateError) {
          console.error("Supabase update error:", updateError)
          return NextResponse.json({ success: false, error: "Database update failed" }, { status: 500 })
        }
      } else {
        return NextResponse.json({ success: false, error: "Database operation failed" }, { status: 500 })
      }
    }

    // CORRECTED_PAGE_HISTORY_PROCESSING - No filter functions used here
    if (data.pageHistory && Array.isArray(data.pageHistory) && data.pageHistory.length > 0) {
      const pageHistoryData: Array<{
        session_id: string
        page: string
        timestamp: string
        visitor_id: string
      }> = []

      // Process each page history item individually using for-loop (no filter/map)
      for (const item of data.pageHistory) {
        if (item && typeof item === "object" && item.page && item.timestamp) {
          pageHistoryData.push({
            session_id: data.sessionId,
            page: item.page.substring(0, 500),
            timestamp: item.timestamp,
            visitor_id: data.visitorId,
          })
        }
      }

      if (pageHistoryData.length > 0) {
        const { error: historyError } = await supabase.from("page_history").insert(pageHistoryData).select("id")

        if (historyError) {
          console.warn("Page history insertion failed:", historyError)
          // Don't fail the main request if page history fails
        }
      }
    }

    if (data.isNewUser) {
      console.log("🆕 New user detected:", {
        visitorId: data.visitorId.substring(0, 16) + "...",
        timestamp: new Date().toISOString(),
        page: data.page,
        referrer: data.referrer,
        utmSource: data.utmSource,
      })
    }

    return NextResponse.json({
      success: true,
      isNewUser: data.isNewUser,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Visitor tracking error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
