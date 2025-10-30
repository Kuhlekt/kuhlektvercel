import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
// import { checkRateLimit } from "@/lib/rate-limiter"

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

async function sendClickSendEmail(to: string, subject: string, body: string) {
  if (!to || !isValidEmail(to)) {
    console.error("[ClickSend] Invalid email address:", to)
    throw new Error(`Invalid email address: ${to}`)
  }

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

  const cleanEmail = to.trim().toLowerCase()

  const payload = {
    to: [{ email: cleanEmail, name: cleanEmail.split("@")[0] }],
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
    const { email, name, company, phone, calculatorType, inputs, results } = await request.json()

    console.log("[generateVerificationCode] Received email:", email)

    if (!email) {
      console.error("[generateVerificationCode] Email is missing")
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()

    if (!isValidEmail(cleanEmail)) {
      console.error("[generateVerificationCode] Invalid email format:", cleanEmail)
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    // const rateLimitResult = await checkRateLimit("verification-code", `${clientIp}-${cleanEmail}`)

    // if (!rateLimitResult.allowed) {
    //   const resetMinutes = rateLimitResult.resetAt
    //     ? Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 60000)
    //     : 15

    //   return NextResponse.json(
    //     { error: `Too many verification requests. Please try again in ${resetMinutes} minutes.` },
    //     { status: 429 },
    //   )
    // }

    console.log("[generateVerificationCode] Starting for email:", cleanEmail)

    const supabase = await createClient()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    console.log("[generateVerificationCode] Generated code:", code)
    console.log("[generateVerificationCode] Expires at:", expiresAt)

    const { data, error } = await supabase
      .from("verification_codes")
      .insert({
        email: cleanEmail,
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

    console.log("[generateVerificationCode] Sending email to:", cleanEmail)
    await sendClickSendEmail(cleanEmail, "Your Kuhlekt ROI Calculator Verification Code", emailBody)
    console.log("[generateVerificationCode] Email sent successfully")

    try {
      // Format ROI results for display
      const roiSummary = results
        ? `
        <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; padding: 15px; margin: 15px 0;">
          <h3 style="color: #0891b2; margin-top: 0;">ROI Results Summary</h3>
          <p style="margin: 5px 0;"><strong>ROI:</strong> ${results.roi?.toFixed(1)}%</p>
          <p style="margin: 5px 0;"><strong>Payback Period:</strong> ${results.paybackMonths?.toFixed(1)} months</p>
          <p style="margin: 5px 0;"><strong>Annual Benefit:</strong> $${results.totalAnnualBenefit?.toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>Working Capital Released:</strong> $${results.workingCapitalReleased?.toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>Current DSO:</strong> ${results.currentDSO?.toFixed(0)} days</p>
          <p style="margin: 5px 0;"><strong>Improved DSO:</strong> ${results.newDSO?.toFixed(0)} days</p>
        </div>
      `
        : ""

      // Format calculator inputs for display
      const inputsSummary = inputs
        ? `
        <div style="background-color: #f9fafb; border-left: 4px solid #6b7280; padding: 15px; margin: 15px 0;">
          <h3 style="color: #374151; margin-top: 0;">Calculator Inputs (${calculatorType || "Unknown"})</h3>
          ${Object.entries(inputs)
            .map(
              ([key, value]) => `
            <p style="margin: 5px 0;"><strong>${key}:</strong> ${value}</p>
          `,
            )
            .join("")}
        </div>
      `
        : ""

      const adminEmailBody = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 700px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #0891b2;">🎯 New ROI Calculator Lead</h2>
              <p style="font-size: 16px; color: #059669; font-weight: bold;">
                A potential customer has requested their ROI results!
              </p>
              
              <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
                <h3 style="color: #059669; margin-top: 0;">Contact Information</h3>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${name || "Not provided"}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${cleanEmail}</p>
                <p style="margin: 5px 0;"><strong>Company:</strong> ${company || "Not provided"}</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone || "Not provided"}</p>
              </div>

              ${roiSummary}
              ${inputsSummary}

              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0;">
                <h3 style="color: #d97706; margin-top: 0;">Verification Details</h3>
                <p style="margin: 5px 0;"><strong>Code:</strong> ${code}</p>
                <p style="margin: 5px 0;"><strong>Requested:</strong> ${new Date().toLocaleString()}</p>
                <p style="margin: 5px 0;"><strong>Expires:</strong> ${expiresAt.toLocaleString()}</p>
              </div>

              <div style="background-color: #e0f2fe; border: 2px solid #0891b2; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                <h3 style="color: #0891b2; margin-top: 0;">📞 Follow-Up Action Required</h3>
                <p style="margin: 10px 0;">This is a qualified lead showing strong interest in Kuhlekt's ROI benefits.</p>
                <p style="margin: 10px 0; font-weight: bold;">Recommended: Contact within 24 hours for best conversion rate.</p>
              </div>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="font-size: 12px; color: #6b7280;">
                This is an automated sales notification from the Kuhlekt ROI Calculator.
              </p>
            </div>
          </body>
        </html>
      `

      console.log("[generateVerificationCode] Sending admin notification to enquiries@kuhlekt.com")
      await sendClickSendEmail(
        "enquiries@kuhlekt.com",
        `🎯 New ROI Lead: ${name || cleanEmail} - ${company || "Company Not Provided"}`,
        adminEmailBody,
      )
      console.log("[generateVerificationCode] Admin notification sent successfully")
    } catch (adminEmailError) {
      // Don't fail the request if admin notification fails
      console.error("[generateVerificationCode] Failed to send admin notification:", adminEmailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[generateVerificationCode] Error:", error)
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 })
  }
}
