import { NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    const { name, email, company, calculatorType, results, inputs } = await request.json()

    let emailHtml = ""

    if (calculatorType === "simple") {
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8fafc; padding: 30px; }
              .metric { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #0891b2; }
              .metric-label { color: #64748b; font-size: 14px; margin-bottom: 5px; }
              .metric-value { font-size: 24px; font-weight: bold; color: #0891b2; }
              .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Your ROI Analysis Results</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
                
                <div class="metric">
                  <div class="metric-label">Estimated Annual Savings</div>
                  <div class="metric-value">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Cash Released</div>
                  <div class="metric-value">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">DSO Improvement</div>
                  <div class="metric-value">${inputs.currentDSO} → ${results.newDSO?.toFixed(0)} days</div>
                </div>
                
                <p style="margin-top: 30px;">Ready to see these results in your business? <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="color: #0891b2;">Schedule a demo</a> with our team.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    } else {
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8fafc; padding: 30px; }
              .metric { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #0891b2; }
              .metric-label { color: #64748b; font-size: 14px; margin-bottom: 5px; }
              .metric-value { font-size: 24px; font-weight: bold; color: #0891b2; }
              .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Your Comprehensive ROI Analysis</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Thank you for using the Kuhlekt Detailed ROI Calculator. Here are your comprehensive results:</p>
                
                <div class="metric">
                  <div class="metric-label">Total Annual Benefit</div>
                  <div class="metric-value">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Return on Investment</div>
                  <div class="metric-value">${results.roi?.toFixed(0)}%</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Payback Period</div>
                  <div class="metric-value">${results.paybackMonths?.toFixed(1)} months</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Working Capital Released</div>
                  <div class="metric-value">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Labour Cost Savings</div>
                  <div class="metric-value">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Interest Savings</div>
                  <div class="metric-value">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                
                <p style="margin-top: 30px;">Ready to see these results in your business? <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="color: #0891b2;">Schedule a demo</a> with our team.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    }

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: `Your ${calculatorType === "simple" ? "ROI" : "Comprehensive ROI"} Analysis Results` },
        Body: {
          Html: { Data: emailHtml },
        },
      },
    })

    await sesClient.send(command)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
