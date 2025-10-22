import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { handoffIdSchema } from "@/lib/validation-schemas"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const handoffId = searchParams.get("handoffId")

    const validation = handoffIdSchema.safeParse({ handoffId })
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch the handoff request
    const { data: handoffData, error } = await supabase.from("form_submitters").select("*").eq("id", handoffId).single()

    if (error || !handoffData) {
      return NextResponse.json({ hasResponse: false, messages: [] })
    }

    const formData = handoffData.form_data || {}
    const agentResponses = formData.agentResponses || []

    // Check if there are any agent responses
    if (agentResponses.length > 0) {
      return NextResponse.json({
        hasResponse: true,
        messages: agentResponses,
      })
    }

    return NextResponse.json({ hasResponse: false, messages: [] })
  } catch (error) {
    console.error("Error checking agent response")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
