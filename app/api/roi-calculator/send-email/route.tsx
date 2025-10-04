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

    let emailBody = ""

    if (calculatorType === "simple") {
      emailBody = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ROI Calculation Results</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h1 style="color: #0891b2; margin: 0 0 10px 0; font-size: 28px;">ROI Calculation Results</h1>
                        <p style="color: #666; font-size: 14px; margin: 0 0 30px 0;">For ${company}</p>
                        
                        <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px; border-radius: 8px; text-align: center; margin: 0 0 30px 0;">
                          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 10px 0;">Estimated Annual Savings</p>
                          <p style="color: #ffffff; font-size: 48px; font-weight: bold; margin: 0;">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>

                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px 8px 0 0; border-bottom: 1px solid #e9ecef;">
                              <p style="color: #666; font-size: 14px; margin: 0;">Current Cash Tied Up</p>
                              <p style="color: #333; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                              <p style="color: #666; font-size: 14px; margin: 0;">Cash Released</p>
                              <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                              <p style="color: #666; font-size: 14px; margin: 0;">Current DSO</p>
                              <p style="color: #333; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">${inputs.currentDSO} days</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                              <p style="color: #666; font-size: 14px; margin: 0;">New DSO</p>
                              <p style="color: #0891b2; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">${results.newDSO?.toFixed(0)} days</p>
                            </td>
                          </tr>
                        </table>

                        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0891b2;">
                          <p style="color: #333; font-size: 14px; line-height: 22px; margin: 0;">
                            <strong>Next Steps:</strong> Our team will reach out to discuss how Kuhlekt can help you achieve these results. 
                            In the meantime, feel free to explore our platform or schedule a demo.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
                        <p style="color: #999; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
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
            <title>Detailed ROI Analysis</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h1 style="color: #0891b2; margin: 0 0 10px 0; font-size: 28px;">Detailed ROI Analysis</h1>
                        <p style="color: #666; font-size: 14px; margin: 0 0 30px 0;">For ${company}</p>
                        
                        <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px; border-radius: 8px; text-align: center; margin: 0 0 30px 0;">
                          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 10px 0;">Total Annual Benefit</p>
                          <p style="color: #ffffff; font-size: 48px; font-weight: bold; margin: 0 0 10px 0;">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">ROI: ${results.roi?.toFixed(0)}% • Payback: ${results.paybackMonths?.toFixed(1)} months</p>
                        </div>

                        <h2 style="color: #333; font-size: 20px; margin: 0 0 15px 0;">Key Benefits</h2>
                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px 8px 0 0; border-bottom: 1px solid #e9ecef;">
                              <p style="color: #666; font-size: 14px; margin: 0;">DSO Improvement</p>
                              <p style="color: #333; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">${results.dsoReductionDays?.toFixed(0)} days</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                              <p style="color: #666; font-size: 14px; margin: 0;">Working Capital Released</p>
                              <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                              <p style="color: #666; font-size: 14px; margin: 0;">Interest Savings</p>
                              <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                              <p style="color: #666; font-size: 14px; margin: 0;">Labour Savings</p>
                              <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                              <p style="color: #666; font-size: 14px; margin: 0;">Bad Debt Reduction</p>
                              <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                              <p style="color: #666; font-size: 14px; margin: 0;">ROI</p>
                              <p style="color: #0891b2; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">${results.roi?.toFixed(0)}%</p>
                            </td>
                          </tr>
                        </table>

                        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0891b2;">
                          <p style="color: #333; font-size: 14px; line-height: 22px; margin: 0;">
                            <strong>Next Steps:</strong> Our team will reach out to discuss how Kuhlekt can help you achieve these results. 
                            In the meantime, feel free to explore our platform or schedule a demo.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
                        <p style="color: #999; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
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
          Data: `Your Kuhlekt ROI Analysis - ${company}`,
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
    console.error("Error sending email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
