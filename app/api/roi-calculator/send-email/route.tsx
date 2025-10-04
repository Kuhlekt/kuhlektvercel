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

    let htmlContent = ""

    if (calculatorType === "simple") {
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ROI Calculator Results</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 40px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Your ROI Analysis Results</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px;">Dear ${name},</p>
                        <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 24px;">
                          Thank you for using the Kuhlekt ROI Calculator. Here are your personalized results:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
                          <div style="color: #0891b2; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                            Estimated Annual Savings
                          </div>
                          <div style="color: #0891b2; font-size: 48px; font-weight: bold; margin: 10px 0;">
                            $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </div>
                        </div>

                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; width: 48%;">
                              <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Current Cash Tied Up</div>
                              <div style="color: #111827; font-size: 24px; font-weight: bold;">
                                $${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </div>
                            </td>
                            <td style="width: 4%;"></td>
                            <td style="padding: 20px; background-color: #f0fdf4; border-radius: 8px; width: 48%;">
                              <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Cash Released</div>
                              <div style="color: #16a34a; font-size: 24px; font-weight: bold;">
                                $${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </div>
                            </td>
                          </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                          <tr>
                            <td style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; width: 48%;">
                              <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Current DSO</div>
                              <div style="color: #111827; font-size: 24px; font-weight: bold;">${inputs.currentDSO} days</div>
                            </td>
                            <td style="width: 4%;"></td>
                            <td style="padding: 20px; background-color: #f0f9ff; border-radius: 8px; width: 48%;">
                              <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">New DSO</div>
                              <div style="color: #0891b2; font-size: 24px; font-weight: bold;">${results.newDSO?.toFixed(0)} days</div>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 30px 0 20px 0; color: #333333; font-size: 16px; line-height: 24px;">
                          These results demonstrate the potential financial impact of implementing Kuhlekt's automated accounts receivable solution at ${company}.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; font-weight: bold;">
                          Ready to unlock these savings?
                        </p>
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">
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
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Detailed ROI Analysis</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 40px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Detailed ROI Analysis</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px;">Dear ${name},</p>
                        <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 24px;">
                          Here is your comprehensive ROI analysis for ${company}:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
                          <div style="color: #0891b2; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                            Total Annual Benefit
                          </div>
                          <div style="color: #0891b2; font-size: 48px; font-weight: bold; margin: 10px 0;">
                            $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </div>
                          <div style="color: #6b7280; font-size: 14px; margin-top: 15px;">
                            ROI: <strong>${results.roi?.toFixed(0)}%</strong> | Payback: <strong>${results.paybackMonths?.toFixed(1)} months</strong>
                          </div>
                        </div>

                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; width: 31%; text-align: center;">
                              <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px;">DSO Improvement</div>
                              <div style="color: #111827; font-size: 20px; font-weight: bold;">${results.dsoReductionDays?.toFixed(0)} days</div>
                            </td>
                            <td style="width: 3.5%;"></td>
                            <td style="padding: 15px; background-color: #f0fdf4; border-radius: 8px; width: 31%; text-align: center;">
                              <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px;">Working Capital</div>
                              <div style="color: #16a34a; font-size: 20px; font-weight: bold;">
                                $${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </div>
                            </td>
                            <td style="width: 3.5%;"></td>
                            <td style="padding: 15px; background-color: #f0fdf4; border-radius: 8px; width: 31%; text-align: center;">
                              <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px;">Interest Savings</div>
                              <div style="color: #16a34a; font-size: 20px; font-weight: bold;">
                                $${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </div>
                            </td>
                          </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f0fdf4; border-radius: 8px; width: 48%; text-align: center;">
                              <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px;">Labour Savings</div>
                              <div style="color: #16a34a; font-size: 20px; font-weight: bold;">
                                $${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </div>
                            </td>
                            <td style="width: 4%;"></td>
                            <td style="padding: 15px; background-color: #f0fdf4; border-radius: 8px; width: 48%; text-align: center;">
                              <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px;">Bad Debt Reduction</div>
                              <div style="color: #16a34a; font-size: 20px; font-weight: bold;">
                                $${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </div>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 30px 0 20px 0; color: #333333; font-size: 16px; line-height: 24px;">
                          This comprehensive analysis shows the significant financial benefits Kuhlekt can deliver to ${company}.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; font-weight: bold;">
                          Ready to transform your accounts receivable?
                        </p>
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">
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
            Data: htmlContent,
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
