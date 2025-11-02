import { type NextRequest, NextResponse } from "next/server"

// CORS headers for external widget
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// GET handler - Proxy KB requests to Kali server
export async function GET(request: NextRequest) {
  try {
    console.log("[v0] KB proxy endpoint called")

    // Forward the request to the Kali server's KB endpoint
    const kaliServerUrl = "https://kali.kuhlekt-info.com/api/chat/knowledge"
    console.log("[v0] Proxying KB request to:", kaliServerUrl)

    const response = await fetch(kaliServerUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] Kali server KB response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Kali server KB error:", errorText)
      return NextResponse.json(
        { error: "Failed to get KB from Kali server", details: errorText },
        { status: response.status, headers: corsHeaders },
      )
    }

    // Get the KB data from Kali server
    const data = await response.json()
    console.log("[v0] Kali server KB items:", data.articles?.length || 0)

    // Return the KB data with CORS headers
    return NextResponse.json(data, { headers: corsHeaders })
  } catch (error) {
    console.error("[v0] Error in KB proxy:", error)
    return NextResponse.json(
      {
        error: "Failed to proxy KB request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: corsHeaders },
    )
  }
}
