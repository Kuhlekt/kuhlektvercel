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

    console.log("[v0] Updating handoff status:", { conversationId, status, resolutionNotes })

    const supabase = await createClient()

    // Build the JSONB update object
    const jsonbUpdate: any = { handoffStatus: status }

    if (resolutionNotes) {
      jsonbUpdate.resolutionNotes = resolutionNotes
      jsonbUpdate.resolvedAt = new Date().toISOString()
    }

    // Update form_data by merging with existing data
    const { data: currentData, error: fetchError } = await supabase
      .from("form_submitters")
      .select("form_data")
      .eq("id", conversationId)
      .single()

    if (fetchError) {
      console.error("[v0] Error fetching current data:", fetchError)
      return NextResponse.json({ error: "Failed to fetch current data", details: fetchError.message }, { status: 500 })
    }

    const updatedFormData = {
      ...(currentData?.form_data || {}),
      ...jsonbUpdate,
    }

    const { error } = await supabase
      .from("form_submitters")
      .update({ form_data: updatedFormData })
      .eq("id", conversationId)

    if (error) {
      console.error("[v0] Error updating handoff status:", error)
      return NextResponse.json({ error: "Failed to update status", details: error.message }, { status: 500 })
    }

    console.log("[v0] Successfully updated handoff status")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in agent update-status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
