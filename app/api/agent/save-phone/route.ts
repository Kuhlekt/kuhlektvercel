import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { phoneNumberSchema } from "@/lib/validation-schemas"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await isAdminAuthenticated()
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const validation = phoneNumberSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: validation.error.errors },
        { status: 400 },
      )
    }

    const { handoffId, phoneNumber } = validation.data

    const supabase = await createClient()

    // Fetch the handoff request
    const { data: handoffRequest, error: fetchError } = await supabase
      .from("form_submitters")
      .select("form_data")
      .eq("id", handoffId)
      .single()

    if (fetchError || !handoffRequest) {
      return NextResponse.json({ success: false, error: "Handoff request not found" }, { status: 404 })
    }

    const sanitizedPhone = phoneNumber.replace(/[^\d+\-() ]/g, "")

    // Merge phone number into form_data
    const updatedFormData = {
      ...(handoffRequest.form_data || {}),
      phoneNumber: sanitizedPhone,
      phoneNumberProvidedAt: new Date().toISOString(),
    }

    const { error: updateError } = await supabase
      .from("form_submitters")
      .update({
        form_data: updatedFormData,
      })
      .eq("id", handoffId)

    if (updateError) {
      return NextResponse.json({ success: false, error: "Failed to save phone number" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Phone number saved successfully",
    })
  } catch (error) {
    console.error("Error in save-phone API")
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
