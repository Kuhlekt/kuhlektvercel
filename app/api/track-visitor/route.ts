import { type NextRequest, NextResponse } from "next/server"
import { trackVisitor } from "@/lib/visitor-tracking"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, referrer, userAgent } = body

    // Get IP address from request
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"

    // Track the visitor
    await trackVisitor({
      ip,
      userAgent,
      page,
      referrer,
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return NextResponse.json({ error: "Failed to track visitor" }, { status: 500 })
  }
}
