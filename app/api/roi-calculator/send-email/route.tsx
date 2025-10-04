import { NextResponse } from "next/server"
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses"

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

    if (!email || !name || !company || !calculatorType || !results) {
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
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Your ROI Calculator Results</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                          Dear ${name},
                        </p>
                        <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 30px;">
                          Thank you for using the Kuhlekt ROI Calculator. Here are your results:
                        </p>
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                          <p style="color: #0891b2; font-size: 14px; font-weight: 600; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Estimated Annual Savings</p>
                          <p style="color: #0891b2; font-size: 48px; font-weight: bold; margin: 0;">$${results.annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin-bottom: 10px;">
                              <p style="color: #6b7280; font-size: 14px; margin: 0 0 5px;">Current Cash Tied Up</p>
                              <p style="color: #111827; font-size: 24px; font-weight: bold; margin: 0;">$${results.currentCashTied.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="height: 10px;"></td>
                          </tr>
                          <tr>
                            <td style="padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                              <p style="color: #6b7280; font-size: 14px; margin: 0 0 5px;">Cash Released</p>
                              <p style="color: #059669; font-size: 24px; font-weight: bold; margin: 0;">$${results.cashReleased.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="height: 10px;"></td>
                          </tr>
                          <tr>
                            <td style="padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                              <p style="color: #6b7280; font-size: 14px; margin: 0 0 5px;">DSO Improvement</p>
                              <p style="color: #111827; font-size: 24px; font-weight: bold; margin: 0;">${inputs.currentDSO} → ${results.newDSO.toFixed(0)} days</p>
                            </td>
                          </tr>
                        </table>
                        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0;">
                          <p style="color: #92400e; font-size: 14px; line-height: 1.5; margin: 0;">
                            <strong>Next Steps:</strong> Contact our team to learn how Kuhlekt can help you achieve these results and improve your accounts receivable process.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px;">
                          © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
                        </p>
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
                          This calculation is an estimate based on the information provided.
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
            <title>Detailed ROI Calculator Results</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Your Detailed ROI Analysis</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                          Dear ${name},
                        </p>
                        <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 30px;">
                          Thank you for using the Kuhlekt Detailed ROI Calculator. Here is your comprehensive analysis:
                        </p>
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                          <p style="color: #0891b2; font-size: 14px; font-weight: 600; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Total Annual Benefit</p>
                          <p style="color: #0891b2; font-size: 48px; font-weight: bold; margin: 0;">$${results.totalAnnualBenefit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #bae6fd;">
                            <p style="color: #0891b2; font-size: 14px; margin: 0;">
                              <strong>ROI: ${results.roi.toFixed(0)}%</strong> • <strong>Payback: ${results.paybackMonths.toFixed(1)} months</strong>
                            </p>
                          </div>
                        </div>
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td colspan="2" style="padding-bottom: 20px;">
                              <h2 style="color: #111827; font-size: 20px; margin: 0;">Key Benefits Breakdown</h2>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; width: 50%;">
                              <p style="color: #6b7280; font-size: 13px; margin: 0 0 5px;">DSO Improvement</p>
                              <p style="color: #111827; font-size: 20px; font-weight: bold; margin: 0;">${results.dsoReductionDays.toFixed(0)} days</p>
                            </td>
                            <td style="width: 10px;"></td>
                            <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; width: 50%;">
                              <p style="color: #6b7280; font-size: 13px; margin: 0 0 5px;">Working Capital Released</p>
                              <p style="color: #059669; font-size: 20px; font-weight: bold; margin: 0;">$${results.workingCapitalReleased.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="height: 10px;"></td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                              <p style="color: #6b7280; font-size: 13px; margin: 0 0 5px;">Interest Savings</p>
                              <p style="color: #059669; font-size: 20px; font-weight: bold; margin: 0;">$${results.interestSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                            <td style="width: 10px;"></td>
                            <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                              <p style="color: #6b7280; font-size: 13px; margin: 0 0 5px;">Labour Cost Savings</p>
                              <p style="color: #059669; font-size: 20px; font-weight: bold; margin: 0;">$${results.labourCostSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="height: 10px;"></td>
                          </tr>
                          <tr>
                            <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                              <p style="color: #6b7280; font-size: 13px; margin: 0 0 5px;">Bad Debt Reduction</p>
                              <p style="color: #059669; font-size: 20px; font-weight: bold; margin: 0;">$${results.badDebtReduction.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                            <td style="width: 10px;"></td>
                            <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                              <p style="color: #6b7280; font-size: 13px; margin: 0 0 5px;">ROI</p>
                              <p style="color: #0891b2; font-size: 20px; font-weight: bold; margin: 0;">${results.roi.toFixed(0)}%</p>
                            </td>
                          </tr>
                        </table>
                        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0;">
                          <p style="color: #92400e; font-size: 14px; line-height: 1.5; margin: 0;">
                            <strong>Next Steps:</strong> Schedule a consultation with our team to discuss how Kuhlekt can help you achieve these impressive results and transform your accounts receivable operations.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px;">
                          © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
                        </p>
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
                          This calculation is an estimate based on the information provided and industry benchmarks.
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
          Data: `Your Kuhlekt ROI Calculator Results - ${company}`,
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
