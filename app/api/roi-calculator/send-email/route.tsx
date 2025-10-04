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
    const { name, email, company, calculatorType, results } = await request.json()

    if (!name || !email || !company || !calculatorType || !results) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    let htmlContent = ""

    if (calculatorType === "simple") {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">Your ROI Analysis Results</h1>
            </div>
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb;">
              <p style="font-size: 16px; color: #374151;">Hi ${name},</p>
              <p style="font-size: 14px; color: #6b7280;">Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
              
              <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="font-size: 14px; color: #0f766e; margin: 0 0 10px 0;">Estimated Annual Savings</p>
                <p style="font-size: 32px; font-weight: bold; color: #0891b2; margin: 0;">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>

              <div style="margin: 30px 0;">
                <h3 style="color: #374151; margin-bottom: 15px;">Key Metrics</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Current DSO</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #374151;">${results.currentDSO} days</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">New DSO</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #0891b2;">${results.newDSO?.toFixed(0)} days</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Cash Released</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #059669;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    } else {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">Your Detailed ROI Analysis</h1>
            </div>
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb;">
              <p style="font-size: 16px; color: #374151;">Hi ${name},</p>
              <p style="font-size: 14px; color: #6b7280;">Thank you for using the Kuhlekt ROI Calculator. Here are your detailed results:</p>
              
              <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="font-size: 14px; color: #0f766e; margin: 0 0 10px 0;">Total Annual Benefit</p>
                <p style="font-size: 32px; font-weight: bold; color: #0891b2; margin: 0;">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p style="font-size: 14px; color: #6b7280; margin: 10px 0 0 0;">ROI: ${results.roi?.toFixed(0)}% | Payback: ${results.paybackMonths?.toFixed(1)} months</p>
              </div>

              <div style="margin: 30px 0;">
                <h3 style="color: #374151; margin-bottom: 15px;">Savings Breakdown</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Labour Cost Savings</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #059669;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Interest Savings</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #059669;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Bad Debt Reduction</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #059669;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Working Capital Released</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #059669;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                </table>
              </div>
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

    await sesClient.send(new SendEmailCommand(emailParams))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in send ROI email route:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
