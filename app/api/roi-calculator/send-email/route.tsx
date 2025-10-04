import { type NextRequest, NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const ses = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, calculatorType, results, inputs } = await request.json()

    if (!email || !name || !company || !calculatorType || !results) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    let htmlContent = ""

    if (calculatorType === "simple") {
      htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0891b2;">Your ROI Calculator Results</h2>
            <p>Dear ${name},</p>
            <p>Thank you for using our ROI calculator. Here are your results:</p>
            
            <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0891b2;">Estimated Annual Savings</h3>
              <p style="font-size: 32px; font-weight: bold; color: #0891b2; margin: 10px 0;">
                $${results.annualSavings?.toLocaleString()}
              </p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold;">Current Cash Tied Up:</td>
                <td style="padding: 12px 0; text-align: right;">$${results.currentCashTied?.toLocaleString()}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold;">Cash Released:</td>
                <td style="padding: 12px 0; text-align: right; color: #10b981;">$${results.cashReleased?.toLocaleString()}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold;">Current DSO:</td>
                <td style="padding: 12px 0; text-align: right;">${inputs.currentDSO} days</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold;">New DSO:</td>
                <td style="padding: 12px 0; text-align: right; color: #0891b2;">${results.newDSO?.toFixed(0)} days</td>
              </tr>
            </table>

            <p>These results are based on the information you provided and represent estimated values.</p>
            <p>If you'd like to discuss how Kuhlekt can help you achieve these results, please don't hesitate to contact us.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #666; font-size: 14px;">Best regards,<br>The Kuhlekt Team</p>
            </div>
          </body>
        </html>
      `
    } else {
      htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0891b2;">Your Detailed ROI Analysis</h2>
            <p>Dear ${name},</p>
            <p>Thank you for completing our detailed ROI calculator. Here are your comprehensive results:</p>
            
            <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0891b2;">Total Annual Benefit</h3>
              <p style="font-size: 32px; font-weight: bold; color: #0891b2; margin: 10px 0;">
                $${results.totalAnnualBenefit?.toLocaleString()}
              </p>
              <p style="margin: 0;">ROI: <strong>${results.roi?.toFixed(0)}%</strong> | Payback: <strong>${results.paybackMonths?.toFixed(1)} months</strong></p>
            </div>

            <h3 style="color: #0891b2;">Key Metrics</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold;">DSO Improvement:</td>
                <td style="padding: 12px 0; text-align: right;">${results.dsoReductionDays?.toFixed(0)} days</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold;">Working Capital Released:</td>
                <td style="padding: 12px 0; text-align: right; color: #10b981;">$${results.workingCapitalReleased?.toLocaleString()}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold;">Interest Savings:</td>
                <td style="padding: 12px 0; text-align: right; color: #10b981;">$${results.interestSavings?.toLocaleString()}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold;">Labour Cost Savings:</td>
                <td style="padding: 12px 0; text-align: right; color: #10b981;">$${results.labourCostSavings?.toLocaleString()}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold;">Bad Debt Reduction:</td>
                <td style="padding: 12px 0; text-align: right; color: #10b981;">$${results.badDebtReduction?.toLocaleString()}</td>
              </tr>
            </table>

            <p>These results are based on the detailed information you provided and represent estimated values tailored to your business.</p>
            <p>We'd love to discuss how Kuhlekt can help you achieve these improvements. Please contact us to schedule a consultation.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #666; font-size: 14px;">Best regards,<br>The Kuhlekt Team</p>
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
          Data: `Your ${calculatorType === "simple" ? "ROI" : "Detailed ROI"} Calculator Results`,
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
    await ses.send(command)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
