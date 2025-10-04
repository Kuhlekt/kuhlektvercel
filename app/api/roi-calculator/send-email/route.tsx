import { NextResponse } from "next/server"

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
    throw new Error(`ClickSend API error: ${errorText}`)
  }

  return await response.json()
}

export async function POST(request: Request) {
  try {
    const { email, results, isDetailed } = await request.json()

    if (!email || !results) {
      return NextResponse.json({ error: "Email and results are required" }, { status: 400 })
    }

    const emailBody = isDetailed
      ? `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Your Detailed ROI Analysis</h1>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #007bff;">Financial Impact</h2>
            <p><strong>Cash Flow Improvement:</strong> $${results.cashFlowImprovement.toLocaleString()}</p>
            <p><strong>Annual Savings:</strong> $${results.annualSavings.toLocaleString()}</p>
            <p><strong>Staff Cost Savings:</strong> $${results.staffCostSavings.toLocaleString()}</p>
            <p><strong>Collection Rate Improvement:</strong> $${results.collectionRateImprovement.toLocaleString()}</p>
            <p><strong>Total Annual Benefit:</strong> $${results.totalAnnualBenefit.toLocaleString()}</p>
          </div>
          <div style="background-color: #e9ecef; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #28a745;">Investment Analysis</h2>
            <p><strong>Implementation Cost:</strong> $${results.implementationCost.toLocaleString()}</p>
            <p><strong>Net First Year Benefit:</strong> $${results.netFirstYearBenefit.toLocaleString()}</p>
            <p><strong>Payback Period:</strong> ${results.paybackPeriod.toFixed(1)} months</p>
            <p><strong>3-Year ROI:</strong> ${results.threeYearROI.toFixed(0)}%</p>
          </div>
        </body>
      </html>
    `
      : `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Your ROI Calculation Results</h1>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Current Annual Revenue:</strong> $${results.currentAnnualRevenue.toLocaleString()}</p>
            <p><strong>Current DSO:</strong> ${results.averageDSO} days</p>
            <p><strong>New DSO:</strong> ${results.newDSO} days</p>
            <p><strong>DSO Reduction:</strong> ${results.estimatedDSOReduction} days</p>
            <p><strong>Cash Flow Improvement:</strong> $${results.cashFlowImprovement.toLocaleString()}</p>
            <p><strong>Annual Savings:</strong> $${results.annualSavings.toLocaleString()}</p>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, "Your Kuhlekt ROI Analysis Results", emailBody)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 },
    )
  }
}
