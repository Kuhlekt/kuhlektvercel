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
            <title>ROI Calculator Results</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 28px;">Your ROI Analysis Results</h1>
                        <p style="color: #ffffff; margin: 0; font-size: 16px;">Simple Calculator</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px;">
                        <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                          Hi ${name},
                        </p>
                        <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                          Thank you for using the Kuhlekt ROI Calculator. Here are your estimated savings:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
                          <p style="color: #0891b2; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">Estimated Annual Savings</p>
                          <p style="color: #0891b2; font-size: 48px; font-weight: bold; margin: 0;">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>

                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 10px;">
                              <p style="color: #64748b; font-size: 14px; margin: 0 0 5px 0;">Current Cash Tied Up</p>
                              <p style="color: #0f172a; font-size: 24px; font-weight: bold; margin: 0;">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr><td style="height: 10px;"></td></tr>
                          <tr>
                            <td style="padding: 20px; background-color: #f0fdf4; border-radius: 8px;">
                              <p style="color: #16a34a; font-size: 14px; margin: 0 0 5px 0;">Cash Released</p>
                              <p style="color: #15803d; font-size: 24px; font-weight: bold; margin: 0;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr><td style="height: 10px;"></td></tr>
                          <tr>
                            <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px;">
                              <p style="color: #64748b; font-size: 14px; margin: 0 0 5px 0;">DSO Improvement</p>
                              <p style="color: #0f172a; font-size: 24px; font-weight: bold; margin: 0;">${inputs.currentDSO} → ${results.newDSO?.toFixed(0)} days</p>
                            </td>
                          </tr>
                        </table>

                        <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 30px 0 0 0;">
                          Ready to start improving your cash flow? Contact us to learn more about how Kuhlekt can help your business.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
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
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ROI Calculator Results</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 28px;">Your ROI Analysis Results</h1>
                        <p style="color: #ffffff; margin: 0; font-size: 16px;">Detailed Calculator</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px;">
                        <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                          Hi ${name},
                        </p>
                        <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                          Thank you for using the Kuhlekt ROI Calculator. Here is your comprehensive analysis:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
                          <p style="color: #0891b2; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">Total Annual Benefit</p>
                          <p style="color: #0891b2; font-size: 48px; font-weight: bold; margin: 0;">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                          <p style="color: #0891b2; font-size: 14px; margin: 10px 0 0 0;">ROI: ${results.roi?.toFixed(0)}% | Payback: ${results.paybackMonths?.toFixed(1)} months</p>
                        </div>

                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td width="48%" style="padding: 20px; background-color: #f0fdf4; border-radius: 8px; vertical-align: top;">
                              <p style="color: #16a34a; font-size: 12px; margin: 0 0 5px 0;">DSO Improvement</p>
                              <p style="color: #15803d; font-size: 20px; font-weight: bold; margin: 0;">${results.dsoReductionDays?.toFixed(0)} days</p>
                            </td>
                            <td width="4%"></td>
                            <td width="48%" style="padding: 20px; background-color: #f0fdf4; border-radius: 8px; vertical-align: top;">
                              <p style="color: #16a34a; font-size: 12px; margin: 0 0 5px 0;">Working Capital Released</p>
                              <p style="color: #15803d; font-size: 20px; font-weight: bold; margin: 0;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr><td colspan="3" style="height: 10px;"></td></tr>
                          <tr>
                            <td width="48%" style="padding: 20px; background-color: #f0fdf4; border-radius: 8px; vertical-align: top;">
                              <p style="color: #16a34a; font-size: 12px; margin: 0 0 5px 0;">Interest Savings</p>
                              <p style="color: #15803d; font-size: 20px; font-weight: bold; margin: 0;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                            <td width="4%"></td>
                            <td width="48%" style="padding: 20px; background-color: #f0fdf4; border-radius: 8px; vertical-align: top;">
                              <p style="color: #16a34a; font-size: 12px; margin: 0 0 5px 0;">Labour Savings</p>
                              <p style="color: #15803d; font-size: 20px; font-weight: bold; margin: 0;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr><td colspan="3" style="height: 10px;"></td></tr>
                          <tr>
                            <td width="48%" style="padding: 20px; background-color: #f0fdf4; border-radius: 8px; vertical-align: top;">
                              <p style="color: #16a34a; font-size: 12px; margin: 0 0 5px 0;">Bad Debt Reduction</p>
                              <p style="color: #15803d; font-size: 20px; font-weight: bold; margin: 0;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                            <td width="4%"></td>
                            <td width="48%" style="padding: 20px; background-color: #f8fafc; border-radius: 8px; vertical-align: top;">
                              <p style="color: #64748b; font-size: 12px; margin: 0 0 5px 0;">ROI</p>
                              <p style="color: #0f172a; font-size: 20px; font-weight: bold; margin: 0;">${results.roi?.toFixed(0)}%</p>
                            </td>
                          </tr>
                        </table>

                        <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 30px 0 0 0;">
                          Ready to unlock these savings? Contact us to learn more about how Kuhlekt can transform your accounts receivable process.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
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

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: `Your ROI Calculator Results - ${company}`,
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

    await sesClient.send(command)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
