import { NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

export async function POST(request: Request) {
  try {
    const { name, email, company, calculatorType, results, inputs } = await request.json()

    if (!email || !calculatorType || !results) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    let emailBody = ""

    if (calculatorType === "simple") {
      emailBody = `
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
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Kuhlekt</h1>
                        <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Your ROI Analysis Results</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 24px;">Hi ${name},</h2>
                        <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Thank you for using our ROI Calculator. Here are your results:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                          <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Estimated Annual Savings</p>
                          <p style="margin: 0; color: #ffffff; font-size: 48px; font-weight: bold;">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                          <tr>
                            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                              <p style="margin: 0; color: #6b7280; font-size: 14px;">Current Cash Tied Up</p>
                              <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 18px; font-weight: bold;">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                              <p style="margin: 0; color: #6b7280; font-size: 14px;">Cash Released</p>
                              <p style="margin: 5px 0 0 0; color: #059669; font-size: 18px; font-weight: bold;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px;">
                              <p style="margin: 0; color: #6b7280; font-size: 14px;">Current DSO</p>
                              <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 18px; font-weight: bold;">${inputs.currentDSO} days</p>
                            </td>
                            <td style="padding: 15px;">
                              <p style="margin: 0; color: #6b7280; font-size: 14px;">New DSO</p>
                              <p style="margin: 5px 0 0 0; color: #0891b2; font-size: 18px; font-weight: bold;">${results.newDSO?.toFixed(0)} days</p>
                            </td>
                          </tr>
                        </table>

                        <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; padding: 20px; margin: 30px 0;">
                          <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.5;">
                            <strong>Ready to achieve these results?</strong> Contact us today to learn more about how Kuhlekt can transform your accounts receivable process.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                        <p style="margin: 0 0 10px 0; color: #1f2937; font-size: 14px;">
                          <strong>Questions?</strong> Contact our team
                        </p>
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
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
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Kuhlekt</h1>
                        <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Detailed ROI Analysis Results</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 24px;">Hi ${name},</h2>
                        <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Thank you for using our Detailed ROI Calculator. Here's your comprehensive analysis:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                          <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Total Annual Benefit</p>
                          <p style="margin: 0; color: #ffffff; font-size: 48px; font-weight: bold;">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                          <p style="margin: 15px 0 0 0; color: #ffffff; font-size: 14px;">
                            ROI: ${results.roi?.toFixed(0)}% | Payback: ${results.paybackMonths?.toFixed(1)} months
                          </p>
                        </div>

                        <h3 style="margin: 30px 0 15px 0; color: #1f2937; font-size: 18px;">Key Metrics</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                              <p style="margin: 0; color: #6b7280; font-size: 13px;">DSO Improvement</p>
                              <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 16px; font-weight: bold;">${results.dsoReductionDays?.toFixed(0)} days</p>
                            </td>
                            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                              <p style="margin: 0; color: #6b7280; font-size: 13px;">Working Capital Released</p>
                              <p style="margin: 5px 0 0 0; color: #059669; font-size: 16px; font-weight: bold;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                              <p style="margin: 0; color: #6b7280; font-size: 13px;">Interest Savings</p>
                              <p style="margin: 5px 0 0 0; color: #059669; font-size: 16px; font-weight: bold;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                              <p style="margin: 0; color: #6b7280; font-size: 13px;">Labour Savings</p>
                              <p style="margin: 5px 0 0 0; color: #059669; font-size: 16px; font-weight: bold;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px;">
                              <p style="margin: 0; color: #6b7280; font-size: 13px;">Bad Debt Reduction</p>
                              <p style="margin: 5px 0 0 0; color: #059669; font-size: 16px; font-weight: bold;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                            <td style="padding: 12px;">
                              <p style="margin: 0; color: #6b7280; font-size: 13px;">ROI</p>
                              <p style="margin: 5px 0 0 0; color: #0891b2; font-size: 16px; font-weight: bold;">${results.roi?.toFixed(0)}%</p>
                            </td>
                          </tr>
                        </table>

                        <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; padding: 20px; margin: 30px 0;">
                          <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.5;">
                            <strong>Impressive results!</strong> Our team can help you achieve these improvements and more. Contact us to schedule a personalized demo.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                        <p style="margin: 0 0 10px 0; color: #1f2937; font-size: 14px;">
                          <strong>Questions?</strong> Contact our team
                        </p>
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
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
      Source: process.env.AWS_SES_FROM_EMAIL || "",
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: `Your Kuhlekt ROI Analysis Results - ${company}`,
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

    const command = new SendEmailCommand(emailParams)
    await sesClient.send(command)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
