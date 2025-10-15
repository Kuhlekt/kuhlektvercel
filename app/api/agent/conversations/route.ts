import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Check admin authentication
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get("admin-auth")

    if (!adminAuth || adminAuth.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("handoff_requested", true)
      .order("handoff_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching conversations:", error)
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }

    return NextResponse.json({ conversations: data })
  } catch (error) {
    console.error("[v0] Error in agent conversations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
