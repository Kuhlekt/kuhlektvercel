import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { conversationIdSchema } from "@/lib/validation-schemas"

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await isAdminAuthenticated()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")

    const validation = conversationIdSchema.safeParse({ conversationId })
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid conversation ID" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: handoffData, error: handoffError } = await supabase
      .from("form_submitters")
      .select("*")
      .eq("id", conversationId)
      .single()

    if (handoffError || !handoffData) {
      return NextResponse.json({ error: "Conversation not found or access denied" }, { status: 404 })
    }

    const messages: any[] = []
    const formData = handoffData.form_data || {}

    // Add initial user message
    messages.push({
      id: `${handoffData.id}-initial`,
      conversation_id: conversationId,
      message: handoffData.message || formData.message || "User requested to talk to a human",
      sender: "user",
      created_at: handoffData.created_at,
    })

    // Add customer messages sent after handoff
    if (formData.customerMessages && Array.isArray(formData.customerMessages)) {
      formData.customerMessages.forEach((msg: any, index: number) => {
        messages.push({
          id: `${handoffData.id}-customer-${index}`,
          conversation_id: conversationId,
          message: msg.message,
          sender: "user",
          created_at: msg.timestamp,
        })
      })
    }

    // Add agent responses
    if (formData.agentResponses && Array.isArray(formData.agentResponses)) {
      formData.agentResponses.forEach((response: any, index: number) => {
        messages.push({
          id: `${handoffData.id}-agent-${index}`,
          conversation_id: conversationId,
          message: response.message,
          sender: "agent",
          created_at: response.timestamp,
        })
      })
    }

    // Sort messages chronologically
    messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error in agent messages")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
