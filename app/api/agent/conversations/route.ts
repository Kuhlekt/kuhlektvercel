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
      .from("form_submitters")
      .select("*")
      .eq("form_type", "contact")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching handoff requests:", error)
      return NextResponse.json({ error: "Failed to fetch handoff requests" }, { status: 500 })
    }

    const conversations = (data || []).map((request: any) => {
      const formData = request.form_data || {}
      const conversationId = formData.conversationId || request.id

      const handoffStatus = formData.handoffStatus || "pending"

      return {
        id: request.id,
        conversation_id: conversationId,
        session_id: formData.sessionId || request.id,
        status: request.status || "active",
        started_at: request.created_at,
        last_message_at: request.updated_at || request.created_at,
        message_count: 1, // Initial handoff request counts as 1 message
        user_email: request.email || formData.email || null,
        user_name: `${request.first_name || ""} ${request.last_name || ""}`.trim() || formData.name || "Anonymous",
        handoff_requested: true,
        handoff_at: request.created_at,
        handoff_status: handoffStatus,
        agent_name: formData.agentName || null,
        resolution_notes: formData.resolutionNotes || null,
      }
    })

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("[v0] Error in agent conversations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
