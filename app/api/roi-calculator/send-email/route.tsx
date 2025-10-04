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

    if (!name || !email || !company || !calculatorType || !results) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    let emailBody = ""

    if (calculatorType === "simple") {
      emailBody = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your ROI Analysis Results</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Your ROI Analysis</h1>
                        <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 18px;">Simple Calculator Results</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px;">
                        <p style="color: #1f2937; font-size: 16px; margin: 0 0 20px 0;">Dear ${name},</p>
                        <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                          Thank you for using the Kuhlekt ROI Calculator. Based on your inputs, here are your estimated savings:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                          <p style="color: #0891b2; font-size: 14px; margin: 0 0 10px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Estimated Annual Savings</p>
                          <p style="color: #0891b2; font-size: 48px; margin: 0; font-weight: bold;">
                            $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                        </div>

                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td style="padding: 20px; background-color: #f9fafb; border-radius: 8px; width: 48%;">
                              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Current Cash Tied Up</p>
                              <p style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0;">
                                $${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                            <td style="width: 4%;"></td>
                            <td style="padding: 20px; background-color: #f0fdf4; border-radius: 8px; width: 48%;">
                              <p style="color: #059669; font-size: 14px; margin: 0 0 8px 0;">Cash Released</p>
                              <p style="color: #059669; font-size: 24px; font-weight: bold; margin: 0;">
                                $${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td style="padding: 20px; background-color: #f9fafb; border-radius: 8px; width: 48%;">
                              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Current DSO</p>
                              <p style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0;">
                                ${inputs.currentDSO} days
                              </p>
                            </td>
                            <td style="width: 4%;"></td>
                            <td style="padding: 20px; background-color: #f0f9ff; border-radius: 8px; width: 48%;">
                              <p style="color: #0891b2; font-size: 14px; margin: 0 0 8px 0;">New DSO</p>
                              <p style="color: #0891b2; font-size: 24px; font-weight: bold; margin: 0;">
                                ${results.newDSO?.toFixed(0)} days
                              </p>
                            </td>
                          </tr>
                        </table>

                        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                          <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 20px;">
                            <strong>Next Steps:</strong> Schedule a demo to see how Kuhlekt can help you achieve these savings and transform your accounts receivable process.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #1f2937; font-size: 16px; margin: 0 0 20px 0; font-weight: 600;">
                          Ready to transform your AR process?
                        </p>
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; background-color: #0891b2; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                          Schedule a Demo
                        </a>
                        <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
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
      emailBody = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Detailed ROI Analysis</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Your Detailed ROI Analysis</h1>
                        <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 18px;">Comprehensive Invoice-to-Cash Analysis</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px;">
                        <p style="color: #1f2937; font-size: 16px; margin: 0 0 20px 0;">Dear ${name},</p>
                        <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                          Thank you for using the Kuhlekt Detailed ROI Calculator. Here's your comprehensive analysis:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                          <p style="color: #0891b2; font-size: 14px; margin: 0 0 10px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Total Annual Benefit</p>
                          <p style="color: #0891b2; font-size: 48px; margin: 0 0 15px 0; font-weight: bold;">
                            $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                          <div style="display: inline-block;">
                            <span style="color: #0891b2; font-size: 16px; margin: 0 15px;">ROI: ${results.roi?.toFixed(0)}%</span>
                            <span style="color: #6b7280; font-size: 16px;">•</span>
                            <span style="color: #0891b2; font-size: 16px; margin: 0 15px;">Payback: ${results.paybackMonths?.toFixed(1)} months</span>
                          </div>
                        </div>

                        <h3 style="color: #1f2937; font-size: 18px; margin: 30px 0 15px 0;">Key Metrics</h3>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 15px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f9fafb; border-radius: 8px; width: 32%;">
                              <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0;">DSO Improvement</p>
                              <p style="color: #1f2937; font-size: 20px; font-weight: bold; margin: 0;">
                                ${results.dsoReductionDays?.toFixed(0)} days
                              </p>
                            </td>
                            <td style="width: 2%;"></td>
                            <td style="padding: 15px; background-color: #f0fdf4; border-radius: 8px; width: 32%;">
                              <p style="color: #059669; font-size: 12px; margin: 0 0 5px 0;">Working Capital</p>
                              <p style="color: #059669; font-size: 20px; font-weight: bold; margin: 0;">
                                $${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                            <td style="width: 2%;"></td>
                            <td style="padding: 15px; background-color: #f0fdf4; border-radius: 8px; width: 32%;">
                              <p style="color: #059669; font-size: 12px; margin: 0 0 5px 0;">Interest Savings</p>
                              <p style="color: #059669; font-size: 20px; font-weight: bold; margin: 0;">
                                $${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 15px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f0fdf4; border-radius: 8px; width: 48%;">
                              <p style="color: #059669; font-size: 12px; margin: 0 0 5px 0;">Labour Savings</p>
                              <p style="color: #059669; font-size: 20px; font-weight: bold; margin: 0;">
                                $${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                            <td style="width: 4%;"></td>
                            <td style="padding: 15px; background-color: #f0fdf4; border-radius: 8px; width: 48%;">
                              <p style="color: #059669; font-size: 12px; margin: 0 0 5px 0;">Bad Debt Reduction</p>
                              <p style="color: #059669; font-size: 20px; font-weight: bold; margin: 0;">
                                $${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                          <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 20px;">
                            <strong>Next Steps:</strong> Let's discuss how Kuhlekt can help you achieve these impressive results. Schedule a personalized demo to see our platform in action.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #1f2937; font-size: 16px; margin: 0 0 20px 0; font-weight: 600;">
                          Ready to unlock these savings?
                        </p>
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; background-color: #0891b2; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                          Schedule Your Demo
                        </a>
                        <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
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
          Data: `Your Kuhlekt ROI Analysis Results - ${company}`,
        },
        Body: {
          Html: {
            Data: emailBody,
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
