import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { externalHandoffSchema } from "@/lib/validation-schemas"

const sql = neon(process.env.NEON_DATABASE_URL!)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
  "Access-Control-Max-Age": "86400",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Handoff request received:", body)

    console.log("[v0] Starting validation...")
    const validation = externalHandoffSchema.safeParse(body)
    console.log("[v0] Validation result:", { success: validation.success })

    if (!validation.success) {
      console.log("[v0] Validation errors:", validation.error.issues)
      const firstError = validation.error.issues[0]
      console.log("[v0] Validation failed:", firstError.message)
      return NextResponse.json({ success: false, error: firstError.message }, { status: 400, headers: corsHeaders })
    }

    const { firstName, lastName, userEmail, phone } = validation.data
    console.log("[v0] Validated data:", { firstName, lastName, email: userEmail, phone })

    console.log("[v0] Attempting database insert...")
    const result = await sql(
      `INSERT INTO form_submitters (first_name, last_name, email, phone, form_type, status, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [firstName, lastName, userEmail, phone || null, "contact", "new", new Date().toISOString()],
    )

    const insertedId = result?.[0]?.id

    console.log("[v0] Database response:", { insertedId })

    if (!insertedId) {
      console.error("[v0] No record returned from insert")
      return NextResponse.json(
        { success: false, error: "Failed to create handoff record" },
        { status: 500, headers: corsHeaders },
      )
    }

    console.log("[v0] Handoff request saved successfully:", insertedId)

    return NextResponse.json(
      {
        success: true,
        message: "Handoff request received. An agent will contact you shortly.",
        handoffId: insertedId,
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error("[v0] Error processing handoff:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json(
      { success: false, error: "Failed to process handoff request" },
      { status: 500, headers: corsHeaders },
    )
  }
}
