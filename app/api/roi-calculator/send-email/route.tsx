import { type NextRequest, NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, calculatorType, results, inputs } = body

    if (!name || !email || !company || !calculatorType || !results) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    let emailContent = ""

    if (calculatorType === "simple") {
      emailContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .result-box { background: white; border-left: 4px solid #06b6d4; padding: 20px; margin: 20px 0; border-radius: 4px; }
              .highlight { background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
              .highlight-value { font-size: 36px; font-weight: bold; margin: 10px 0; }
              .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .metric-label { font-weight: 600; color: #4b5563; }
              .metric-value { font-weight: bold; color: #06b6d4; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Your ROI Analysis Results</h1>
              </div>
              <div class="content">
                <p>Dear ${name},</p>
                <p>Thank you for using the Kuhlekt ROI Calculator. Here are your personalized results:</p>
                
                <div class="highlight">
                  <div style="font-size: 14px; opacity: 0.9;">Estimated Annual Savings</div>
                  <div class="highlight-value">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>

                <div class="result-box">
                  <h3 style="margin-top: 0; color: #06b6d4;">Key Metrics</h3>
                  <div class="metric">
                    <span class="metric-label">Current Cash Tied Up</span>
                    <span class="metric-value">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Cash Released</span>
                    <span class="metric-value">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Current DSO</span>
                    <span class="metric-value">${inputs.currentDSO} days</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">New DSO</span>
                    <span class="metric-value">${results.newDSO?.toFixed(0)} days</span>
                  </div>
                  <div class="metric" style="border-bottom: none;">
                    <span class="metric-label">DSO Improvement</span>
                    <span class="metric-value">${results.dsoImprovement?.toFixed(0)}%</span>
                  </div>
                </div>

                <p style="margin-top: 30px;">Ready to achieve these results? Our team is here to help you transform your accounts receivable process.</p>
                <p style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact" style="background: #06b6d4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Schedule a Demo</a>
                </p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
                <p>This email was sent to ${email}</p>
              </div>
            </div>
          </body>
        </html>
      `
    } else {
      emailContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .result-box { background: white; border-left: 4px solid #06b6d4; padding: 20px; margin: 20px 0; border-radius: 4px; }
              .highlight { background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
              .highlight-value { font-size: 36px; font-weight: bold; margin: 10px 0; }
              .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .metric-label { font-weight: 600; color: #4b5563; }
              .metric-value { font-weight: bold; color: #06b6d4; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Your Detailed ROI Analysis</h1>
              </div>
              <div class="content">
                <p>Dear ${name},</p>
                <p>Thank you for using the Kuhlekt Detailed ROI Calculator. Here is your comprehensive analysis:</p>
                
                <div class="highlight">
                  <div style="font-size: 14px; opacity: 0.9;">Total Annual Benefit</div>
                  <div class="highlight-value">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div style="font-size: 14px; opacity: 0.9; margin-top: 10px;">
                    ROI: ${results.roi?.toFixed(0)}% | Payback: ${results.paybackMonths?.toFixed(1)} months
                  </div>
                </div>

                <div class="result-box">
                  <h3 style="margin-top: 0; color: #06b6d4;">Financial Impact</h3>
                  <div class="metric">
                    <span class="metric-label">DSO Improvement</span>
                    <span class="metric-value">${results.dsoReductionDays?.toFixed(0)} days</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Working Capital Released</span>
                    <span class="metric-value">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Interest Savings</span>
                    <span class="metric-value">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Labour Cost Savings</span>
                    <span class="metric-value">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Bad Debt Reduction</span>
                    <span class="metric-value">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div class="metric" style="border-bottom: none;">
                    <span class="metric-label">ROI</span>
                    <span class="metric-value">${results.roi?.toFixed(0)}%</span>
                  </div>
                </div>

                <div class="result-box">
                  <h3 style="margin-top: 0; color: #06b6d4;">Investment</h3>
                  <div class="metric">
                    <span class="metric-label">Implementation Cost</span>
                    <span class="metric-value">$${results.implementationCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Annual Cost</span>
                    <span class="metric-value">$${results.annualCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div class="metric" style="border-bottom: none;">
                    <span class="metric-label">Payback Period</span>
                    <span class="metric-value">${results.paybackMonths?.toFixed(1)} months</span>
                  </div>
                </div>

                <p style="margin-top: 30px;">Ready to achieve these results? Our team is here to help you transform your accounts receivable process.</p>
                <p style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact" style="background: #06b6d4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Schedule a Demo</a>
                </p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
                <p>This email was sent to ${email}</p>
              </div>
            </div>
          </body>
        </html>
      `
    }

    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: `Your Kuhlekt ROI Analysis Results - ${company}`,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: emailContent,
            Charset: "UTF-8",
          },
        },
      },
    }

    await sesClient.send(new SendEmailCommand(emailParams))

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
