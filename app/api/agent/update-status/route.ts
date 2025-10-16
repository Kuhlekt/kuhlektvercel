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
    const { conversationId, status, resolutionNotes } = body

    if (!conversationId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const updateData: any = {
      status: status,
      updated_at: new Date().toISOString(),
    }

    if (resolutionNotes) {
      updateData.form_data = supabase.raw(
        `
        COALESCE(form_data, '{}'::jsonb) || 
        jsonb_build_object('resolutionNotes', $1, 'resolvedAt', $2)
      `,
        [resolutionNotes, new Date().toISOString()],
      )
    }

    const { error } = await supabase.from("form_submitters").update(updateData).eq("id", conversationId)

    if (error) {
      console.error("[v0] Error updating handoff status:", error)
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in agent update-status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
