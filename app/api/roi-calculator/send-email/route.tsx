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

    if (!email || !results) {
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
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px;">
                        <h1 style="color: #0891b2; margin: 0 0 20px 0; font-size: 28px;">Your ROI Analysis Results</h1>
                        <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
                          Hi ${name}, thank you for using the Kuhlekt ROI Calculator. Here are your results:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                          <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Estimated Annual Savings</p>
                          <p style="color: #ffffff; font-size: 42px; font-weight: bold; margin: 0;">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>

                        <table width="100%" cellpadding="15" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td style="width: 50%; background-color: #f8fafc; border-radius: 8px; padding: 20px;">
                              <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">Current Cash Tied Up</p>
                              <p style="color: #0891b2; font-size: 24px; font-weight: bold; margin: 0;">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                            <td style="width: 50%; background-color: #f8fafc; border-radius: 8px; padding: 20px;">
                              <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">Cash Released</p>
                              <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 0;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                        </table>

                        <table width="100%" cellpadding="15" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td style="width: 50%; background-color: #f8fafc; border-radius: 8px; padding: 20px;">
                              <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">Current DSO</p>
                              <p style="color: #0891b2; font-size: 24px; font-weight: bold; margin: 0;">${inputs.currentDSO} days</p>
                            </td>
                            <td style="width: 50%; background-color: #f8fafc; border-radius: 8px; padding: 20px;">
                              <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">New DSO</p>
                              <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 0;">${results.newDSO?.toFixed(0)} days</p>
                            </td>
                          </tr>
                        </table>

                        <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; border-radius: 4px; padding: 20px; margin: 30px 0;">
                          <p style="color: #333333; font-size: 14px; line-height: 1.6; margin: 0;">
                            Ready to unlock these savings? <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="color: #0891b2; text-decoration: none; font-weight: bold;">Schedule a demo</a> to see how Kuhlekt can transform your accounts receivable process.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
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
    } else {
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px;">
                        <h1 style="color: #0891b2; margin: 0 0 20px 0; font-size: 28px;">Your Detailed ROI Analysis</h1>
                        <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
                          Hi ${name}, thank you for using the Kuhlekt ROI Calculator. Here's your comprehensive analysis:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                          <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Total Annual Benefit</p>
                          <p style="color: #ffffff; font-size: 42px; font-weight: bold; margin: 0;">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                          <p style="color: #ffffff; font-size: 14px; margin: 15px 0 0 0;">ROI: ${results.roi?.toFixed(0)}% | Payback: ${results.paybackMonths?.toFixed(1)} months</p>
                        </div>

                        <h2 style="color: #0891b2; font-size: 20px; margin: 30px 0 20px 0;">Key Benefits</h2>

                        <table width="100%" cellpadding="0" cellspacing="10">
                          <tr>
                            <td style="width: 33%; background-color: #f8fafc; border-radius: 8px; padding: 20px; text-align: center;">
                              <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">DSO Improvement</p>
                              <p style="color: #0891b2; font-size: 24px; font-weight: bold; margin: 0;">${results.dsoReductionDays?.toFixed(0)} days</p>
                            </td>
                            <td style="width: 33%; background-color: #f8fafc; border-radius: 8px; padding: 20px; text-align: center;">
                              <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">Cash Released</p>
                              <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 0;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                            <td style="width: 33%; background-color: #f8fafc; border-radius: 8px; padding: 20px; text-align: center;">
                              <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">Interest Savings</p>
                              <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 0;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="width: 33%; background-color: #f8fafc; border-radius: 8px; padding: 20px; text-align: center;">
                              <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">Labour Savings</p>
                              <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 0;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                            <td style="width: 33%; background-color: #f8fafc; border-radius: 8px; padding: 20px; text-align: center;">
                              <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">Bad Debt Reduction</p>
                              <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 0;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </td>
                            <td style="width: 33%; background-color: #f8fafc; border-radius: 8px; padding: 20px; text-align: center;">
                              <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">ROI</p>
                              <p style="color: #0891b2; font-size: 24px; font-weight: bold; margin: 0;">${results.roi?.toFixed(0)}%</p>
                            </td>
                          </tr>
                        </table>

                        <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; border-radius: 4px; padding: 20px; margin: 30px 0;">
                          <p style="color: #333333; font-size: 14px; line-height: 1.6; margin: 0;">
                            These impressive results are within reach. <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="color: #0891b2; text-decoration: none; font-weight: bold;">Schedule a demo</a> to see how Kuhlekt can deliver these benefits for ${company}.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
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
    }

    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: "Your Kuhlekt ROI Calculator Results" },
        Body: { Html: { Data: htmlContent } },
      },
    }

    await ses.send(new SendEmailCommand(emailParams))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
