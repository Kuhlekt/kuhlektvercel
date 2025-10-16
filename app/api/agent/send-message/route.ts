import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Agent send-message API called")

    // Check admin authentication
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get("admin-auth")

    console.log("[v0] Admin auth cookie:", adminAuth?.value)

    if (!adminAuth || adminAuth.value !== "authenticated") {
      console.log("[v0] Unauthorized - no valid admin auth")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Request body:", body)

    const { conversationId, message } = body

    if (!conversationId || !message) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()
    console.log("[v0] Supabase client created")

    const { data: handoffData, error: fetchError } = await supabase
      .from("form_submitters")
      .select("*")
      .eq("id", conversationId)
      .single()

    if (fetchError) {
      console.error("[v0] Error fetching handoff request:", fetchError)
      return NextResponse.json({ error: "Handoff request not found" }, { status: 404 })
    }

    console.log("[v0] Found handoff request:", handoffData)

    const currentFormData = (handoffData.form_data as any) || {}
    const agentResponses = currentFormData.agentResponses || []
    agentResponses.push({
      message,
      timestamp: new Date().toISOString(),
    })

    const updatedFormData = {
      ...currentFormData,
      agentResponses,
      lastAgentMessage: message,
      lastAgentMessageAt: new Date().toISOString(),
    }

    console.log("[v0] Updating with form_data:", updatedFormData)

    const { error: updateError } = await supabase
      .from("form_submitters")
      .update({
        status: "in_progress",
        form_data: updatedFormData,
      })
      .eq("id", conversationId)

    if (updateError) {
      console.error("[v0] Error updating handoff request:", updateError)
      return NextResponse.json({ error: "Failed to save message", details: updateError.message }, { status: 500 })
    }

    console.log("[v0] Successfully saved agent message")

    return NextResponse.json({
      success: true,
      message: {
        id: Date.now().toString(),
        conversation_id: conversationId,
        message,
        sender: "agent",
        created_at: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[v0] Error in agent send-message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
