import { type NextRequest, NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await isAdminAuthenticated()

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { conversationHistory, userQuestion } = body

    if (!userQuestion) {
      return NextResponse.json({ error: "Missing user question" }, { status: 400 })
    }

    // Call Kali chatbot for suggested response
    const kaliResponse = await fetch("https://kali.kuhlekt-info.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userQuestion,
        conversationHistory: conversationHistory || [],
        botId: 1,
        sessionId: `agent-assist-${Date.now()}`,
        customInstructions:
          "You are assisting a human agent. Provide a helpful, professional response that the agent can use or adapt when responding to the customer.",
      }),
    })

    if (!kaliResponse.ok) {
      console.error("[v0] Kali API error:", kaliResponse.status)
      return NextResponse.json({ error: "Failed to get suggestion from Kali" }, { status: 500 })
    }

    const kaliData = await kaliResponse.json()

    return NextResponse.json({
      success: true,
      suggestion: kaliData.response || kaliData.message,
    })
  } catch (error) {
    console.error("[v0] Error in kali-suggest:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
