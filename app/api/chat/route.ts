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

    if (agentModeCount >= 1) {
      console.log("[v0] Session stuck in agent mode, forcing new session")
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      parsedBody.sessionId = newSessionId
      parsedBody.history = [] // Clear history for fresh start
      agentModeCounter.delete(sessionId) // Clear old session counter
      console.log("[v0] New session ID:", newSessionId)
    }

    const kaliServerUrl = "https://chatbot.hindleconsultants.com/api/chat"
    console.log("[v0] Proxying to:", kaliServerUrl)

    let lastError: any = null
    let response: Response | null = null
    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[v0] Attempt ${attempt}/${maxRetries}`)

        // Forward the request to the Kali server
        response = await fetch(kaliServerUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedBody),
        })

        console.log("[v0] Kali server response status:", response.status)

        // If successful, break out of retry loop
        if (response.ok) {
          break
        }

        // If 500 error, try again
        if (response.status === 500 && attempt < maxRetries) {
          const errorText = await response.text()
          console.log(`[v0] Attempt ${attempt} failed with 500, retrying...`)
          lastError = errorText
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)) // Exponential backoff
          continue
        }

        // For other errors, don't retry
        if (!response.ok) {
          lastError = await response.text()
          break
        }
      } catch (error) {
        console.error(`[v0] Attempt ${attempt} error:`, error)
        lastError = error
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
        }
      }
    }

    if (!response || !response.ok) {
      console.error("[v0] All retry attempts failed, returning fallback response")
      agentModeCounter.delete(parsedBody.sessionId) // Clear counter for this session
      return NextResponse.json(
        {
          success: true,
          response:
            "I'm having trouble connecting to my knowledge base right now. Please try asking your question again in a moment, or contact support if the issue persists.",
          agentActive: false,
        },
        { headers: corsHeaders },
      )
    }

    // Get the response from Kali server
    const data = await response.json()
    console.log("[v0] Kali server response:", JSON.stringify(data).substring(0, 200))

    if (!data.success && data.error === "AI failed to generate response") {
      console.log("[v0] AI generation failed, returning fallback response")
      agentModeCounter.delete(parsedBody.sessionId) // Clear counter for this session
      return NextResponse.json(
        {
          success: true,
          response:
            "I'm having trouble generating a response right now. Please try rephrasing your question or contact support for assistance.",
          agentActive: false,
        },
        { headers: corsHeaders },
      )
    }

    if (data.agentActive && (!data.response || data.response.trim() === "")) {
      const currentCount = agentModeCounter.get(parsedBody.sessionId) || 0
      agentModeCounter.set(parsedBody.sessionId, currentCount + 1)
      console.log("[v0] Agent active but not responding, count:", currentCount + 1)
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

// DELETE handler to clear all sessions
export async function DELETE() {
  console.log("[v0] Clearing all chat sessions")
  agentModeCounter.clear()
  return NextResponse.json({ success: true, message: "All chat sessions cleared" }, { headers: corsHeaders })
}
