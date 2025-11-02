import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { externalHandoffSchema } from "@/lib/validation-schemas"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Handoff request received:", body)

    // Validate the request data
    const validation = externalHandoffSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      console.log("[v0] Validation failed:", firstError.message)
      return NextResponse.json({ success: false, error: firstError.message }, { status: 400 })
    }

    const { firstName, lastName, email, phone } = validation.data

    // Store handoff request in form_submitters table
    const { data, error } = await supabase
      .from("form_submitters")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone || null,
        form_type: "contact",
        status: "pending",
        submitted_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to save handoff request" }, { status: 500 })
    }

    const insertedRecord = data?.[0]
    console.log("[v0] Handoff request saved successfully:", insertedRecord?.id)

    return NextResponse.json({
      success: true,
      message: "Handoff request received. An agent will contact you shortly.",
      handoffId: insertedRecord?.id,
    })
  } catch (error) {
    console.error("[v0] Error processing handoff:", error)
    return NextResponse.json({ success: false, error: "Failed to process handoff request" }, { status: 500 })
  }
}
