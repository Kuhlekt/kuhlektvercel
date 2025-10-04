import { NextResponse } from "next/server"
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

  // First, fetch verified email addresses to get the email_address_id
  console.log("[ClickSend] Fetching email addresses...")
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
    console.error("[ClickSend] No verified email found matching:", fromEmail)
    throw new Error(`Email address ${fromEmail} not found or not verified in ClickSend`)
  }

  const emailAddressId = emailAddress.email_address_id
  console.log("[ClickSend] Using email_address_id:", emailAddressId)

  const payload = {
    to: [
      {
        email: to,
        name: to.split("@")[0],
      },
    ],
    from: {
      email_address_id: emailAddressId,
      name: "Kuhlekt",
    },
    subject: subject,
    body: html,
  }

  console.log("[ClickSend] Sending email with payload:", JSON.stringify(payload, null, 2))

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
    console.error("[ClickSend] Error response:", errorText)
    throw new Error(`ClickSend API error: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  console.log("[ClickSend] Email sent successfully:", result)
  return result
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("[Verification Code] Generating code for:", email)

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
      console.error("[Verification Code] Database error:", dbError)
      return NextResponse.json({ error: "Failed to store verification code" }, { status: 500 })
    }

    console.log("[Verification Code] Code stored in database:", code)

    // Send email via ClickSend
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0;
              padding: 0;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 2px solid #0891b2;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #0891b2;
            }
            .content {
              padding: 30px 0;
            }
            .code-box { 
              font-size: 36px; 
              font-weight: bold; 
              color: #0891b2; 
              letter-spacing: 8px; 
              text-align: center; 
              padding: 30px; 
              background: linear-gradient(to bottom, #f0f9ff, #e0f2fe); 
              border: 2px solid #0891b2;
              border-radius: 10px; 
              margin: 30px 0; 
            }
            .info {
              background: #f9fafb;
              border-left: 4px solid #0891b2;
              padding: 15px;
              margin: 20px 0;
            }
            .footer { 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #ddd; 
              font-size: 12px; 
              color: #666; 
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Kuhlekt</div>
            </div>
            <div class="content">
              <h2 style="color: #0891b2;">Your ROI Calculator Verification Code</h2>
              <p>Thank you for using the Kuhlekt ROI Calculator. Please use the following code to verify your email and receive your ROI calculation results:</p>
              <div class="code-box">${code}</div>
              <div class="info">
                <p style="margin: 0;"><strong>Important:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>This code will expire in <strong>10 minutes</strong></li>
                  <li>Enter this code in the verification page to view your results</li>
                  <li>If you didn't request this code, please ignore this email</li>
                </ul>
              </div>
              <p>Once verified, you'll receive a detailed ROI analysis showing your potential savings and return on investment.</p>
            </div>
            <div class="footer">
              <p><strong>Kuhlekt</strong> - Invoice-to-Cash Platform</p>
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `

    try {
      await sendClickSendEmail(email, "Your Kuhlekt ROI Calculator Verification Code", emailHtml)
      console.log("[Verification Code] Email sent successfully to:", email)
    } catch (emailError) {
      console.error("[Verification Code] Email sending error:", emailError)
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Verification Code] Error in generate verification code:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
