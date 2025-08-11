import { type NextRequest, NextResponse } from "next/server"
import { trackVisitor } from "@/lib/visitor-tracking"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, referrer, userAgent } = body

    // Get IP address from request with better fallback handling
    const forwarded = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const cfConnectingIp = request.headers.get("cf-connecting-ip")

    // Try multiple IP sources in order of preference
    let ip = "unknown"
    if (cfConnectingIp) {
      ip = cfConnectingIp
    } else if (forwarded) {
      ip = forwarded.split(",")[0].trim()
    } else if (realIp) {
      ip = realIp
    } else {
      // Fallback to connection remote address
      const connectionIp = request.ip || request.headers.get("x-client-ip")
      if (connectionIp) {
        ip = connectionIp
      }
    }

    // Ensure we have valid data
    if (!page || !userAgent) {
      console.error("Missing required tracking data:", { page, userAgent })
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Track the visitor with better error handling
    await trackVisitor({
      ip,
      userAgent,
      page,
      referrer: referrer || undefined,
      timestamp: new Date(),
    })

    console.log("Visitor tracked successfully:", { ip, page, userAgent: userAgent.substring(0, 50) + "..." })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return NextResponse.json({ error: "Failed to track visitor" }, { status: 500 })
  }
}
