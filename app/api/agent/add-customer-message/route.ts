import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { handoffId, message } = await request.json()

    const supabase = await createClient()

    // Get the current handoff request
    const { data: handoff, error: fetchError } = await supabase
      .from("form_submitters")
      .select("form_data")
      .eq("id", handoffId)
      .single()

    if (fetchError || !handoff) {
      return NextResponse.json({ success: false, error: "Handoff not found" }, { status: 404 })
    }

    // Add customer message to the conversation
    const formData = (handoff.form_data as any) || {}
    const customerMessages = formData.customerMessages || []
    customerMessages.push({
      message,
      timestamp: new Date().toISOString(),
    })

    // Update the handoff request with the new message
    const { error: updateError } = await supabase
      .from("form_submitters")
      .update({
        form_data: {
          ...formData,
          customerMessages,
        },
      })
      .eq("id", handoffId)

    if (updateError) {
      return NextResponse.json({ success: false, error: "Failed to save message" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in add-customer-message:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
