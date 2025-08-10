import { type NextRequest, NextResponse } from "next/server"
import { trackVisitor, trackPageView, parseUserAgent } from "@/lib/visitor-tracking"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, page, referrer, userAgent } = await request.json()

    // Get IP address
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || request.ip || "unknown"

    // Parse user agent
    const { device, browser, os } = parseUserAgent(userAgent)

    // Check if this is a new visitor (by session ID)
    const existingVisitor = sessionStorage.getItem(`visitor_${sessionId}`)

    let visitorId = existingVisitor
    if (!visitorId) {
      // Track new visitor
      const visitor = trackVisitor({
        ipAddress,
        userAgent,
        referrer,
        currentPage: page,
        sessionId,
        device,
        browser,
        os,
      })
      visitorId = visitor.id
    }

    // Track page view
    trackPageView(visitorId, page)

    return NextResponse.json({ success: true, visitorId })
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return NextResponse.json({ error: "Failed to track visitor" }, { status: 500 })
  }
}
