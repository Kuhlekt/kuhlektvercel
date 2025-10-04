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

    let emailHtml = ""

    if (calculatorType === "simple") {
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your ROI Analysis Results</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Your ROI Analysis Results</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Hi ${name},</p>
                        <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #666666;">
                          Thank you for using our ROI Calculator. Based on your inputs, here are your results:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #0891b2; border-radius: 8px; padding: 20px; margin: 30px 0;">
                          <h2 style="margin: 0 0 10px; font-size: 18px; color: #0891b2;">Estimated Annual Savings</h2>
                          <p style="margin: 0; font-size: 36px; font-weight: bold; color: #0891b2;">
                            $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f8f8f8; border-radius: 8px 8px 0 0;">
                              <p style="margin: 0; font-size: 14px; color: #666666;">Current DSO</p>
                              <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; color: #333333;">${inputs.currentDSO} days</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #ffffff;">
                              <p style="margin: 0; font-size: 14px; color: #666666;">New DSO</p>
                              <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; color: #0891b2;">${results.newDSO?.toFixed(0)} days</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f8f8f8;">
                              <p style="margin: 0; font-size: 14px; color: #666666;">Cash Released</p>
                              <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; color: #10b981;">
                                $${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
                              <p style="margin: 0; font-size: 14px; color: #666666;">DSO Improvement</p>
                              <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; color: #0891b2;">${results.dsoImprovement?.toFixed(0)}%</p>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 30px 0 20px; font-size: 16px; line-height: 1.5; color: #666666;">
                          These results demonstrate the potential impact of implementing our accounts receivable management solution for ${company}.
                        </p>

                        <div style="text-align: center; margin: 30px 0;">
                          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; padding: 15px 30px; background-color: #0891b2; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                            Schedule a Demo
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px; text-align: center; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
                        <p style="margin: 0 0 10px; font-size: 12px; color: #999999;">
                          © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #999999;">
                          <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #0891b2; text-decoration: none;">Visit our website</a>
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
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Detailed ROI Analysis</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Your Detailed ROI Analysis</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Hi ${name},</p>
                        <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #666666;">
                          Thank you for completing our detailed ROI analysis. Here are your comprehensive results:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #0891b2; border-radius: 8px; padding: 20px; margin: 30px 0;">
                          <h2 style="margin: 0 0 10px; font-size: 18px; color: #0891b2;">Total Annual Benefit</h2>
                          <p style="margin: 0; font-size: 36px; font-weight: bold; color: #0891b2;">
                            $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                          <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">
                            ROI: ${results.roi?.toFixed(0)}% | Payback: ${results.paybackMonths?.toFixed(1)} months
                          </p>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f8f8f8; border-radius: 8px 8px 0 0;">
                              <p style="margin: 0; font-size: 14px; color: #666666;">DSO Reduction</p>
                              <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; color: #333333;">${results.dsoReductionDays?.toFixed(0)} days</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #ffffff;">
                              <p style="margin: 0; font-size: 14px; color: #666666;">Working Capital Released</p>
                              <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; color: #10b981;">
                                $${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f8f8f8;">
                              <p style="margin: 0; font-size: 14px; color: #666666;">Interest Savings</p>
                              <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; color: #10b981;">
                                $${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #ffffff;">
                              <p style="margin: 0; font-size: 14px; color: #666666;">Labour Cost Savings</p>
                              <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; color: #10b981;">
                                $${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
                              <p style="margin: 0; font-size: 14px; color: #666666;">Bad Debt Reduction</p>
                              <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; color: #10b981;">
                                $${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 30px 0 20px; font-size: 16px; line-height: 1.5; color: #666666;">
                          These comprehensive results show the significant impact our solution can have on ${company}'s accounts receivable operations and overall financial performance.
                        </p>

                        <div style="text-align: center; margin: 30px 0;">
                          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; padding: 15px 30px; background-color: #0891b2; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                            Schedule a Consultation
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px; text-align: center; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
                        <p style="margin: 0 0 10px; font-size: 12px; color: #999999;">
                          © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #999999;">
                          <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #0891b2; text-decoration: none;">Visit our website</a>
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

    const sendEmailCommand = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: `Your ${calculatorType === "simple" ? "ROI" : "Detailed ROI"} Analysis Results - Kuhlekt`,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: emailHtml,
            Charset: "UTF-8",
          },
        },
      },
    })

    await sesClient.send(sendEmailCommand)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
