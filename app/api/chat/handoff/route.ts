import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, userId, userEmail, userName, reason } = body

    // Validate required fields
    if (!userEmail || !userName) {
      return NextResponse.json({ success: false, error: "userName and userEmail are required" }, { status: 400 })
    }

    // Split name into first and last name
    const nameParts = userName.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    const supabase = await createClient()

    const insertData = {
      first_name: firstName,
      last_name: lastName,
      email: userEmail,
      phone: null,
      company: null,
      message: reason || "User requested to speak with a human agent",
      form_type: "contact",
      form_data: {
        sessionId: sessionId,
        userId: userId,
        source: "chatbot_handoff",
      },
      status: "new",
      submitted_at: new Date().toISOString(),
    }

    // Insert into form_submitters table
    const { data, error } = await supabase.from("form_submitters").insert(insertData).select().single()

    if (error) {
      console.error("[v0] Handoff save error:", error)
      return NextResponse.json({ success: false, error: "Failed to save handoff request" }, { status: 500 })
    }

    try {
      const notifyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/notify-admin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "chat_handoff",
            data: {
              name: userName,
              email: userEmail,
              reason: reason || "User requested to speak with a human agent",
              sessionId: sessionId,
              userId: userId,
              timestamp: new Date().toISOString(),
            },
          }),
        },
      )

      if (!notifyResponse.ok) {
        console.error("[v0] Failed to send admin notification")
      }
    } catch (notifyError) {
      console.error("[v0] Admin notification error:", notifyError)
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      success: true,
      message: "Handoff request received. An agent will contact you shortly.",
      handoffId: data.id,
    })
  } catch (error) {
    console.error("[v0] Chat handoff API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 },
    )
  }
}
