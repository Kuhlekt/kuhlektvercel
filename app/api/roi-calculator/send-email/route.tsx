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

    if (!email || !name || !company || !calculatorType || !results) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

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
              .header { background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; }
              .highlight { background: white; border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0; border-radius: 4px; }
              .metric { margin: 15px 0; padding: 15px; background: white; border-radius: 4px; }
              .metric-label { color: #6b7280; font-size: 14px; margin-bottom: 5px; }
              .metric-value { color: #0891b2; font-size: 24px; font-weight: bold; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; border-radius: 0 0 8px 8px; background: #f9fafb; padding: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Your ROI Calculator Results</h1>
              </div>
              <div class="content">
                <p>Dear ${name},</p>
                <p>Thank you for using the Kuhlekt ROI Calculator. Here are your personalized results for ${company}:</p>
                
                <div class="highlight">
                  <div class="metric-label">Estimated Annual Savings</div>
                  <div class="metric-value">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>

                <div class="metric">
                  <div class="metric-label">Current Cash Tied Up</div>
                  <div class="metric-value">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>

                <div class="metric">
                  <div class="metric-label">Cash Released</div>
                  <div class="metric-value">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>

                <div class="metric">
                  <div class="metric-label">DSO Improvement</div>
                  <div class="metric-value">${inputs.currentDSO} → ${results.newDSO?.toFixed(0)} days</div>
                </div>

                <p style="margin-top: 30px;">Ready to transform your accounts receivable process? Contact us to learn how Kuhlekt can help you achieve these results.</p>
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
              .header { background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; }
              .highlight { background: white; border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0; border-radius: 4px; }
              .metric { margin: 15px 0; padding: 15px; background: white; border-radius: 4px; }
              .metric-label { color: #6b7280; font-size: 14px; margin-bottom: 5px; }
              .metric-value { color: #0891b2; font-size: 24px; font-weight: bold; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; border-radius: 0 0 8px 8px; background: #f9fafb; padding: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Your Detailed ROI Analysis</h1>
              </div>
              <div class="content">
                <p>Dear ${name},</p>
                <p>Thank you for using the Kuhlekt ROI Calculator. Here is your comprehensive analysis for ${company}:</p>
                
                <div class="highlight">
                  <div class="metric-label">Total Annual Benefit</div>
                  <div class="metric-value">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div style="margin-top: 10px; color: #6b7280;">
                    ROI: ${results.roi?.toFixed(0)}% | Payback: ${results.paybackMonths?.toFixed(1)} months
                  </div>
                </div>

                <h3 style="color: #0891b2; margin-top: 30px;">Key Savings Breakdown</h3>

                <div class="metric">
                  <div class="metric-label">DSO Improvement</div>
                  <div class="metric-value">${results.dsoReductionDays?.toFixed(0)} days</div>
                </div>

                <div class="metric">
                  <div class="metric-label">Working Capital Released</div>
                  <div class="metric-value">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>

                <div class="metric">
                  <div class="metric-label">Interest Savings</div>
                  <div class="metric-value">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>

                <div class="metric">
                  <div class="metric-label">Labour Cost Savings</div>
                  <div class="metric-value">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>

                <div class="metric">
                  <div class="metric-label">Bad Debt Reduction</div>
                  <div class="metric-value">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>

                <p style="margin-top: 30px;">Ready to transform your accounts receivable process? Contact us to learn how Kuhlekt can help you achieve these results.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
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
          Data: `Your Kuhlekt ROI Calculator Results - ${company}`,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: emailHtml,
            Charset: "UTF-8",
          },
        },
      },
    }

    await sesClient.send(new SendEmailCommand(emailParams))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
