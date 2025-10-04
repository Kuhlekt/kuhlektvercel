"use server"

import { createClient } from "@/lib/supabase/server"

interface ClickSendEmailPayload {
  to: Array<{
    email: string
    name: string
  }>
  from: {
    email_address: string
    name: string
  }
  subject: string
  body: string
}

async function sendClickSendEmail(to: string, subject: string, body: string): Promise<void> {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "noreply@kuhlekt.com"

  if (!username || !apiKey) {
    throw new Error("ClickSend credentials not configured")
  }

  const auth = Buffer.from(`${username}:${apiKey}`).toString("base64")

  const payload: ClickSendEmailPayload = {
    to: [
      {
        email: to,
        name: to.split("@")[0],
      },
    ],
    from: {
      email_address: fromEmail,
      name: "Kuhlekt",
    },
    subject,
    body,
  }

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`ClickSend API error: ${response.status} - ${errorBody}`)
  }
}

export async function generateVerificationCode(email: string) {
  try {
    const supabase = await createClient()

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in database
    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    })

    if (insertError) {
      console.error("Database insert error:", insertError)
      return { success: false, error: "Failed to generate verification code" }
    }

    // Send email via ClickSend
    const emailSubject = "Your Kuhlekt ROI Calculator Verification Code"
    const emailBody = `
      <h2>Your Verification Code</h2>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    `

    await sendClickSendEmail(email, emailSubject, emailBody)

    return { success: true }
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send verification code",
    }
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return { success: false, error: "Invalid or expired verification code" }
    }

    // Mark code as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return { success: false, error: "Failed to verify code" }
  }
}

export async function sendROIReport(email: string, reportData: any) {
  try {
    // Send the ROI report via ClickSend
    const emailSubject = "Your Kuhlekt ROI Calculator Report"
    const emailBody = `
      <h2>Your ROI Report</h2>
      <p>Thank you for using the Kuhlekt ROI Calculator.</p>
      <p>Here are your results:</p>
      <ul>
        <li><strong>Annual AR Volume:</strong> ${reportData.arVolume}</li>
        <li><strong>Current DSO:</strong> ${reportData.currentDSO} days</li>
        <li><strong>Potential Savings:</strong> $${reportData.savings}</li>
      </ul>
      <p>Visit <a href="https://kuhlekt.com">kuhlekt.com</a> to learn more about our solutions.</p>
    `

    await sendClickSendEmail(email, emailSubject, emailBody)

    return { success: true }
  } catch (error) {
    console.error("Error in sendROIReport:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send ROI report",
    }
  }
}
