"use server"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function sendClickSendEmail(to: string, subject: string, html: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "support@kuhlekt.com"

  if (!username || !apiKey) {
    throw new Error("ClickSend credentials not configured")
  }

  const auth = Buffer.from(`${username}:${apiKey}`).toString("base64")

  // Simplified payload without email_address_id - will use default verified sender
  const payload = {
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
    subject: subject,
    body: html,
  }

  console.log("ClickSend payload:", JSON.stringify(payload, null, 2))

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("ClickSend error:", errorText)
    throw new Error(`ClickSend API error: ${response.status} - ${errorText}`)
  }

  return await response.json()
}

export async function generateVerificationCode(email: string) {
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in Supabase
    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      used: false,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      throw new Error("Failed to store verification code")
    }

    // Send email via ClickSend
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .code { font-size: 32px; font-weight: bold; color: #0066cc; letter-spacing: 5px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Your ROI Calculator Verification Code</h2>
            <p>Please use the following code to verify your email and receive your ROI calculation results:</p>
            <div class="code">${code}</div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, "Your Kuhlekt ROI Calculator Verification Code", emailHtml)
    console.log("Verification email sent successfully to:", email)

    return { success: true }
  } catch (error) {
    console.error("Error generating verification code:", error)
    throw error
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    // Find the most recent unused code for this email
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
    console.error("Error verifying code:", error)
    return { success: false, error: "Failed to verify code" }
  }
}

export async function sendROIReport(email: string, pdfBase64: string) {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0066cc; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Calculation Results</h1>
            </div>
            <div class="content">
              <p>Thank you for using the Kuhlekt ROI Calculator!</p>
              <p>Your detailed ROI report is attached to this email as a PDF document.</p>
              <p>The report includes:</p>
              <ul>
                <li>Your current accounts receivable metrics</li>
                <li>Potential savings with automation</li>
                <li>Projected return on investment</li>
                <li>Key recommendations for improvement</li>
              </ul>
              <p>If you have any questions about your results or would like to discuss how Kuhlekt can help improve your accounts receivable process, please don't hesitate to contact us.</p>
              <a href="https://kuhlekt.com/contact" class="button">Contact Us</a>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
                <p>This email was sent to ${email} because you requested an ROI calculation.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const username = process.env.CLICKSEND_USERNAME
    const apiKey = process.env.CLICKSEND_API_KEY
    const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "support@kuhlekt.com"

    if (!username || !apiKey) {
      throw new Error("ClickSend credentials not configured")
    }

    const auth = Buffer.from(`${username}:${apiKey}`).toString("base64")

    const payload = {
      to: [
        {
          email: email,
          name: email.split("@")[0],
        },
      ],
      from: {
        email_address: fromEmail,
        name: "Kuhlekt",
      },
      subject: "Your Kuhlekt ROI Calculator Results",
      body: emailHtml,
      attachments: [
        {
          content: pdfBase64,
          type: "application/pdf",
          filename: "kuhlekt-roi-report.pdf",
          disposition: "attachment",
        },
      ],
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
      const errorText = await response.text()
      console.error("ClickSend error:", errorText)
      throw new Error(`Failed to send ROI report: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI report:", error)
    throw error
  }
}
