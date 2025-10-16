import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get("admin-auth")

    if (!adminAuth || adminAuth.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { conversationId, message, agentName } = body

    if (!conversationId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: messageData, error: messageError } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversationId,
        role: "agent",
        content: message,
      })
      .select()
      .single()

    if (messageError) {
      console.error("[v0] Error saving agent message:", messageError)
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    const { error: updateError } = await supabase
      .from("form_submitters")
      .update({
        status: "in_progress",
        updated_at: new Date().toISOString(),
        form_data: supabase.raw(
          `
          COALESCE(form_data, '{}'::jsonb) || 
          jsonb_build_object('agentName', $1, 'lastAgentMessage', $2)
        `,
          [agentName, message],
        ),
      })
      .eq("id", conversationId)

    if (updateError) {
      console.error("[v0] Error updating handoff request:", updateError)
    }

    return NextResponse.json({
      success: true,
      message: messageData,
    })
  } catch (error) {
    console.error("[v0] Error in agent send-message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
