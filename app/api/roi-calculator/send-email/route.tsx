import { type NextRequest, NextResponse } from "next/server"

async function sendClickSendEmail(to: string, subject: string, body: string) {
  console.log("=== sendClickSendEmail START ===")
  console.log("To:", to)
  console.log("Subject:", subject)

  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL

  if (!username || !apiKey || !fromEmail) {
    console.error("✗ ClickSend credentials missing")
    console.log("Has username:", !!username)
    console.log("Has apiKey:", !!apiKey)
    console.log("Has fromEmail:", !!fromEmail)
    throw new Error("ClickSend credentials not configured")
  }

  console.log("✓ ClickSend credentials present")

  const auth = Buffer.from(`${username}:${apiKey}`).toString("base64")

  // First, fetch verified email addresses to get the email_address_id
  console.log("Fetching verified email addresses...")
  const addressesResponse = await fetch("https://rest.clicksend.com/v3/email/addresses", {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  })

  console.log("Addresses response status:", addressesResponse.status)

  if (!addressesResponse.ok) {
    const errorText = await addressesResponse.text()
    console.error("✗ Failed to fetch email addresses:", errorText)
    throw new Error(`Failed to fetch email addresses: ${addressesResponse.status}`)
  }

  const addressesData = await addressesResponse.json()
  console.log("✓ Email addresses fetched")
  console.log("Number of addresses:", addressesData.data?.data?.length)

  // Find the email address that matches our from email
  const emailAddress = addressesData.data?.data?.find(
    (addr: any) => addr.email_address === fromEmail && addr.verified === 1,
  )

  if (!emailAddress) {
    console.error("✗ Email address not found or not verified")
    console.log("Looking for:", fromEmail)
    console.log(
      "Available addresses:",
      addressesData.data?.data?.map((a: any) => ({
        email: a.email_address,
        verified: a.verified,
      })),
    )
    throw new Error(`Email address ${fromEmail} not found or not verified in ClickSend`)
  }

  const emailAddressId = emailAddress.email_address_id
  console.log("✓ Using email_address_id:", emailAddressId)

  const payload = {
    to: [{ email: to, name: to.split("@")[0] }],
    from: {
      email_address_id: emailAddressId,
      name: "Kuhlekt",
    },
    subject,
    body,
  }

  console.log("Sending email...")

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  console.log("Send response status:", response.status)

  if (!response.ok) {
    const errorBody = await response.text()
    console.error("✗ ClickSend send error:", errorBody)
    throw new Error(`Failed to send email: ${response.status} - ${errorBody}`)
  }

  const result = await response.json()
  console.log("✓ Email sent successfully")
  console.log("=== sendClickSendEmail END ===")
  return result
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== ROI Calculator Send Email Route START ===")
    console.log("Timestamp:", new Date().toISOString())

    let body
    try {
      body = await request.json()
      console.log("✓ Request body parsed")
    } catch (parseError) {
      console.error("✗ Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    console.log("Body keys:", Object.keys(body))

    const { name, email, company, phone, calculatorType, inputs, results } = body

    // Validate required fields
    if (!name || !email || !calculatorType || !results) {
      console.error("✗ Missing required fields")
      console.log("Has name:", !!name)
      console.log("Has email:", !!email)
      console.log("Has calculatorType:", !!calculatorType)
      console.log("Has results:", !!results)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("✓ All required fields present")
    console.log("Calculator type:", calculatorType)
    console.log("Email:", email)
    console.log("Results:", JSON.stringify(results))

    // Safely format numbers
    const formatCurrency = (num: any) => {
      const n = Number(num)
      if (isNaN(n)) return "$0"
      return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    }
    const formatNumber = (num: any, decimals = 0) => {
      const n = Number(num)
      if (isNaN(n)) return "0"
      return n.toFixed(decimals)
    }

    let emailBody = ""

    if (calculatorType === "simple") {
      console.log("Building simple calculator email...")
      emailBody = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #0891b2;">Your ROI Analysis Results</h2>
              <p>Dear ${name},</p>
              <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
              
              <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #0891b2;">Estimated Annual Savings</h3>
                <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #0891b2;">
                  ${formatCurrency(results.annualSavings)}
                </p>
              </div>

              <h3>Key Metrics:</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Current DSO</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${formatNumber(results.currentDSO)} days</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">New DSO</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #0891b2;">${formatNumber(results.newDSO)} days</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Current Cash Tied Up</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${formatCurrency(results.currentCashTied)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Cash Released</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">${formatCurrency(results.cashReleased)}</td>
                </tr>
              </table>

              ${company ? `<p>Company: ${company}</p>` : ""}
              
              <p style="margin-top: 30px;">
                Ready to see these results in your business? 
                <a href="https://roi.kuhlekt-info.com/demo" style="color: #0891b2; text-decoration: none; font-weight: bold;">Schedule a demo</a>
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="font-size: 12px; color: #6b7280;">
                © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `
    } else {
      console.log("Building detailed calculator email...")
      emailBody = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #0891b2;">Your Comprehensive ROI Analysis</h2>
              <p>Dear ${name},</p>
              <p>Thank you for using the Kuhlekt ROI Calculator. Here are your detailed results:</p>
              
              <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #0891b2;">Total Annual Benefit</h3>
                <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #0891b2;">
                  ${formatCurrency(results.totalAnnualBenefit)}
                </p>
                <p style="margin: 0;">
                  <strong>ROI:</strong> ${formatNumber(results.roi)}% | 
                  <strong>Payback:</strong> ${formatNumber(results.paybackMonths, 1)} months
                </p>
              </div>

              <h3>Key Benefits:</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">DSO Improvement</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${formatNumber(results.dsoReductionDays)} days</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Working Capital Released</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">${formatCurrency(results.workingCapitalReleased)}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Interest Savings</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">${formatCurrency(results.interestSavings)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Labour Cost Savings</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">${formatCurrency(results.labourCostSavings)}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Bad Debt Reduction</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">${formatCurrency(results.badDebtReduction)}</td>
                </tr>
              </table>

              <h3>Investment:</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Implementation Cost</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${formatCurrency(results.implementationCost)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Annual Cost</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${formatCurrency(results.annualCost)}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Total First Year Cost</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${formatCurrency(results.totalFirstYearCost)}</td>
                </tr>
              </table>

              ${company ? `<p>Company: ${company}</p>` : ""}
              
              <p style="margin-top: 30px;">
                Ready to see these results in your business? 
                <a href="https://roi.kuhlekt-info.com/demo" style="color: #0891b2; text-decoration: none; font-weight: bold;">Schedule a demo</a>
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="font-size: 12px; color: #6b7280;">
                © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `
    }

    console.log("✓ Email body built")
    console.log("Email body length:", emailBody.length)

    console.log("Sending email to user...")
    await sendClickSendEmail(email, "Your Kuhlekt ROI Analysis Results", emailBody)
    console.log("✓ User email sent successfully")

    // Send notification to admin
    console.log("Sending notification to admin...")
    try {
      const adminNotifyResponse = await fetch(`${request.nextUrl.origin}/api/roi-calculator/notify-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          phone,
          calculatorType,
          inputs,
          results,
        }),
      })

      if (!adminNotifyResponse.ok) {
        const errorText = await adminNotifyResponse.text()
        console.error("Admin notification failed:", adminNotifyResponse.status, errorText)
      } else {
        console.log("✓ Admin notification sent successfully")
      }
    } catch (adminError) {
      console.error("Error sending admin notification:", adminError)
      // Don't fail the user request if admin notification fails
    }

    console.log("=== ROI Calculator Send Email Route SUCCESS ===")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("=== FATAL: ROI Calculator Send Email Route Error ===")
    console.error("Error type:", typeof error)
    console.error("Error:", error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
