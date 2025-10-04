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

    let resultsHtml = ""

    if (calculatorType === "simple") {
      resultsHtml = `
        <div style="background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center; border: 2px solid #06b6d4;">
          <h3 style="color: #0e7490; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Estimated Annual Savings</h3>
          <div style="font-size: 48px; font-weight: bold; color: #0891b2; margin: 10px 0;">
            $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
          <tr>
            <td width="48%" style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">Current Cash Tied Up</p>
              <p style="color: #1f2937; margin: 0; font-size: 24px; font-weight: bold;">
                $${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </td>
            <td width="4%"></td>
            <td width="48%" style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; border: 1px solid #86efac;">
              <p style="color: #15803d; margin: 0 0 10px 0; font-size: 14px;">Cash Released</p>
              <p style="color: #166534; margin: 0; font-size: 24px; font-weight: bold;">
                $${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </td>
          </tr>
          <tr><td colspan="3" height="20"></td></tr>
          <tr>
            <td width="48%" style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">Current DSO</p>
              <p style="color: #1f2937; margin: 0; font-size: 24px; font-weight: bold;">
                ${inputs.currentDSO} days
              </p>
            </td>
            <td width="4%"></td>
            <td width="48%" style="background-color: #ecfeff; border-radius: 8px; padding: 20px; border: 1px solid #06b6d4;">
              <p style="color: #0e7490; margin: 0 0 10px 0; font-size: 14px;">New DSO</p>
              <p style="color: #0891b2; margin: 0; font-size: 24px; font-weight: bold;">
                ${results.newDSO?.toFixed(0)} days
              </p>
            </td>
          </tr>
        </table>
      `
    } else {
      resultsHtml = `
        <div style="background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center; border: 2px solid #06b6d4;">
          <h3 style="color: #0e7490; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Total Annual Benefit</h3>
          <div style="font-size: 48px; font-weight: bold; color: #0891b2; margin: 10px 0;">
            $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px; color: #6b7280; font-size: 14px;">
            <span>ROI: <strong>${results.roi?.toFixed(0)}%</strong></span>
            <span>•</span>
            <span>Payback: <strong>${results.paybackMonths?.toFixed(1)} months</strong></span>
          </div>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
          <tr>
            <td width="32%" style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">DSO Improvement</p>
              <p style="color: #1f2937; margin: 0; font-size: 24px; font-weight: bold;">
                ${results.dsoReductionDays?.toFixed(0)} days
              </p>
            </td>
            <td width="2%"></td>
            <td width="32%" style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; border: 1px solid #86efac;">
              <p style="color: #15803d; margin: 0 0 10px 0; font-size: 14px;">Working Capital Released</p>
              <p style="color: #166534; margin: 0; font-size: 24px; font-weight: bold;">
                $${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </td>
            <td width="2%"></td>
            <td width="32%" style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; border: 1px solid #86efac;">
              <p style="color: #15803d; margin: 0 0 10px 0; font-size: 14px;">Interest Savings</p>
              <p style="color: #166534; margin: 0; font-size: 24px; font-weight: bold;">
                $${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </td>
          </tr>
          <tr><td colspan="5" height="20"></td></tr>
          <tr>
            <td width="32%" style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; border: 1px solid #86efac;">
              <p style="color: #15803d; margin: 0 0 10px 0; font-size: 14px;">Labour Savings</p>
              <p style="color: #166534; margin: 0; font-size: 24px; font-weight: bold;">
                $${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </td>
            <td width="2%"></td>
            <td width="32%" style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; border: 1px solid #86efac;">
              <p style="color: #15803d; margin: 0 0 10px 0; font-size: 14px;">Bad Debt Reduction</p>
              <p style="color: #166534; margin: 0; font-size: 24px; font-weight: bold;">
                $${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </td>
            <td width="2%"></td>
            <td width="32%" style="background-color: #ecfeff; border-radius: 8px; padding: 20px; border: 1px solid #06b6d4;">
              <p style="color: #0e7490; margin: 0 0 10px 0; font-size: 14px;">ROI</p>
              <p style="color: #0891b2; margin: 0; font-size: 24px; font-weight: bold;">
                ${results.roi?.toFixed(0)}%
              </p>
            </td>
          </tr>
        </table>
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
            Data: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>ROI Calculator Results</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          <tr>
                            <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px 20px; text-align: center;">
                              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Kuhlekt</h1>
                              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Your ROI Calculator Results</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 40px 30px;">
                              <p style="color: #1f2937; margin: 0 0 20px 0; font-size: 16px;">
                                Hi ${name},
                              </p>
                              <p style="color: #4b5563; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">
                                Thank you for using our ROI Calculator. Here are your personalized results based on the information you provided for <strong>${company}</strong>:
                              </p>
                              
                              ${resultsHtml}

                              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                                  Ready to see these results in action?
                                </p>
                                <p style="color: #3b82f6; margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                                  Schedule a personalized demo to learn how Kuhlekt can transform your accounts receivable process and help you achieve these savings.
                                </p>
                                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; background-color: #0891b2; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                                  Schedule a Demo
                                </a>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                                Questions? Contact us at <a href="mailto:support@kuhlekt.com" style="color: #0891b2; text-decoration: none;">support@kuhlekt.com</a>
                              </p>
                              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
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
            `,
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
