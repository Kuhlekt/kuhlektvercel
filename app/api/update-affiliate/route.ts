import { type NextRequest, NextResponse } from "next/server"
import { updateVisitorAffiliate } from "@/lib/visitor-tracking"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, affiliate, source } = await request.json()

    if (sessionId && affiliate && affiliate.trim() !== "" && (source === "demo" || source === "contact")) {
      updateVisitorAffiliate(sessionId, affiliate.trim(), source)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating affiliate:", error)
    return NextResponse.json({ success: true }) // Don't fail the request
  }
}
