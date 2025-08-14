import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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

    // Store in Supabase with upsert to handle duplicate visitors
    const { error } = await supabase.from("visitor_tracking").upsert(sanitizedData, {
      onConflict: "visitor_id",
      ignoreDuplicates: false,
    })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
    }

    if (data.pageHistory && Array.isArray(data.pageHistory)) {
      const pageHistoryData = data.pageHistory.map((page: any) => ({
        session_id: data.sessionId,
        page: page.page?.substring(0, 500) || "",
        timestamp: page.timestamp || new Date().toISOString(),
        visitor_id: data.visitorId,
      }))

      await supabase.from("page_history").upsert(pageHistoryData)
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
