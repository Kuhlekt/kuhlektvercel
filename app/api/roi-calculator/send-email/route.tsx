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

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .result-box { background: white; border-left: 4px solid #06b6d4; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .metric:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #4b5563; }
          .value { font-weight: 700; color: #06b6d4; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your ROI Analysis Results</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for using our ROI Calculator. Below are your personalized results:</p>
            
            ${
              calculatorType === "simple"
                ? `
              <div class="result-box">
                <h2 style="color: #06b6d4; margin-top: 0;">Simple ROI Analysis</h2>
                <div class="metric">
                  <span class="label">Annual Savings:</span>
                  <span class="value">$${results.annualSavings?.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="label">Cash Released:</span>
                  <span class="value">$${results.cashReleased?.toLocaleString()}</span>
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
            `
                : `
              <div class="result-box">
                <h2 style="color: #06b6d4; margin-top: 0;">Detailed ROI Analysis</h2>
                <div class="metric">
                  <span class="label">Total Annual Benefit:</span>
                  <span class="value">$${results.totalAnnualBenefit?.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="label">ROI:</span>
                  <span class="value">${results.roi?.toFixed(0)}%</span>
                </div>
                <div class="metric">
                  <span class="label">Payback Period:</span>
                  <span class="value">${results.paybackMonths?.toFixed(1)} months</span>
                </div>
                <div class="metric">
                  <span class="label">Working Capital Released:</span>
                  <span class="value">$${results.workingCapitalReleased?.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="label">Labour Savings:</span>
                  <span class="value">$${results.labourCostSavings?.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="label">Bad Debt Reduction:</span>
                  <span class="value">$${results.badDebtReduction?.toLocaleString()}</span>
                </div>
              </div>
            `
            }
            
            <p>These results are based on your specific business metrics and demonstrate the potential impact of implementing our solution.</p>
            <p>Want to learn more? Our team would be happy to discuss how we can help you achieve these results.</p>
            <p style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="background: #06b6d4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Schedule a Demo</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Your ROI Analysis Results",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlContent,
            Charset: "UTF-8",
          },
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
