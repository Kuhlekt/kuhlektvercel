import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase/server"

export async function DELETE() {
  try {
    const authenticated = await isAdminAuthenticated()

    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create Supabase client
    const supabase = await createClient()

    // Delete all chat handoff requests (form_type = 'contact')
    const { error } = await supabase.from("form_submitters").delete().eq("form_type", "contact")

    if (error) {
      console.error("[v0] Error deleting chat handoffs:", error)
      return NextResponse.json({ error: "Failed to delete chat handoffs", details: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "All chat handoffs deleted successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error in delete-all-chats:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
