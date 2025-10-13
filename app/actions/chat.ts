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

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Kali API error:", errorText)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "Failed to get response")
    }

    return {
      success: true,
      response: data.response,
      source: data.source,
    }
  } catch (error) {
    console.error("Error calling Kali API:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
