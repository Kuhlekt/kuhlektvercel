import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/aws-ses"

export async function POST(request: Request) {
  try {
    const emailData = await request.json()
    const { name, email, company, calculatorType, results, inputs } = emailData

    // Create email content
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .result-box { background: #f4f4f4; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .highlight { font-size: 24px; font-weight: bold; color: #0066cc; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis Results</h1>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for using our ROI Calculator. Here are your results:</p>
              <div class="result-box">
                ${
                  calculatorType === "simple"
                    ? `
                  <p><strong>DSO Improvement:</strong> ${results.currentDSO.toFixed(1)} days → ${results.newDSO.toFixed(1)} days</p>
                  <p><strong>Cash Released:</strong> $${results.cashReleased.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p class="highlight">Annual Savings: $${results.annualSavings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                `
                    : `
                  <p><strong>ROI:</strong> ${results.roi.toFixed(1)}%</p>
                  <p><strong>Payback Period:</strong> ${results.paybackMonths.toFixed(1)} months</p>
                  <p class="highlight">Total Annual Benefit: $${results.totalAnnualBenefit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                `
                }
              </div>
              <p>We'd love to discuss how Kuhlekt can help you achieve these results.</p>
              <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Schedule a Demo</a></p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail({
      to: email,
      subject: "Your ROI Analysis Results - Kuhlekt",
      htmlBody,
      textBody: `Your ROI analysis results are ready. Visit ${process.env.NEXT_PUBLIC_SITE_URL} to learn more.`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
