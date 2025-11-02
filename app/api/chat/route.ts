import { type NextRequest, NextResponse } from "next/server"

// CORS headers for external widget
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
  "Access-Control-Max-Age": "86400",
}

const agentModeCounter = new Map<string, number>()

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
    console.log("[v0] Request body:", body.substring(0, 200))

    const sessionId = parsedBody.sessionId
    const agentModeCount = agentModeCounter.get(sessionId) || 0

    // If stuck in agent mode for 2+ messages, force a new session
    if (agentModeCount >= 2) {
      console.log("[v0] Session stuck in agent mode, forcing new session")
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      parsedBody.sessionId = newSessionId
      parsedBody.history = [] // Clear history for fresh start
      agentModeCounter.delete(sessionId) // Clear old session counter
      console.log("[v0] New session ID:", newSessionId)
    }

    const modifiedBody = {
      ...parsedBody,
      useKnowledgeBase: true,
      forceKnowledgeBase: true,
      resetAgent: true,
      deactivateAgent: true,
    }

    const kaliServerUrl = "https://kali.kuhlekt-info.com/api/chat?resetAgent=true&useKB=true"
    console.log("[v0] Proxying to:", kaliServerUrl)

    // Forward the request to the Kali server
    const response = await fetch(kaliServerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifiedBody),
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
      const currentCount = agentModeCounter.get(parsedBody.sessionId) || 0
      agentModeCounter.set(parsedBody.sessionId, currentCount + 1)
      console.log("[v0] Agent active but not responding, count:", currentCount + 1)
      data.response = "An agent has joined the conversation and will respond shortly..."
    } else {
      agentModeCounter.delete(parsedBody.sessionId)
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
