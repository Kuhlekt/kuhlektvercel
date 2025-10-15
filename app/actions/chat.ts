"use server"

export async function sendChatMessage(
  message: string,
  conversationId: string,
  sessionId: string,
  isFirstMessage = false,
) {
  const instructedMessage = isFirstMessage
    ? `Please respond in a friendly, conversational tone. Start with a warm greeting like "Hi!", "Hey there!", or "Hello!". Keep your answer brief and succinct, but maintain a warm and helpful demeanor. After your concise answer, offer to provide more specific details if the user would like to know more.

User question: ${message}`
    : `Keep your answer brief and succinct, but maintain a warm and helpful demeanor. After your concise answer, offer to provide more specific details if the user would like to know more.

User question: ${message}`

  console.log("[v0] Attempting to connect to Kali chatbot:", {
    url: "https://kali.kuhlekt-info.com/api/chat",
    botId: 1,
    conversationId,
    sessionId,
  })

  try {
    const response = await fetch("https://kali.kuhlekt-info.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: instructedMessage,
        botId: 1,
        conversationId,
        sessionId,
        userId: "anonymous",
      }),
    })

    console.log("[v0] Kali API response status:", response.status)
    console.log("[v0] Kali API response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Kali API error response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 500), // First 500 chars to avoid huge logs
      })
      throw new Error(`API request failed: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] Kali API success response:", {
      success: data.success,
      hasResponse: !!data.response,
      source: data.source,
    })

    if (!data.success) {
      throw new Error(data.error || "Failed to get response")
    }

    return {
      success: true,
      response: data.response,
      source: data.source,
    }
  } catch (error) {
    console.error("[v0] Error calling Kali API:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
