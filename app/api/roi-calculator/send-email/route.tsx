import { type NextRequest, NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function generateSimpleROIEmailHTML(data: any): string {
  const { name, company, results } = data

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Kuhlekt ROI Calculator</h1>
                    <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">Your Personalized Results</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #1e293b; margin: 0 0 10px 0; font-size: 24px;">Hi ${name},</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Thank you for using the Kuhlekt ROI Calculator. Here are your results for ${company}:
                    </p>
                    
                    <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 0 0 30px 0;">
                      <p style="color: #e0f2fe; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Estimated Annual Savings</p>
                      <p style="color: #ffffff; margin: 0; font-size: 48px; font-weight: bold;">
                        ${formatCurrency(results.annualSavings)}
                      </p>
                    </div>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px 0;">
                      <tr>
                        <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px; width: 48%;">
                          <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">Current Cash Tied Up</p>
                          <p style="color: #1e293b; margin: 0; font-size: 24px; font-weight: bold;">
                            ${formatCurrency(results.currentCashTied)}
                          </p>
                        </td>
                        <td style="width: 4%;"></td>
                        <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px; width: 48%;">
                          <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">Cash Released</p>
                          <p style="color: #059669; margin: 0; font-size: 24px; font-weight: bold;">
                            ${formatCurrency(results.cashReleased)}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px; width: 48%;">
                          <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">Current DSO</p>
                          <p style="color: #1e293b; margin: 0; font-size: 24px; font-weight: bold;">
                            ${results.currentDSO} days
                          </p>
                        </td>
                        <td style="width: 4%;"></td>
                        <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px; width: 48%;">
                          <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">New DSO</p>
                          <p style="color: #0891b2; margin: 0; font-size: 24px; font-weight: bold;">
                            ${Math.round(results.newDSO)} days
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8fafc; padding: 30px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                      Ready to transform your accounts receivable process? Contact us to learn how Kuhlekt can help you achieve these results.
                    </p>
                    <div style="text-align: center;">
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact" style="display: inline-block; background-color: #0891b2; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                        Get Started
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #1e293b; padding: 20px; text-align: center;">
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

function generateDetailedROIEmailHTML(data: any): string {
  const { name, company, results } = data

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Kuhlekt ROI Calculator</h1>
                    <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">Detailed Analysis Results</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #1e293b; margin: 0 0 10px 0; font-size: 24px;">Hi ${name},</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Here's your comprehensive ROI analysis for ${company}:
                    </p>
                    
                    <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 0 0 20px 0;">
                      <p style="color: #e0f2fe; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Total Annual Benefit</p>
                      <p style="color: #ffffff; margin: 0 0 15px 0; font-size: 48px; font-weight: bold;">
                        ${formatCurrency(results.totalAnnualBenefit)}
                      </p>
                      <div style="display: flex; justify-content: center; gap: 30px;">
                        <div>
                          <p style="color: #e0f2fe; margin: 0; font-size: 14px;">ROI</p>
                          <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 20px; font-weight: bold;">
                            ${Math.round(results.roi)}%
                          </p>
                        </div>
                        <div style="width: 1px; background-color: rgba(255, 255, 255, 0.2);"></div>
                        <div>
                          <p style="color: #e0f2fe; margin: 0; font-size: 14px;">Payback Period</p>
                          <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 20px; font-weight: bold;">
                            ${results.paybackMonths.toFixed(1)} months
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 style="color: #1e293b; margin: 30px 0 15px 0; font-size: 20px;">Key Metrics</h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 20px 0;">
                      <tr>
                        <td style="padding: 15px; background-color: #f8fafc; border-radius: 8px; width: 31%;">
                          <p style="color: #64748b; margin: 0 0 5px 0; font-size: 12px;">DSO Improvement</p>
                          <p style="color: #1e293b; margin: 0; font-size: 20px; font-weight: bold;">
                            ${Math.round(results.dsoReductionDays)} days
                          </p>
                        </td>
                        <td style="width: 3.5%;"></td>
                        <td style="padding: 15px; background-color: #f8fafc; border-radius: 8px; width: 31%;">
                          <p style="color: #64748b; margin: 0 0 5px 0; font-size: 12px;">Working Capital</p>
                          <p style="color: #059669; margin: 0; font-size: 20px; font-weight: bold;">
                            ${formatCurrency(results.workingCapitalReleased)}
                          </p>
                        </td>
                        <td style="width: 3.5%;"></td>
                        <td style="padding: 15px; background-color: #f8fafc; border-radius: 8px; width: 31%;">
                          <p style="color: #64748b; margin: 0 0 5px 0; font-size: 12px;">Interest Savings</p>
                          <p style="color: #059669; margin: 0; font-size: 20px; font-weight: bold;">
                            ${formatCurrency(results.interestSavings)}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 15px; background-color: #f8fafc; border-radius: 8px; width: 48%;">
                          <p style="color: #64748b; margin: 0 0 5px 0; font-size: 12px;">Labour Savings</p>
                          <p style="color: #059669; margin: 0; font-size: 20px; font-weight: bold;">
                            ${formatCurrency(results.labourCostSavings)}
                          </p>
                        </td>
                        <td style="width: 4%;"></td>
                        <td style="padding: 15px; background-color: #f8fafc; border-radius: 8px; width: 48%;">
                          <p style="color: #64748b; margin: 0 0 5px 0; font-size: 12px;">Bad Debt Reduction</p>
                          <p style="color: #059669; margin: 0; font-size: 20px; font-weight: bold;">
                            ${formatCurrency(results.badDebtReduction)}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8fafc; padding: 30px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                      These results show the significant impact Kuhlekt can have on your business. Let's discuss how we can help you achieve these improvements.
                    </p>
                    <div style="text-align: center;">
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact" style="display: inline-block; background-color: #0891b2; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                        Schedule a Consultation
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #1e293b; padding: 20px; text-align: center;">
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, calculatorType, results } = body

    console.log("[Send ROI Email] Sending email to:", email)

    const htmlContent =
      calculatorType === "simple"
        ? generateSimpleROIEmailHTML({ name, company, results })
        : generateDetailedROIEmailHTML({ name, company, results })

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
            Data: htmlContent,
            Charset: "UTF-8",
          },
        },
      },
    }

    await sesClient.send(new SendEmailCommand(emailParams))
    console.log("[Send ROI Email] Email sent successfully")

    return NextResponse.json({
      success: true,
      message: "ROI results sent successfully",
    })
  } catch (error) {
    console.error("[Send ROI Email] Error:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
