import { type NextRequest, NextResponse } from "next/server"
import { trackVisitor, trackPageView, parseUserAgent } from "@/lib/visitor-tracking"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, page, referrer, userAgent } = await request.json()

    // Get IP address
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown"

    // Parse user agent
    const { device, browser, os } = parseUserAgent(userAgent)

    // Create a simple visitor ID based on session
    const visitorId = `visitor_${sessionId}`

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

    // Track page view
    trackPageView(visitor.id, page)

    return NextResponse.json({ success: true, visitorId: visitor.id })
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return NextResponse.json({ success: true, visitorId: "fallback" })
  }
}
