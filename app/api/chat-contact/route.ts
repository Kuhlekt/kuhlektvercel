import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("[v0] Chat contact API called")

  try {
    const body = await request.json()
    console.log("[v0] Received data:", body)

    const { name, email, company, phone, message, conversationId } = body

    // Validate required fields
    if (!name || !email || !message) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ success: false, error: "Name, email, and message are required" }, { status: 400 })
    }

    // Split name into first and last name
    const nameParts = name.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    const supabase = await createClient()

    console.log("[v0] Inserting into form_submitters table")

    // Insert into form_submitters table
    const { data, error } = await supabase
      .from("form_submitters")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone || null,
        company: company || null,
        message: message,
        form_type: "chat_contact",
        form_data: {
          conversationId: conversationId,
          source: "chat_widget",
        },
        status: "new",
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ success: false, error: "Failed to save contact request" }, { status: 500 })
    }

    console.log("[v0] Successfully saved contact request:", data)

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
