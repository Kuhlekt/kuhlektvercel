"use server"

import { createOrUpdateVisitor, addPageView } from "@/lib/database/visitors"
import { headers } from "next/headers"

function extractValidIP(ipHeader: string | null): string {
  if (!ipHeader) return "127.0.0.1"

  // X-Forwarded-For can contain multiple IPs separated by commas
  // Take the first one (client's real IP)
  const firstIP = ipHeader.split(",")[0].trim()

  // Basic IP validation (IPv4 format)
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipv4Regex.test(firstIP)) {
    return firstIP
  }

  // Fallback to localhost if invalid
  return "127.0.0.1"
}

export async function trackVisitorToDatabase(visitorData: {
  sessionId: string
  visitorId: string
  currentPage: string
  referrer?: string
  userAgent?: string
  pageViews?: number
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  affiliate?: string
}) {
  try {
    const headersList = headers()
    const rawIP = headersList.get("x-forwarded-for") || headersList.get("x-real-ip")
    const ipAddress = extractValidIP(rawIP)
    const userAgent = headersList.get("user-agent") || visitorData.userAgent || "unknown"

    // Create or update visitor in database
    const visitorResult = await createOrUpdateVisitor({
      sessionId: visitorData.sessionId,
      ipAddress,
      userAgent,
      referrer: visitorData.referrer,
      landingPage: visitorData.currentPage,
      pageViews: visitorData.pageViews || 1,
    })

    if (visitorResult.success && visitorResult.data) {
      // Add page view record
      await addPageView({
        visitorId: visitorResult.data.id,
        pageUrl: visitorData.currentPage,
        pageTitle: typeof document !== "undefined" ? document.title : undefined,
        referrer: visitorData.referrer,
      })
    }

    return { success: true, data: visitorResult.data }
  } catch (error) {
    console.error("Error tracking visitor to database:", error)
    return { success: false, error: "Failed to track visitor" }
  }
}
