"use server"

export async function sendChatMessage(messages: { role: string; content: string }[]) {
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

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
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
