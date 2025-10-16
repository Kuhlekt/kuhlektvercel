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
      messages.push({
        id: handoffData.id,
        role: "user",
        content: handoffData.message || formData.message || "User requested to talk to a human",
        created_at: handoffData.created_at,
      })
    }

    const { data: chatMessages, error: chatError } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (!chatError && chatMessages) {
      messages.push(...chatMessages)
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[v0] Error in agent messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
