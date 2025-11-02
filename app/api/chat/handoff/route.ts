import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { externalHandoffSchema } from "@/lib/validation-schemas"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

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

    console.log("[v0] Forwarding handoff to Kali server...")
    try {
      const enhancedHandoffData = {
        ...body,
        // Add metadata to help Kali server create inbound chat
        metadata: {
          source: "kuhlekt.com",
          timestamp: new Date().toISOString(),
          conversationType: "inbound_chat",
          requiresResponse: true,
        },
        // Include any conversation history if provided
        conversationHistory: body.conversationHistory || body.history || [],
      }

      console.log("[v0] Enhanced handoff data:", enhancedHandoffData)

      const kaliResponse = await fetch("https://kali.kuhlekt-info.com/api/chat/handoff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enhancedHandoffData),
      })

      console.log("[v0] Kali server handoff response status:", kaliResponse.status)

      if (kaliResponse.ok) {
        const kaliData = await kaliResponse.json()
        console.log("[v0] Handoff forwarded to Kali server successfully:", kaliData)
      } else {
        const errorText = await kaliResponse.text()
        console.error("[v0] Failed to forward handoff to Kali server:", kaliResponse.statusText, errorText)
      }
    } catch (kaliError) {
      console.error("[v0] Error forwarding to Kali server:", kaliError)
      // Continue with local save even if Kali forward fails
    }

    console.log("[v0] Attempting database insert...")
    const { data, error } = await supabase
      .from("form_submitters")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: userEmail,
        phone: phone || null,
        form_type: "contact",
        status: "new",
        submitted_at: new Date().toISOString(),
      })
      .select()

    console.log("[v0] Database response:", { data, error })

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to save handoff request" },
        { status: 500, headers: corsHeaders },
      )
    }

    const insertedRecord = data && data.length > 0 ? data[0] : null
    console.log("[v0] Inserted record:", insertedRecord)

    if (!insertedRecord) {
      console.error("[v0] No record returned from insert")
      return NextResponse.json(
        { success: false, error: "Failed to create handoff record" },
        { status: 500, headers: corsHeaders },
      )
    }

    console.log("[v0] Handoff request saved successfully:", insertedRecord.id)

    return NextResponse.json(
      {
        success: true,
        message: "Handoff request received. An agent will contact you shortly.",
        handoffId: insertedRecord.id,
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
