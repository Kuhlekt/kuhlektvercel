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
    const parsedBody = JSON.parse(body)
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

    if (data.agentActive && (!data.response || data.response.trim() === "")) {
      console.log("[v0] Agent active but not responding, querying KB...")

      try {
        // Query the KB for an answer
        const kbResponse = await fetch("https://kali.kuhlekt-info.com/api/chat/knowledge/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: parsedBody.message,
            limit: 3,
          }),
        })

        if (kbResponse.ok) {
          const kbData = await kbResponse.json()
          console.log("[v0] KB search results:", kbData.results?.length || 0)

          if (kbData.results && kbData.results.length > 0) {
            // Use the top KB result as the response
            const topResult = kbData.results[0]
            data.response =
              topResult.answer ||
              topResult.content ||
              "I found some information in the knowledge base, but couldn't format a response."
            data.kbUsed = true
            console.log("[v0] Using KB answer instead of empty agent response")
          }
        }
      } catch (kbError) {
        console.error("[v0] Error querying KB:", kbError)
        // Continue with empty response if KB query fails
      }
    }

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
