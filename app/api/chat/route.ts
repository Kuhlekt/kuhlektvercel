import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json()

    console.log("[v0] Proxying chat request to external Kali API")

    // Forward the request to the external Kali API
    const response = await fetch("https://kali.kuhlekt-info.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      console.error("[v0] External API error:", response.status, response.statusText)
      return NextResponse.json({ error: "Failed to get response from external API" }, { status: response.status })
    }

    // Get the response from the external API
    const data = await response.json()
    console.log("[v0] Received response from external Kali API")

    // Return the response
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error proxying to external API:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
