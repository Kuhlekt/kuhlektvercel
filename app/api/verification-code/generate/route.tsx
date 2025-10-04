import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

async function sendClickSendEmail(to: string, subject: string, body: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "support@kuhlekt.com"

  if (!username || !apiKey) {
    throw new Error("ClickSend credentials not configured")
  }

  const auth = Buffer.from(`${username}:${apiKey}`).toString("base64")

  const payload = {
    to: [{ email: to, name: to }],
    from: {
      email_address: fromEmail,
      name: "Kuhlekt",
    },
    subject,
    body,
  }

  console.log("Sending ClickSend email:", JSON.stringify(payload, null, 2))

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("ClickSend error:", errorText)
    throw new Error(`ClickSend API error: ${errorText}`)
  }

  return await response.json()
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in Supabase
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt,
      used: false,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to store verification code" }, { status: 500 })
    }

    // Send email via ClickSend
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-top: 0;">Your Verification Code</h2>
            <p style="color: #666; font-size: 16px;">Please use the following code to verify your email address:</p>
            <div style="background-color: white; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${code}</span>
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
        </body>
      </html>
    `

    try {
      await sendClickSendEmail(email, "Your Kuhlekt Verification Code", emailBody)
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Don't fail the request if email fails, return the code for testing
      return NextResponse.json({
        success: true,
        code,
        warning: "Email delivery failed but code was generated",
      })
    }

    return NextResponse.json({ success: true, code })
  } catch (error) {
    console.error("Error in generate verification code:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate verification code" },
      { status: 500 },
    )
  }
}
