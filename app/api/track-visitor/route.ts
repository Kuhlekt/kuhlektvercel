import { type NextRequest, NextResponse } from "next/server"
import { trackVisitor } from "@/lib/visitor-tracking"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, sessionId } = body

    if (!page) {
      return NextResponse.json({ error: "Page is required" }, { status: 400 })
    }

    // Track the visitor
    const visitorData = await trackVisitor(page, sessionId)

    return NextResponse.json({
      success: true,
      visitorId: visitorData.id,
      sessionId: visitorData.sessionId,
    })
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
