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

    if (!email || !results) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const isSimple = calculatorType === "simple"

    const htmlContent = isSimple
      ? generateSimpleROIEmail(name, company, results, inputs)
      : generateDetailedROIEmail(name, company, results, inputs)

    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: `Your Kuhlekt ROI Calculator Results`,
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

    await ses.send(new SendEmailCommand(emailParams))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}

function generateSimpleROIEmail(name: string, company: string, results: any, inputs: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Your ROI Results</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="color: #333333; font-size: 16px; margin: 0 0 20px 0;">Hi ${name},</p>
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Thank you for using the Kuhlekt ROI Calculator. Here are your estimated savings:
                    </p>
                    
                    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0;">
                      <h2 style="color: #0891b2; margin: 0 0 10px 0; font-size: 18px;">Estimated Annual Savings</h2>
                      <p style="color: #0891b2; font-size: 36px; font-weight: bold; margin: 0;">
                        $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>

                    <table width="100%" cellpadding="15" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background-color: #f9fafb;">
                          <p style="color: #6b7280; font-size: 14px; margin: 0 0 5px 0;">Current DSO</p>
                          <p style="color: #111827; font-size: 24px; font-weight: bold; margin: 0;">${inputs.currentDSO} days</p>
                        </td>
                        <td style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background-color: #f0fdf4;">
                          <p style="color: #6b7280; font-size: 14px; margin: 0 0 5px 0;">New DSO</p>
                          <p style="color: #059669; font-size: 24px; font-weight: bold; margin: 0;">${results.newDSO?.toFixed(0)} days</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background-color: #f9fafb;">
                          <p style="color: #6b7280; font-size: 14px; margin: 0 0 5px 0;">Cash Tied Up</p>
                          <p style="color: #111827; font-size: 24px; font-weight: bold; margin: 0;">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </td>
                        <td style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background-color: #f0fdf4;">
                          <p style="color: #6b7280; font-size: 14px; margin: 0 0 5px 0;">Cash Released</p>
                          <p style="color: #059669; font-size: 24px; font-weight: bold; margin: 0;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                      Want to learn more about how Kuhlekt can help you achieve these results? Contact us today to schedule a demo.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

function generateDetailedROIEmail(name: string, company: string, results: any, inputs: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Your Comprehensive ROI Analysis</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="color: #333333; font-size: 16px; margin: 0 0 20px 0;">Hi ${name},</p>
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Thank you for using the Kuhlekt Detailed ROI Calculator. Here's your comprehensive analysis:
                    </p>
                    
                    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0;">
                      <h2 style="color: #0891b2; margin: 0 0 10px 0; font-size: 18px;">Total Annual Benefit</h2>
                      <p style="color: #0891b2; font-size: 36px; font-weight: bold; margin: 0;">
                        $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                      <p style="color: #0891b2; font-size: 16px; margin: 10px 0 0 0;">
                        ROI: ${results.roi?.toFixed(0)}% | Payback: ${results.paybackMonths?.toFixed(1)} months
                      </p>
                    </div>

                    <h3 style="color: #111827; font-size: 18px; margin: 30px 0 15px 0;">Key Savings Breakdown</h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                      <tr>
                        <td style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; background-color: #f0fdf4; margin-bottom: 10px;">
                          <p style="color: #6b7280; font-size: 14px; margin: 0 0 5px 0;">Working Capital Released</p>
                          <p style="color: #059669; font-size: 20px; font-weight: bold; margin: 0;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; background-color: #f0fdf4;">
                          <p style="color: #6b7280; font-size: 14px; margin: 0 0 5px 0;">Labour Cost Savings</p>
                          <p style="color: #059669; font-size: 20px; font-weight: bold; margin: 0;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; background-color: #f0fdf4;">
                          <p style="color: #6b7280; font-size: 14px; margin: 0 0 5px 0;">Interest Savings</p>
                          <p style="color: #059669; font-size: 20px; font-weight: bold; margin: 0;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; background-color: #f0fdf4;">
                          <p style="color: #6b7280; font-size: 14px; margin: 0 0 5px 0;">Bad Debt Reduction</p>
                          <p style="color: #059669; font-size: 20px; font-weight: bold; margin: 0;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </td>
                      </tr>
                    </table>

                    <h3 style="color: #111827; font-size: 18px; margin: 30px 0 15px 0;">DSO Improvement</h3>
                    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                      <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                        DSO Reduction: <strong>${results.dsoReductionDays?.toFixed(0)} days</strong>
                      </p>
                      <p style="color: #6b7280; font-size: 14px; margin: 0;">
                        New DSO: <strong style="color: #059669;">${results.newDSODays?.toFixed(0)} days</strong>
                      </p>
                    </div>

                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                      Ready to transform your accounts receivable process? Contact us today to schedule a personalized demo and see how Kuhlekt can deliver these results for ${company}.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}
