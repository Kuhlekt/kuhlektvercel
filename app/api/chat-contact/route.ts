import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Chat contact request received:", {
      name: body.name,
      email: body.email,
      hasConversationId: !!body.conversationId,
    })

    const { name, email, conversationId } = body

    if (!name || !email) {
      console.log("[v0] Validation failed: missing required fields")
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    // Split name into first and last name
    const nameParts = name.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    const supabase = await createClient()

    const insertData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: null,
      company: null,
      message: "User requested to speak with a human agent",
      form_type: "contact",
      form_data: {
        conversationId: conversationId,
        source: "chat_widget",
      },
      status: "new",
      submitted_at: new Date().toISOString(),
    }

    console.log("[v0] Inserting into database:", { firstName, lastName, email, conversationId })

    // Insert into form_submitters table
    const { data, error } = await supabase.from("form_submitters").insert(insertData).select().single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ success: false, error: "Failed to save contact request" }, { status: 500 })
    }

    console.log("[v0] Successfully saved contact request:", data.id)

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll be in touch soon.",
    })
  } catch (error) {
    console.error("[v0] Chat contact API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 },
    )
  }
}
