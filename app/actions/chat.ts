"use server"

export async function sendChatMessage(
  message: string,
  conversationId: string,
  sessionId: string,
  isFirstMessage = false,
) {
  console.log("[v0] Sending message to Kali API:", { message, conversationId, sessionId, isFirstMessage })

  const instructedMessage = isFirstMessage
    ? `Please respond in a friendly, conversational tone. Start with a warm greeting like "Hi!", "Hey there!", or "Hello!". Keep your answer brief and succinct, but maintain a warm and helpful demeanor. After your concise answer, offer to provide more specific details if the user would like to know more.

User question: ${message}`
    : `Keep your answer brief and succinct, but maintain a warm and helpful demeanor. After your concise answer, offer to provide more specific details if the user would like to know more.

User question: ${message}`

  try {
    const response = await fetch("https://v0-website-chatbot-eight.vercel.app/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: instructedMessage, // Send instructed message instead of raw message
        botId: 1,
        conversationId,
        sessionId,
        userId: "anonymous",
      }),
    })

    console.log("[v0] Kali API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Kali API error:", errorText)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Kali API response:", data)

    if (!data.success) {
      throw new Error(data.error || "Failed to get response")
    }

    return {
      success: true,
      response: data.response,
      source: data.source,
    }
  } catch (error) {
    console.error("[v0] Error calling Kali API:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
