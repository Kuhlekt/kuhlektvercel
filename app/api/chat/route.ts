import { type NextRequest, NextResponse } from "next/server"

// CORS headers for external widget
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
  "Access-Control-Max-Age": "86400",
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// POST handler - Proxy to Kali server
export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Chat proxy endpoint called")

    // Get the request body
    const body = await request.text()
    console.log("[v0] Request body:", body)

    // Forward the request to the Kali server
    const kaliServerUrl = "https://kali.kuhlekt-info.com/api/chat"
    console.log("[v0] Proxying to:", kaliServerUrl)

    const response = await fetch(kaliServerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })

    console.log("[v0] Kali server response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Kali server error:", errorText)
      return NextResponse.json(
        { error: "Failed to get response from Kali server", details: errorText },
        { status: response.status, headers: corsHeaders },
      )
    }

    // Get the response from Kali server
    const data = await response.json()
    console.log("[v0] Kali server response:", JSON.stringify(data).substring(0, 200))

    // Return the response with CORS headers
    return NextResponse.json(data, { headers: corsHeaders })
  } catch (error) {
    console.error("[v0] Error in chat proxy:", error)
    return NextResponse.json(
      {
        error: "Failed to proxy chat request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: corsHeaders },
    )
  }
}
