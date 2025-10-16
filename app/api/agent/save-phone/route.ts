import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { handoffId, phoneNumber } = await request.json()

    if (!handoffId || !phoneNumber) {
      return NextResponse.json({ success: false, error: "Missing handoffId or phoneNumber" }, { status: 400 })
    }

    const supabase = await createClient()

    // Update the handoff request with the phone number
    const { data: handoffRequest, error: fetchError } = await supabase
      .from("form_submitters")
      .select("form_data")
      .eq("id", handoffId)
      .single()

    if (fetchError || !handoffRequest) {
      console.error("Error fetching handoff request:", fetchError)
      return NextResponse.json({ success: false, error: "Handoff request not found" }, { status: 404 })
    }

    // Merge phone number into form_data
    const updatedFormData = {
      ...(handoffRequest.form_data || {}),
      phoneNumber,
      phoneNumberProvidedAt: new Date().toISOString(),
    }

    const { error: updateError } = await supabase
      .from("form_submitters")
      .update({
        form_data: updatedFormData,
      })
      .eq("id", handoffId)

    if (updateError) {
      console.error("Error updating handoff request with phone number:", updateError)
      return NextResponse.json({ success: false, error: "Failed to save phone number" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Phone number saved successfully",
    })
  } catch (error) {
    console.error("Error in save-phone API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
