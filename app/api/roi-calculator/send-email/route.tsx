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

    if (!email || !name || !company || !calculatorType || !results) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    let htmlContent = ""

    if (calculatorType === "simple") {
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Your ROI Analysis Results</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">Dear ${name},</p>
                        <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Thank you for using the Kuhlekt ROI Calculator. Here are your personalized results:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                          <h2 style="margin: 0 0 10px 0; color: #0891b2; font-size: 18px;">Estimated Annual Savings</h2>
                          <div style="font-size: 48px; font-weight: bold; color: #0891b2;">
                            $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </div>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
                              <strong style="color: #374151;">Current Cash Tied Up:</strong>
                            </td>
                            <td style="padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb; text-align: right;">
                              $${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #ffffff; border: 1px solid #e5e7eb;">
                              <strong style="color: #374151;">Cash Released:</strong>
                            </td>
                            <td style="padding: 15px; background-color: #ffffff; border: 1px solid #e5e7eb; text-align: right; color: #10b981;">
                              $${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
                              <strong style="color: #374151;">Current DSO:</strong>
                            </td>
                            <td style="padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb; text-align: right;">
                              ${inputs.currentDSO} days
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #ffffff; border: 1px solid #e5e7eb;">
                              <strong style="color: #374151;">New DSO:</strong>
                            </td>
                            <td style="padding: 15px; background-color: #ffffff; border: 1px solid #e5e7eb; text-align: right; color: #0891b2;">
                              ${results.newDSO?.toFixed(0)} days
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 30px 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Ready to learn more about how Kuhlekt can help optimize your accounts receivable process?
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
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
    } else {
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Your Detailed ROI Analysis</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">Dear ${name},</p>
                        <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Thank you for using the Kuhlekt Detailed ROI Calculator. Here is your comprehensive analysis:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                          <h2 style="margin: 0 0 10px 0; color: #0891b2; font-size: 18px;">Total Annual Benefit</h2>
                          <div style="font-size: 48px; font-weight: bold; color: #0891b2;">
                            $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </div>
                          <div style="margin-top: 15px; color: #6b7280; font-size: 16px;">
                            ROI: ${results.roi?.toFixed(0)}% | Payback: ${results.paybackMonths?.toFixed(1)} months
                          </div>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
                              <strong style="color: #374151;">DSO Improvement:</strong>
                            </td>
                            <td style="padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb; text-align: right;">
                              ${results.dsoReductionDays?.toFixed(0)} days
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #ffffff; border: 1px solid #e5e7eb;">
                              <strong style="color: #374151;">Working Capital Released:</strong>
                            </td>
                            <td style="padding: 15px; background-color: #ffffff; border: 1px solid #e5e7eb; text-align: right; color: #10b981;">
                              $${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
                              <strong style="color: #374151;">Interest Savings:</strong>
                            </td>
                            <td style="padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb; text-align: right; color: #10b981;">
                              $${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #ffffff; border: 1px solid #e5e7eb;">
                              <strong style="color: #374151;">Labour Savings:</strong>
                            </td>
                            <td style="padding: 15px; background-color: #ffffff; border: 1px solid #e5e7eb; text-align: right; color: #10b981;">
                              $${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
                              <strong style="color: #374151;">Bad Debt Reduction:</strong>
                            </td>
                            <td style="padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb; text-align: right; color: #10b981;">
                              $${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 30px 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          These results demonstrate the potential value Kuhlekt can bring to ${company}. Let's discuss how we can help you achieve these improvements.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
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
