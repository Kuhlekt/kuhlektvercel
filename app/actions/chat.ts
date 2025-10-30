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
    // Save conversation and user message to database
    try {
      const { data: existingConv } = await supabase
        .from("chat_conversations")
        .select("id")
        .eq("conversation_id", conversationId)
        .maybeSingle()

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
          updated_at: new Date().toISOString(),
        })
        .eq("conversation_id", conversationId)
    } catch (dbError) {
      console.error("Error saving message to database:", dbError)
      // Continue even if database save fails
    }

    const systemPrompt = `You are a helpful customer support assistant for Kuhlekt, a company that provides business solutions. 
Your role is to:
- Answer questions about Kuhlekt's products and services
- Provide technical support and guidance
- Be friendly, professional, and concise
- If you don't know something, be honest and suggest talking to a human agent

Keep responses brief and to the point (2-3 sentences max), but warm and helpful.
${isFirstMessage ? "Start with a friendly greeting like 'Hi!', 'Hey there!', or 'Hello!'." : ""}`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const text =
      data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again."

    // Save assistant response to database
    try {
      await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: text,
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
      console.error("Error saving assistant response to database:", dbError)
      // Continue even if database save fails
    }

    return {
      success: true,
      response: text,
      source: "openai",
    }
  } catch (error) {
    console.error("Error in sendChatMessage:", error)

    return {
      success: true,
      response:
        "I apologize, but I'm having trouble processing your request right now. Please try asking your question again, or click 'Talk to Human' to speak with a team member who can help you immediately.",
      source: "fallback",
    }
  }
}

export async function sendMessageToAgent(message: string, handoffId: string) {
  const supabase = await createClient()

  try {
    console.log("[v0] Sending message to agent - handoffId:", handoffId, "message:", message)

    // Get the current handoff request
    const { data: handoff, error: fetchError } = await supabase
      .from("form_submitters")
      .select("form_data")
      .eq("id", handoffId)
      .single()

    if (fetchError || !handoff) {
      console.error("[v0] Error fetching handoff:", fetchError)
      return { success: false, error: "Handoff not found" }
    }

    // Add customer message to the conversation
    const formData = (handoff.form_data as any) || {}
    const customerMessages = formData.customerMessages || []
    customerMessages.push({
      message,
      timestamp: new Date().toISOString(),
    })

    // Update the handoff request with the new message
    const { error: updateError } = await supabase
      .from("form_submitters")
      .update({
        form_data: {
          ...formData,
          customerMessages,
        },
      })
      .eq("id", handoffId)

    if (updateError) {
      console.error("[v0] Error updating handoff with customer message:", updateError)
      return { success: false, error: "Failed to save message" }
    }

    console.log("[v0] Customer message saved successfully")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error in sendMessageToAgent:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
