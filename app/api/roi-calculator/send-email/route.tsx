import { type NextRequest, NextResponse } from "next/server"

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
    const { name, email, company, calculatorType, results, inputs } = await request.json()

    console.log("[sendROIEmail] Sending ROI report to:", email)
    console.log("[sendROIEmail] Calculator type:", calculatorType)
    console.log("[sendROIEmail] Results:", JSON.stringify(results, null, 2))

    let emailBody = ""

    if (calculatorType === "simple") {
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
                  $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <h3>Key Metrics:</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Current DSO</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${results.currentDSO?.toFixed(0)} days</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">New DSO</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #0891b2;">${results.newDSO?.toFixed(0)} days</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Current Cash Tied Up</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Cash Released</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
              </table>

              ${company ? `<p>Company: ${company}</p>` : ""}
              
              <p style="margin-top: 30px;">
                Ready to see these results in your business? 
                <a href="https://kuhlekt.com/demo" style="color: #0891b2; text-decoration: none; font-weight: bold;">Schedule a demo</a>
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
                  $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p style="margin: 0;">
                  <strong>ROI:</strong> ${results.roi?.toFixed(0)}% | 
                  <strong>Payback:</strong> ${results.paybackMonths?.toFixed(1)} months
                </p>
              </div>

              <h3>Key Benefits:</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">DSO Improvement</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${results.dsoReductionDays?.toFixed(0)} days</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Working Capital Released</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Interest Savings</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Labour Cost Savings</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Bad Debt Reduction</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
              </table>

              <h3>Investment:</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Implementation Cost</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">$${results.implementationCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Annual Cost</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">$${results.annualCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Total First Year Cost</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">$${results.totalFirstYearCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
              </table>

              ${company ? `<p>Company: ${company}</p>` : ""}
              
              <p style="margin-top: 30px;">
                Ready to see these results in your business? 
                <a href="https://kuhlekt.com/demo" style="color: #0891b2; text-decoration: none; font-weight: bold;">Schedule a demo</a>
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

    await sendClickSendEmail(email, "Your Kuhlekt ROI Analysis Results", emailBody)
    console.log("[sendROIEmail] Email sent successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[sendROIEmail] Error sending ROI email:", error)
    return NextResponse.json({ error: "Failed to send ROI email" }, { status: 500 })
  }
}
