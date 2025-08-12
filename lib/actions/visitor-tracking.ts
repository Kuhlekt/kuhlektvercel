"use server"

import { createOrUpdateVisitor, addPageView } from "@/lib/database/visitors"
import { headers } from "next/headers"

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
    const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"
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
