import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export async function GET() {
  try {
    const authenticated = await isAdminAuthenticated()

    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("handoff_requested", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching handoff requests:", error)
      return NextResponse.json({ error: "Failed to fetch handoff requests", details: error.message }, { status: 500 })
    }

    console.log("[v0] Found handoff conversations:", data?.length || 0)

    const conversations = (data || []).map((conv: any) => ({
      id: conv.id,
      conversation_id: conv.conversation_id,
      session_id: conv.session_id,
      status: conv.status || "active",
      started_at: conv.started_at || conv.created_at,
      last_message_at: conv.last_message_at || conv.updated_at || conv.created_at,
      message_count: conv.message_count || 0,
      user_email: conv.user_email,
      user_name: conv.user_name || "Anonymous",
      handoff_requested: conv.handoff_requested,
      handoff_at: conv.handoff_at || conv.created_at,
      handoff_status: conv.handoff_status || "pending",
      agent_name: conv.agent_name,
      agent_id: conv.agent_id,
      resolution_notes: conv.resolution_notes,
      resolved_at: conv.resolved_at,
    }))

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("[v0] Error in agent conversations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
