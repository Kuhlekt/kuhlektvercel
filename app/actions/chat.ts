"use server"

import { createClient } from "@/lib/supabase/server"

export async function sendChatMessage(
  message: string,
  conversationId: string,
  sessionId: string,
  isFirstMessage = false,
) {
  const supabase = await createClient()

  try {
    // Create or update conversation record
    const { data: existingConv } = await supabase
      .from("chat_conversations")
      .select("id")
      .eq("conversation_id", conversationId)
      .single()

    if (!existingConv) {
      await supabase.from("chat_conversations").insert({
        conversation_id: conversationId,
        session_id: sessionId,
        status: "active",
        message_count: 0,
      })
    }

    // Save user message
    await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: message,
    })

    // Update conversation metadata
    await supabase
      .from("chat_conversations")
      .update({
        last_message_at: new Date().toISOString(),
        message_count: supabase.rpc("increment", { row_id: conversationId }),
        updated_at: new Date().toISOString(),
      })
      .eq("conversation_id", conversationId)
  } catch (dbError) {
    console.error("[v0] Error saving message to database:", dbError)
    // Continue even if database save fails
  }

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
      console.error("[v0] Kali API error response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 500),
      })
      throw new Error(`API request failed: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "Failed to get response")
    }

    try {
      await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: data.response,
      })

      // Update conversation metadata
      await supabase
        .from("chat_conversations")
        .update({
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("conversation_id", conversationId)
    } catch (dbError) {
      console.error("[v0] Error saving assistant response to database:", dbError)
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
