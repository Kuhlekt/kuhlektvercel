import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

async function sendClickSendEmail(to: string, subject: string, body: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL

  if (!username || !apiKey || !fromEmail) {
    throw new Error("ClickSend credentials not configured")
  }

  const auth = Buffer.from(`${username}:${apiKey}`).toString("base64")

  // First, fetch verified email addresses to get the email_address_id
  const addressesResponse = await fetch("https://rest.clicksend.com/v3/email/addresses", {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  })

  if (!addressesResponse.ok) {
    const errorText = await addressesResponse.text()
    console.error("[ClickSend] Failed to fetch email addresses:", errorText)
    throw new Error(`Failed to fetch email addresses: ${addressesResponse.status}`)
  }

  const addressesData = await addressesResponse.json()
  console.log("[ClickSend] Email addresses response:", JSON.stringify(addressesData, null, 2))

  // Find the email address that matches our from email
  const emailAddress = addressesData.data?.data?.find(
    (addr: any) => addr.email_address === fromEmail && addr.verified === 1,
  )

  if (!emailAddress) {
    throw new Error(`Email address ${fromEmail} not found or not verified in ClickSend`)
  }

  const emailAddressId = emailAddress.email_address_id

  console.log("[ClickSend] Using email_address_id:", emailAddressId)

  const payload = {
    to: [{ email: to, name: to.split("@")[0] }],
    from: {
      email_address_id: emailAddressId,
      name: "Kuhlekt",
    },
    subject,
    body,
  }

  console.log("[ClickSend] Sending email with payload:", JSON.stringify(payload, null, 2))

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error("[ClickSend] Error response:", errorBody)
    throw new Error(`Failed to send email: ${response.status} - ${errorBody}`)
  }

  const result = await response.json()
  console.log("[ClickSend] Email sent successfully:", result)
  return result
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("[generateVerificationCode] Starting for email:", email)

    const supabase = await createClient()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    console.log("[generateVerificationCode] Generated code:", code)
    console.log("[generateVerificationCode] Expires at:", expiresAt)

    const { data, error } = await supabase
      .from("verification_codes")
      .insert({
        email,
        code,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[generateVerificationCode] Database error:", error)
      return NextResponse.json({ error: "Failed to generate verification code" }, { status: 500 })
    }

    console.log("[generateVerificationCode] Code saved to database:", data)

    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0891b2;">Your Verification Code</h2>
            <p>Thank you for using the Kuhlekt ROI Calculator.</p>
            <p>Your verification code is:</p>
            <div style="background-color: #f0f9ff; border: 2px solid #0891b2; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="font-size: 36px; letter-spacing: 8px; margin: 0; color: #0891b2;">${code}</h1>
            </div>
            <p>This code will expire in 15 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #6b7280;">
              © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `

    console.log("[generateVerificationCode] Sending email to:", email)
    await sendClickSendEmail(email, "Your Kuhlekt ROI Calculator Verification Code", emailBody)
    console.log("[generateVerificationCode] Email sent successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[generateVerificationCode] Error:", error)
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 })
  }
}
