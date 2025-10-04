import { NextResponse } from "next/server"

async function sendClickSendEmail(to: string, subject: string, html: string) {
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
    throw new Error(`ClickSend API error: ${response.status} - ${errorText}`)
  }

  return await response.json()
}

export async function POST(request: Request) {
  try {
    const { email, results, isDetailed } = await request.json()

    if (!email || !results) {
      return NextResponse.json({ error: "Email and results are required" }, { status: 400 })
    }

    const emailHtml = isDetailed
      ? `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .metric { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .metric-label { font-weight: bold; color: #666; }
            .metric-value { font-size: 24px; color: #0066cc; font-weight: bold; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Detailed ROI Analysis</h1>
            </div>
            <div class="content">
              <p>Thank you for using the Kuhlekt ROI Calculator. Here are your detailed results:</p>
              
              <div class="metric">
                <div class="metric-label">DSO Improvement</div>
                <div class="metric-value">${results.estimatedDSOReduction} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Cash Flow Improvement</div>
                <div class="metric-value">$${results.cashFlowImprovement.toLocaleString()}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Staff Cost Savings</div>
                <div class="metric-value">$${results.staffCostSavings.toLocaleString()}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Collection Rate Improvement</div>
                <div class="metric-value">$${results.collectionRateImprovement.toLocaleString()}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Total Annual Benefit</div>
                <div class="metric-value">$${results.totalAnnualBenefit.toLocaleString()}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">3-Year ROI</div>
                <div class="metric-value">${results.threeYearROI.toFixed(1)}%</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Payback Period</div>
                <div class="metric-value">${results.paybackPeriod.toFixed(1)} months</div>
              </div>
              
              <p>Ready to transform your accounts receivable process? Contact us today to learn more about Kuhlekt.</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
      : `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .metric { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .metric-label { font-weight: bold; color: #666; }
            .metric-value { font-size: 24px; color: #0066cc; font-weight: bold; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis</h1>
            </div>
            <div class="content">
              <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
              
              <div class="metric">
                <div class="metric-label">Current DSO</div>
                <div class="metric-value">${results.averageDSO} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Projected New DSO</div>
                <div class="metric-value">${results.newDSO} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Cash Flow Improvement</div>
                <div class="metric-value">$${results.cashFlowImprovement.toLocaleString()}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Annual Savings</div>
                <div class="metric-value">$${results.annualSavings.toLocaleString()}</div>
              </div>
              
              <p>Ready to transform your accounts receivable process? Contact us today to learn more about Kuhlekt.</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, "Your Kuhlekt ROI Calculator Results", emailHtml)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
