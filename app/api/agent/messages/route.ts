import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get("admin-auth")

    if (!adminAuth || adminAuth.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: handoffData, error: handoffError } = await supabase
      .from("form_submitters")
      .select("*")
      .eq("id", conversationId)
      .single()

    const messages: any[] = []

    if (handoffData && !handoffError) {
      const formData = handoffData.form_data || {}

      // Add initial user message
      messages.push({
        id: `${handoffData.id}-initial`,
        conversation_id: conversationId,
        message: handoffData.message || formData.message || "User requested to talk to a human",
        sender: "user",
        created_at: handoffData.created_at,
      })

      // Add agent responses from form_data.agentResponses array
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
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[v0] Error in agent messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
