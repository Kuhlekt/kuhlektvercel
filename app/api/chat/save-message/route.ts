import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { conversationId, sessionId, role, content, isFirstMessage } = await request.json()

    const supabase = await createClient()

    // Save conversation if it doesn't exist
    if (isFirstMessage) {
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
    }

    // Save message
    await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      role,
      content,
    })

    // Update conversation metadata
    await supabase
      .from("chat_conversations")
      .update({
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("conversation_id", conversationId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving message:", error)
    return NextResponse.json({ success: false, error: "Failed to save message" }, { status: 500 })
  }
}
