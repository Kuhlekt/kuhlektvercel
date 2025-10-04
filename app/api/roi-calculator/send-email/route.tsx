import { NextResponse } from "next/server"

async function sendClickSendEmail(to: string, subject: string, html: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "support@kuhlekt.com"

  if (!username || !apiKey) {
    throw new Error("ClickSend credentials not configured")
  }

  const auth = Buffer.from(`${username}:${apiKey}`).toString("base64")

  // First, fetch verified email addresses to get the email_address_id
  console.log("[ClickSend ROI] Fetching email addresses...")
  const addressesResponse = await fetch("https://rest.clicksend.com/v3/email/addresses", {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  })

  if (!addressesResponse.ok) {
    const errorText = await addressesResponse.text()
    console.error("[ClickSend ROI] Failed to fetch email addresses:", errorText)
    throw new Error(`Failed to fetch email addresses: ${addressesResponse.status}`)
  }

  const addressesData = await addressesResponse.json()

  // Find the email address that matches our from email
  const emailAddress = addressesData.data?.data?.find(
    (addr: any) => addr.email_address === fromEmail && addr.verified === 1,
  )

  if (!emailAddress) {
    console.error("[ClickSend ROI] No verified email found matching:", fromEmail)
    throw new Error(`Email address ${fromEmail} not found or not verified in ClickSend`)
  }

  const emailAddressId = emailAddress.email_address_id
  console.log("[ClickSend ROI] Using email_address_id:", emailAddressId)

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

  console.log("[ClickSend ROI] Sending email...")

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
    console.error("[ClickSend ROI] Error response:", errorText)
    throw new Error(`ClickSend API error: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  console.log("[ClickSend ROI] Email sent successfully")
  return result
}

export async function POST(request: Request) {
  try {
    const { name, email, company, phone, calculatorType, inputs, results } = await request.json()

    if (!email || !name || !calculatorType || !results) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[ROI Email] Sending ROI report to:", email)

    let emailHtml = ""

    if (calculatorType === "simple") {
      emailHtml = `
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
              .highlight-box { 
                background: linear-gradient(to bottom, #ecfeff, #cffafe); 
                border-left: 4px solid #0891b2; 
                padding: 20px; 
                margin: 20px 0; 
                border-radius: 5px;
              }
              .metric {
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                padding: 15px;
                margin: 10px 0;
                border-radius: 5px;
              }
              .metric-label {
                font-size: 12px;
                color: #6b7280;
                margin-bottom: 5px;
              }
              .metric-value {
                font-size: 24px;
                font-weight: bold;
                color: #0891b2;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th, td {
                padding: 12px;
                text-align: left;
                border: 1px solid #e5e7eb;
              }
              th {
                background: #f9fafb;
                font-weight: 600;
              }
              .footer { 
                margin-top: 30px; 
                padding-top: 20px; 
                border-top: 1px solid #ddd; 
                font-size: 12px; 
                color: #666; 
                text-align: center;
              }
              .cta-button {
                display: inline-block;
                background: #0891b2;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: 600;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">Kuhlekt</div>
              </div>
              <div class="content">
                <h2 style="color: #0891b2;">Your ROI Analysis Results</h2>
                <p>Dear ${name},</p>
                <p>Thank you for using the Kuhlekt ROI Calculator. Here are your personalized results:</p>
                
                <div class="highlight-box">
                  <h3 style="margin-top: 0; color: #0891b2;">Estimated Annual Savings</h3>
                  <p style="font-size: 36px; font-weight: bold; margin: 10px 0; color: #0891b2;">
                    $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p style="margin: 0;">Based on ${results.dsoImprovement?.toFixed(0)}% DSO improvement</p>
                </div>

                <h3>Key Metrics:</h3>
                <table>
                  <tr style="background-color: #f9fafb;">
                    <td><strong>Current DSO</strong></td>
                    <td style="text-align: right;">${results.currentDSO?.toFixed(0)} days</td>
                  </tr>
                  <tr>
                    <td><strong>Projected DSO</strong></td>
                    <td style="text-align: right; color: #0891b2; font-weight: bold;">${results.newDSO?.toFixed(0)} days</td>
                  </tr>
                  <tr style="background-color: #f9fafb;">
                    <td><strong>Current Cash Tied Up</strong></td>
                    <td style="text-align: right;">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr>
                    <td><strong>Cash Released</strong></td>
                    <td style="text-align: right; color: #10b981; font-weight: bold;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                </table>

                ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://kuhlekt.com"}/demo" class="cta-button">
                    Schedule a Demo
                  </a>
                </div>

                <p>Ready to see these results in your business? Our team is here to show you how Kuhlekt can transform your invoice-to-cash process.</p>
              </div>
              <div class="footer">
                <p><strong>Kuhlekt</strong> - Invoice-to-Cash Platform</p>
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    } else {
      // Detailed calculator email
      emailHtml = `
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
              .highlight-box { 
                background: linear-gradient(to bottom, #ecfeff, #cffafe); 
                border-left: 4px solid #0891b2; 
                padding: 20px; 
                margin: 20px 0; 
                border-radius: 5px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th, td {
                padding: 12px;
                text-align: left;
                border: 1px solid #e5e7eb;
              }
              th {
                background: #f9fafb;
                font-weight: 600;
              }
              .footer { 
                margin-top: 30px; 
                padding-top: 20px; 
                border-top: 1px solid #ddd; 
                font-size: 12px; 
                color: #666; 
                text-align: center;
              }
              .cta-button {
                display: inline-block;
                background: #0891b2;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: 600;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">Kuhlekt</div>
              </div>
              <div class="content">
                <h2 style="color: #0891b2;">Your Comprehensive ROI Analysis</h2>
                <p>Dear ${name},</p>
                <p>Thank you for using the Kuhlekt ROI Calculator. Here are your detailed results:</p>
                
                <div class="highlight-box">
                  <h3 style="margin-top: 0; color: #0891b2;">Total Annual Benefit</h3>
                  <p style="font-size: 36px; font-weight: bold; margin: 10px 0; color: #0891b2;">
                    $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p style="margin: 0;">
                    <strong>ROI:</strong> ${results.roi?.toFixed(0)}% | 
                    <strong>Payback:</strong> ${results.paybackMonths?.toFixed(1)} months
                  </p>
                </div>

                <h3>Key Benefits:</h3>
                <table>
                  <tr style="background-color: #f9fafb;">
                    <td><strong>DSO Improvement</strong></td>
                    <td style="text-align: right;">${results.dsoReductionDays?.toFixed(0)} days</td>
                  </tr>
                  <tr>
                    <td><strong>Working Capital Released</strong></td>
                    <td style="text-align: right; color: #10b981; font-weight: bold;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr style="background-color: #f9fafb;">
                    <td><strong>Interest Savings</strong></td>
                    <td style="text-align: right; color: #10b981; font-weight: bold;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr>
                    <td><strong>Labour Cost Savings</strong></td>
                    <td style="text-align: right; color: #10b981; font-weight: bold;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr style="background-color: #f9fafb;">
                    <td><strong>Bad Debt Reduction</strong></td>
                    <td style="text-align: right; color: #10b981; font-weight: bold;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                </table>

                <h3>Investment:</h3>
                <table>
                  <tr style="background-color: #f9fafb;">
                    <td><strong>Implementation Cost</strong></td>
                    <td style="text-align: right;">$${results.implementationCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr>
                    <td><strong>Annual Subscription</strong></td>
                    <td style="text-align: right;">$${results.annualCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr style="background-color: #f9fafb;">
                    <td><strong>Total First Year</strong></td>
                    <td style="text-align: right; font-weight: bold;">$${results.totalImplementationAndAnnualCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                </table>

                ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://kuhlekt.com"}/demo" class="cta-button">
                    Schedule a Demo
                  </a>
                </div>

                <p>Ready to see these results in your business? Our team is here to show you how Kuhlekt can transform your invoice-to-cash process and deliver these impressive returns.</p>
              </div>
              <div class="footer">
                <p><strong>Kuhlekt</strong> - Invoice-to-Cash Platform</p>
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    }

    await sendClickSendEmail(email, "Your Kuhlekt ROI Analysis Results", emailHtml)
    console.log("[ROI Email] Email sent successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[ROI Email] Error sending ROI email:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 },
    )
  }
}
