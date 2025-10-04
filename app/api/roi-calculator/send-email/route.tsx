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

    let emailBody = ""

    if (calculatorType === "simple") {
      emailBody = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your ROI Results</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Your ROI Analysis Results</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          Hi ${name},
                        </p>
                        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                          Thank you for using the Kuhlekt ROI Calculator. Here are your results:
                        </p>
                        
                        <div style="background-color: #f0f9ff; border-left: 4px solid #06b6d4; padding: 20px; margin: 20px 0;">
                          <h2 style="color: #0891b2; font-size: 24px; margin: 0 0 10px 0;">Estimated Annual Savings</h2>
                          <p style="color: #0891b2; font-size: 36px; font-weight: bold; margin: 0;">
                            $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                        </div>

                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f8f8f8; border-radius: 8px; margin-bottom: 10px;">
                              <p style="color: #666666; font-size: 14px; margin: 0 0 5px 0;">Current DSO</p>
                              <p style="color: #333333; font-size: 20px; font-weight: bold; margin: 0;">${inputs.currentDSO} days</p>
                            </td>
                            <td style="width: 20px;"></td>
                            <td style="padding: 15px; background-color: #f8f8f8; border-radius: 8px;">
                              <p style="color: #666666; font-size: 14px; margin: 0 0 5px 0;">New DSO</p>
                              <p style="color: #0891b2; font-size: 20px; font-weight: bold; margin: 0;">${results.newDSO?.toFixed(0)} days</p>
                            </td>
                          </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f8f8f8; border-radius: 8px;">
                              <p style="color: #666666; font-size: 14px; margin: 0 0 5px 0;">Cash Released</p>
                              <p style="color: #10b981; font-size: 20px; font-weight: bold; margin: 0;">
                                $${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                          Ready to discuss how Kuhlekt can help you achieve these results? Contact us today!
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e5e5;">
                        <p style="color: #999999; font-size: 12px; margin: 0;">
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
            <title>Your Detailed ROI Results</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Your Detailed ROI Analysis</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          Hi ${name},
                        </p>
                        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                          Thank you for using the Kuhlekt Detailed ROI Calculator. Here's your comprehensive analysis:
                        </p>
                        
                        <div style="background-color: #f0f9ff; border-left: 4px solid #06b6d4; padding: 20px; margin: 20px 0;">
                          <h2 style="color: #0891b2; font-size: 24px; margin: 0 0 10px 0;">Total Annual Benefit</h2>
                          <p style="color: #0891b2; font-size: 36px; font-weight: bold; margin: 0 0 10px 0;">
                            $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                          <p style="color: #666666; font-size: 14px; margin: 0;">
                            ROI: ${results.roi?.toFixed(0)}% | Payback: ${results.paybackMonths?.toFixed(1)} months
                          </p>
                        </div>

                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f8f8f8; border-radius: 8px; margin-bottom: 10px;">
                              <p style="color: #666666; font-size: 14px; margin: 0 0 5px 0;">DSO Improvement</p>
                              <p style="color: #333333; font-size: 20px; font-weight: bold; margin: 0;">${results.dsoReductionDays?.toFixed(0)} days</p>
                            </td>
                            <td style="width: 20px;"></td>
                            <td style="padding: 15px; background-color: #f8f8f8; border-radius: 8px;">
                              <p style="color: #666666; font-size: 14px; margin: 0 0 5px 0;">Working Capital Released</p>
                              <p style="color: #10b981; font-size: 20px; font-weight: bold; margin: 0;">
                                $${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f8f8f8; border-radius: 8px; margin-bottom: 10px;">
                              <p style="color: #666666; font-size: 14px; margin: 0 0 5px 0;">Interest Savings</p>
                              <p style="color: #10b981; font-size: 18px; font-weight: bold; margin: 0;">
                                $${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                            <td style="width: 20px;"></td>
                            <td style="padding: 15px; background-color: #f8f8f8; border-radius: 8px;">
                              <p style="color: #666666; font-size: 14px; margin: 0 0 5px 0;">Labour Savings</p>
                              <p style="color: #10b981; font-size: 18px; font-weight: bold; margin: 0;">
                                $${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f8f8f8; border-radius: 8px;">
                              <p style="color: #666666; font-size: 14px; margin: 0 0 5px 0;">Bad Debt Reduction</p>
                              <p style="color: #10b981; font-size: 18px; font-weight: bold; margin: 0;">
                                $${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                          Ready to discuss how Kuhlekt can help you achieve these results? Contact us today!
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e5e5;">
                        <p style="color: #999999; font-size: 12px; margin: 0;">
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

    const params = {
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
            Data: emailBody,
            Charset: "UTF-8",
          },
        },
      },
    }

    await sesClient.send(new SendEmailCommand(params))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Send ROI email error:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
