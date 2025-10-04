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
    const { name, email, company, calculatorType, results, inputs } = await request.json()

    let htmlContent = ""

    if (calculatorType === "simple") {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: white; border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
            .metric:last-child { border-bottom: none; }
            .label { font-weight: 600; color: #666; }
            .value { font-weight: bold; color: #0891b2; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
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
                <h2 style="margin-top: 0; color: #0891b2;">Estimated Annual Savings</h2>
                <p style="font-size: 36px; font-weight: bold; color: #0891b2; margin: 10px 0;">
                  $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div class="highlight">
                <h3>Key Metrics</h3>
                <div class="metric">
                  <span class="label">Current Cash Tied Up:</span>
                  <span class="value">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Cash Released:</span>
                  <span class="value">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Current DSO:</span>
                  <span class="value">${inputs.currentDSO} days</span>
                </div>
                <div class="metric">
                  <span class="label">New DSO:</span>
                  <span class="value">${results.newDSO?.toFixed(0)} days</span>
                </div>
              </div>

              <p>Ready to unlock these savings? Contact us to schedule a demo and see how Kuhlekt can transform your accounts receivable process.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    } else {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: white; border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
            .metric:last-child { border-bottom: none; }
            .label { font-weight: 600; color: #666; }
            .value { font-weight: bold; color: #0891b2; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Comprehensive ROI Analysis</h1>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for using the Kuhlekt Detailed ROI Calculator. Here is your comprehensive analysis:</p>
              
              <div class="highlight">
                <h2 style="margin-top: 0; color: #0891b2;">Total Annual Benefit</h2>
                <p style="font-size: 36px; font-weight: bold; color: #0891b2; margin: 10px 0;">
                  $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px;">
                  <span style="color: #666;">ROI: <strong style="color: #0891b2;">${results.roi?.toFixed(0)}%</strong></span>
                  <span style="color: #666;">Payback: <strong style="color: #0891b2;">${results.paybackMonths?.toFixed(1)} months</strong></span>
                </div>
              </div>

              <div class="highlight">
                <h3>Key Benefits Breakdown</h3>
                <div class="metric">
                  <span class="label">DSO Improvement:</span>
                  <span class="value">${results.dsoReductionDays?.toFixed(0)} days</span>
                </div>
                <div class="metric">
                  <span class="label">Working Capital Released:</span>
                  <span class="value">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Interest Savings:</span>
                  <span class="value">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Labour Savings:</span>
                  <span class="value">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Bad Debt Reduction:</span>
                  <span class="value">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <p>These results demonstrate the significant impact Kuhlekt can have on your business. Contact us today to schedule a personalized demo.</p>
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
          Data: `Your Kuhlekt ROI Analysis Results - ${company}`,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlContent,
            Charset: "UTF-8",
          },
        },
      },
    }

    const command = new SendEmailCommand(emailParams)
    await sesClient.send(command)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
