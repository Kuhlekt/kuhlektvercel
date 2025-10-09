"use server"

export async function sendChatMessage(messages: { role: string; content: string }[]) {
  console.log("[v0] Chat action called with messages:", messages.length)
  console.log("[v0] OpenAI API key exists:", !!process.env.OPENAI_API_KEY)

  if (!process.env.OPENAI_API_KEY) {
    console.error("[v0] OPENAI_API_KEY is not set")
    return {
      success: false,
      message: "Chat service is not configured. Please contact support.",
    }
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        stream: false,
      }),
    })

    console.log("[v0] OpenAI API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] OpenAI API error:", response.status, errorText)
      return {
        success: false,
        message: "I'm having trouble connecting right now. Please try again in a moment.",
      }
    }

    const data = await response.json()
    console.log("[v0] OpenAI API success, message length:", data.choices[0].message.content.length)

    return {
      success: true,
      message: data.choices[0].message.content,
    }
  } catch (error) {
    console.error("[v0] Chat error:", error)
    return {
      success: false,
      message: "I apologize, but I encountered an error. Please try again.",
    }
  }
}
