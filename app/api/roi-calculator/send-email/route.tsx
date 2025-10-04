import { NextResponse } from "next/server"
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses"

const ses = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    const { name, email, company, calculatorType, results, inputs } = await request.json()

    let emailHtml = ""

    if (calculatorType === "simple") {
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your ROI Results</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Your ROI Results</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">Hi ${name},</p>
                        <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.5;">
                          Thank you for using our ROI Calculator. Here are your results based on the information you provided:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                          <p style="margin: 0 0 10px; color: rgba(255,255,255,0.9); font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Estimated Annual Savings</p>
                          <p style="margin: 0; color: #ffffff; font-size: 48px; font-weight: bold;">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f9fafb; border-radius: 6px 6px 0 0;">
                              <p style="margin: 0; color: #6b7280; font-size: 14px;">Current Cash Tied Up</p>
                              <p style="margin: 5px 0 0; color: #111827; font-size: 20px; font-weight: bold;">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f0f9ff;">
                              <p style="margin: 0; color: #6b7280; font-size: 14px;">Cash Released</p>
                              <p style="margin: 5px 0 0; color: #059669; font-size: 20px; font-weight: bold;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f9fafb;">
                              <p style="margin: 0; color: #6b7280; font-size: 14px;">Current DSO</p>
                              <p style="margin: 5px 0 0; color: #111827; font-size: 20px; font-weight: bold;">${inputs.currentDSO} days</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f0f9ff; border-radius: 0 0 6px 6px;">
                              <p style="margin: 0; color: #6b7280; font-size: 14px;">New DSO</p>
                              <p style="margin: 5px 0 0; color: #0891b2; font-size: 20px; font-weight: bold;">${results.newDSO?.toFixed(0)} days</p>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 30px 0 20px; color: #374151; font-size: 16px; line-height: 1.5;">
                          Ready to see how Kuhlekt can help you achieve these results? Let's schedule a demo to discuss your specific needs.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                        <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px;">
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
            <title>Your Detailed ROI Results</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Your Detailed ROI Analysis</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">Hi ${name},</p>
                        <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.5;">
                          Thank you for using our comprehensive ROI Calculator. Here's your detailed analysis:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                          <p style="margin: 0 0 10px; color: rgba(255,255,255,0.9); font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Total Annual Benefit</p>
                          <p style="margin: 0 0 15px; color: #ffffff; font-size: 48px; font-weight: bold;">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                          <div style="display: inline-block; background-color: rgba(255,255,255,0.2); border-radius: 20px; padding: 8px 16px; margin: 0 8px;">
                            <span style="color: #ffffff; font-size: 14px;">ROI: ${results.roi?.toFixed(0)}%</span>
                          </div>
                          <div style="display: inline-block; background-color: rgba(255,255,255,0.2); border-radius: 20px; padding: 8px 16px; margin: 0 8px;">
                            <span style="color: #ffffff; font-size: 14px;">Payback: ${results.paybackMonths?.toFixed(1)} months</span>
                          </div>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                          <tr>
                            <td style="width: 50%; padding: 15px; background-color: #f9fafb;">
                              <p style="margin: 0; color: #6b7280; font-size: 12px;">DSO Improvement</p>
                              <p style="margin: 5px 0 0; color: #111827; font-size: 18px; font-weight: bold;">${results.dsoReductionDays?.toFixed(0)} days</p>
                            </td>
                            <td style="width: 50%; padding: 15px; background-color: #f0f9ff;">
                              <p style="margin: 0; color: #6b7280; font-size: 12px;">Working Capital Released</p>
                              <p style="margin: 5px 0 0; color: #059669; font-size: 18px; font-weight: bold;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f0f9ff;">
                              <p style="margin: 0; color: #6b7280; font-size: 12px;">Interest Savings</p>
                              <p style="margin: 5px 0 0; color: #059669; font-size: 18px; font-weight: bold;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                            <td style="padding: 15px; background-color: #f9fafb;">
                              <p style="margin: 0; color: #6b7280; font-size: 12px;">Labour Savings</p>
                              <p style="margin: 5px 0 0; color: #059669; font-size: 18px; font-weight: bold;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f9fafb;">
                              <p style="margin: 0; color: #6b7280; font-size: 12px;">Bad Debt Reduction</p>
                              <p style="margin: 5px 0 0; color: #059669; font-size: 18px; font-weight: bold;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                            <td style="padding: 15px; background-color: #f0f9ff;">
                              <p style="margin: 0; color: #6b7280; font-size: 12px;">ROI</p>
                              <p style="margin: 5px 0 0; color: #0891b2; font-size: 18px; font-weight: bold;">${results.roi?.toFixed(0)}%</p>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 30px 0 20px; color: #374151; font-size: 16px; line-height: 1.5;">
                          These results demonstrate significant potential for improvement in your accounts receivable process. Let's discuss how Kuhlekt can help you achieve these benefits.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                        <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px;">
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
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: emailHtml,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: `Your ${calculatorType === "simple" ? "Simple" : "Detailed"} ROI Results - ${company}`,
        },
      },
      Source: process.env.AWS_SES_FROM_EMAIL!,
    })

    await ses.send(command)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
