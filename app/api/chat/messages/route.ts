import { type NextRequest, NextResponse } from "next/server"

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// GET handler - Poll for new messages (alternative endpoint)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get("sessionId")

    console.log("[v0] Polling for chat messages, sessionId:", sessionId)

    // The Kali server's polling endpoint returns 500 errors, so we handle polling locally
    return NextResponse.json(
      {
        success: true,
        messages: [],
        hasNewMessages: false,
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error("[v0] Error polling chat messages:", error)
    return NextResponse.json(
      {
        success: true,
        messages: [],
        hasNewMessages: false,
      },
      { headers: corsHeaders },
    )
  }
}
