import { NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

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

    if (!email || !name || !calculatorType || !results) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    let htmlContent = ""

    if (calculatorType === "simple") {
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your ROI Analysis Results</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Kuhlekt ROI Calculator</h1>
                        <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Your Simple ROI Analysis Results</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px;">Dear ${name},</p>
                        <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Thank you for using the Kuhlekt ROI Calculator. Based on your inputs, here are your estimated savings:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                          <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Estimated Annual Savings</p>
                          <h2 style="margin: 0; color: #ffffff; font-size: 48px; font-weight: bold;">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
                        </div>

                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td style="padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 10px;">
                              <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">Current Cash Tied Up</p>
                              <p style="margin: 0; color: #1f2937; font-size: 24px; font-weight: bold;">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr><td style="height: 10px;"></td></tr>
                          <tr>
                            <td style="padding: 20px; background-color: #f0f9ff; border-radius: 8px;">
                              <p style="margin: 0 0 5px 0; color: #0891b2; font-size: 14px;">Cash Released</p>
                              <p style="margin: 0; color: #0891b2; font-size: 24px; font-weight: bold;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr><td style="height: 10px;"></td></tr>
                          <tr>
                            <td style="padding: 20px; background-color: #f9fafb; border-radius: 8px;">
                              <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">DSO Improvement</p>
                              <p style="margin: 0; color: #1f2937; font-size: 24px; font-weight: bold;">${inputs.currentDSO} → ${results.newDSO?.toFixed(0)} days</p>
                            </td>
                          </tr>
                        </table>

                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0;">
                          <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                            <strong>Next Steps:</strong> Schedule a demo with our team to see how Kuhlekt can help you achieve these results and more.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Ready to transform your accounts receivable?</p>
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; background-color: #0891b2; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 16px;">Schedule a Demo</a>
                        <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px;">
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
            <title>Your Detailed ROI Analysis</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Kuhlekt ROI Calculator</h1>
                        <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Your Detailed ROI Analysis Results</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px;">Dear ${name},</p>
                        <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Thank you for completing our comprehensive ROI analysis. Here's your detailed breakdown:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                          <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Total Annual Benefit</p>
                          <h2 style="margin: 0; color: #ffffff; font-size: 48px; font-weight: bold;">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
                          <p style="margin: 15px 0 0 0; color: #ffffff; font-size: 16px;">ROI: ${results.roi?.toFixed(0)}% | Payback: ${results.paybackMonths?.toFixed(1)} months</p>
                        </div>

                        <h3 style="margin: 30px 0 15px 0; color: #1f2937; font-size: 20px; font-weight: 600;">Key Savings Breakdown</h3>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #f0f9ff; border-radius: 8px; margin-bottom: 10px;">
                              <p style="margin: 0 0 5px 0; color: #0891b2; font-size: 14px;">DSO Improvement</p>
                              <p style="margin: 0; color: #1f2937; font-size: 20px; font-weight: bold;">${results.dsoReductionDays?.toFixed(0)} days</p>
                            </td>
                          </tr>
                          <tr><td style="height: 10px;"></td></tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
                              <p style="margin: 0 0 5px 0; color: #0891b2; font-size: 14px;">Working Capital Released</p>
                              <p style="margin: 0; color: #1f2937; font-size: 20px; font-weight: bold;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr><td style="height: 10px;"></td></tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
                              <p style="margin: 0 0 5px 0; color: #0891b2; font-size: 14px;">Interest Savings</p>
                              <p style="margin: 0; color: #1f2937; font-size: 20px; font-weight: bold;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr><td style="height: 10px;"></td></tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
                              <p style="margin: 0 0 5px 0; color: #0891b2; font-size: 14px;">Labour Cost Savings</p>
                              <p style="margin: 0; color: #1f2937; font-size: 20px; font-weight: bold;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr><td style="height: 10px;"></td></tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
                              <p style="margin: 0 0 5px 0; color: #0891b2; font-size: 14px;">Bad Debt Reduction</p>
                              <p style="margin: 0; color: #1f2937; font-size: 20px; font-weight: bold;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                        </table>

                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0;">
                          <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                            <strong>Next Steps:</strong> Our team can show you exactly how to achieve these results with Kuhlekt's automated receivables management platform.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Let's discuss your personalized implementation plan</p>
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; background-color: #0891b2; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 16px;">Schedule a Demo</a>
                        <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px;">
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
          Data: `Your Kuhlekt ROI Analysis Results - ${company || name}`,
        },
        Body: {
          Html: {
            Data: htmlContent,
          },
        },
      },
    }

    const command = new SendEmailCommand(emailParams)
    await ses.send(command)

    console.log("ROI results sent successfully to:", email)

    return NextResponse.json({
      success: true,
      message: "ROI results sent successfully",
    })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
