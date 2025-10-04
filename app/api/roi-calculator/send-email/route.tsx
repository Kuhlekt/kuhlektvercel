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

    let emailHtml = ""
    let emailText = ""

    if (calculatorType === "simple") {
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Your ROI Analysis Results</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Your ROI Analysis</h1>
                      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Simple Calculator Results</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <p style="color: #333333; font-size: 16px; margin: 0 0 30px 0;">Dear ${name},</p>
                      <p style="color: #333333; font-size: 16px; margin: 0 0 30px 0;">
                        Thank you for using our ROI calculator. Here are your results based on the information you provided:
                      </p>
                      
                      <div style="background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
                        <p style="color: #0891b2; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Estimated Annual Savings</p>
                        <p style="color: #0891b2; font-size: 48px; font-weight: bold; margin: 0;">
                          $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                      </div>

                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; width: 48%;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 8px 0;">Current Cash Tied Up</p>
                            <p style="color: #333333; font-size: 24px; font-weight: bold; margin: 0;">
                              $${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </td>
                          <td style="width: 4%;"></td>
                          <td style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; width: 48%;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 8px 0;">Cash Released</p>
                            <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 0;">
                              $${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                        <tr>
                          <td style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; width: 48%;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 8px 0;">Current DSO</p>
                            <p style="color: #333333; font-size: 24px; font-weight: bold; margin: 0;">${inputs.currentDSO} days</p>
                          </td>
                          <td style="width: 4%;"></td>
                          <td style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; width: 48%;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 8px 0;">New DSO</p>
                            <p style="color: #0891b2; font-size: 24px; font-weight: bold; margin: 0;">${results.newDSO?.toFixed(0)} days</p>
                          </td>
                        </tr>
                      </table>

                      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0;">
                        <p style="color: #1e40af; font-size: 16px; margin: 0; font-weight: bold;">Ready to learn more?</p>
                        <p style="color: #1e40af; font-size: 14px; margin: 10px 0 0 0;">
                          Schedule a demo with our team to see how Kuhlekt can help you achieve these results.
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center;">
                      <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0;">
                        Best regards,<br/>
                        The Kuhlekt Team
                      </p>
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

      emailText = `
Dear ${name},

Thank you for using our ROI calculator. Here are your results:

Estimated Annual Savings: $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}

Current Cash Tied Up: $${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
Cash Released: $${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}

Current DSO: ${inputs.currentDSO} days
New DSO: ${results.newDSO?.toFixed(0)} days

Ready to learn more? Schedule a demo with our team to see how Kuhlekt can help you achieve these results.

Best regards,
The Kuhlekt Team
      `
    } else {
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Your Detailed ROI Analysis</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Your Detailed ROI Analysis</h1>
                      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Comprehensive Invoice-to-Cash Results</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <p style="color: #333333; font-size: 16px; margin: 0 0 30px 0;">Dear ${name},</p>
                      
                      <div style="background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
                        <p style="color: #0891b2; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase;">Total Annual Benefit</p>
                        <p style="color: #0891b2; font-size: 48px; font-weight: bold; margin: 0 0 15px 0;">
                          $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                        <p style="color: #0891b2; font-size: 14px; margin: 0;">
                          ROI: ${results.roi?.toFixed(0)}% • Payback: ${results.paybackMonths?.toFixed(1)} months
                        </p>
                      </div>

                      <h2 style="color: #0891b2; font-size: 20px; margin: 30px 0 20px 0;">Key Metrics</h2>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                        <tr>
                          <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; width: 31%;">
                            <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0;">DSO Improvement</p>
                            <p style="color: #333333; font-size: 20px; font-weight: bold; margin: 0;">
                              ${results.dsoReductionDays?.toFixed(0)} days
                            </p>
                          </td>
                          <td style="width: 3.5%;"></td>
                          <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; width: 31%;">
                            <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0;">Working Capital</p>
                            <p style="color: #10b981; font-size: 20px; font-weight: bold; margin: 0;">
                              $${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </td>
                          <td style="width: 3.5%;"></td>
                          <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; width: 31%;">
                            <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0;">Interest Savings</p>
                            <p style="color: #10b981; font-size: 20px; font-weight: bold; margin: 0;">
                              $${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                        <tr>
                          <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; width: 48%;">
                            <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0;">Labour Savings</p>
                            <p style="color: #10b981; font-size: 20px; font-weight: bold; margin: 0;">
                              $${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </td>
                          <td style="width: 4%;"></td>
                          <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; width: 48%;">
                            <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0;">Bad Debt Reduction</p>
                            <p style="color: #10b981; font-size: 20px; font-weight: bold; margin: 0;">
                              $${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </td>
                        </tr>
                      </table>

                      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0;">
                        <p style="color: #1e40af; font-size: 16px; margin: 0; font-weight: bold;">Ready to achieve these results?</p>
                        <p style="color: #1e40af; font-size: 14px; margin: 10px 0 0 0;">
                          Schedule a personalized demo to see how Kuhlekt can transform your accounts receivable process.
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center;">
                      <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0;">
                        Best regards,<br/>
                        The Kuhlekt Team
                      </p>
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

      emailText = `
Dear ${name},

Thank you for using our detailed ROI calculator. Here are your comprehensive results:

Total Annual Benefit: $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
ROI: ${results.roi?.toFixed(0)}%
Payback Period: ${results.paybackMonths?.toFixed(1)} months

Key Metrics:
- DSO Improvement: ${results.dsoReductionDays?.toFixed(0)} days
- Working Capital Released: $${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Interest Savings: $${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Labour Savings: $${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Bad Debt Reduction: $${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}

Ready to achieve these results? Schedule a personalized demo to see how Kuhlekt can transform your accounts receivable process.

Best regards,
The Kuhlekt Team
      `
    }

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: `Your ROI Analysis Results - ${company}`,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: emailText,
            Charset: "UTF-8",
          },
          Html: {
            Data: emailHtml,
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
