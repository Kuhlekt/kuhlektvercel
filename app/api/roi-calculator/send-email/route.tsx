import { NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

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
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background-color: #1e40af; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Your ROI Calculation Results</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="color: #1e40af; margin: 0 0 20px;">Hi ${name},</h2>
                        <p style="font-size: 16px; color: #333333; margin: 0 0 30px;">Thank you for using our ROI calculator. Here are your results:</p>
                        
                        <table width="100%" cellpadding="10" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 30px;">
                          <tr style="background-color: #f8f9fa;">
                            <td style="font-weight: bold; color: #333;">Current DSO</td>
                            <td style="text-align: right;">${results.currentDSO} days</td>
                          </tr>
                          <tr>
                            <td style="font-weight: bold; color: #333;">New DSO</td>
                            <td style="text-align: right;">${results.newDSO.toFixed(1)} days</td>
                          </tr>
                          <tr style="background-color: #f8f9fa;">
                            <td style="font-weight: bold; color: #333;">DSO Improvement</td>
                            <td style="text-align: right;">${results.dsoImprovement}%</td>
                          </tr>
                          <tr>
                            <td style="font-weight: bold; color: #333;">Cash Released</td>
                            <td style="text-align: right; color: #16a34a; font-weight: bold;">${formatCurrency(results.cashReleased)}</td>
                          </tr>
                          <tr style="background-color: #f8f9fa;">
                            <td style="font-weight: bold; color: #333;">Annual Savings</td>
                            <td style="text-align: right; color: #16a34a; font-weight: bold;">${formatCurrency(results.annualSavings)}</td>
                          </tr>
                        </table>

                        <p style="font-size: 14px; color: #666666; margin: 20px 0;">Want to learn more about how Kuhlekt can help improve your accounts receivable process?</p>
                        <div style="text-align: center; margin: 30px 0;">
                          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; background-color: #1e40af; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: bold;">Schedule a Demo</a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #999999; margin: 0;">© 2025 Kuhlekt. All rights reserved.</p>
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
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background-color: #1e40af; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Your Detailed ROI Analysis</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="color: #1e40af; margin: 0 0 20px;">Hi ${name},</h2>
                        <p style="font-size: 16px; color: #333333; margin: 0 0 30px;">Thank you for using our detailed ROI calculator. Here's your comprehensive analysis:</p>
                        
                        <h3 style="color: #1e40af; margin: 30px 0 15px;">Investment Summary</h3>
                        <table width="100%" cellpadding="10" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 30px;">
                          <tr style="background-color: #f8f9fa;">
                            <td style="font-weight: bold; color: #333;">Implementation Cost</td>
                            <td style="text-align: right;">${formatCurrency(results.implementationCost)}</td>
                          </tr>
                          <tr>
                            <td style="font-weight: bold; color: #333;">Annual Cost</td>
                            <td style="text-align: right;">${formatCurrency(results.annualCost)}</td>
                          </tr>
                          <tr style="background-color: #f8f9fa;">
                            <td style="font-weight: bold; color: #333;">Total First Year Cost</td>
                            <td style="text-align: right; font-weight: bold;">${formatCurrency(results.totalFirstYearCost)}</td>
                          </tr>
                        </table>

                        <h3 style="color: #1e40af; margin: 30px 0 15px;">Annual Benefits</h3>
                        <table width="100%" cellpadding="10" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 30px;">
                          <tr style="background-color: #f8f9fa;">
                            <td style="font-weight: bold; color: #333;">Labour Cost Savings</td>
                            <td style="text-align: right; color: #16a34a;">${formatCurrency(results.labourCostSavings)}</td>
                          </tr>
                          <tr>
                            <td style="font-weight: bold; color: #333;">Interest Savings</td>
                            <td style="text-align: right; color: #16a34a;">${formatCurrency(results.interestSavings)}</td>
                          </tr>
                          <tr style="background-color: #f8f9fa;">
                            <td style="font-weight: bold; color: #333;">Bad Debt Reduction</td>
                            <td style="text-align: right; color: #16a34a;">${formatCurrency(results.badDebtReduction)}</td>
                          </tr>
                          <tr>
                            <td style="font-weight: bold; color: #333;">Working Capital Released</td>
                            <td style="text-align: right; color: #16a34a;">${formatCurrency(results.workingCapitalReleased)}</td>
                          </tr>
                          <tr style="background-color: #f8f9fa;">
                            <td style="font-weight: bold; color: #333; font-size: 16px;">Total Annual Benefit</td>
                            <td style="text-align: right; color: #16a34a; font-weight: bold; font-size: 16px;">${formatCurrency(results.totalAnnualBenefit)}</td>
                          </tr>
                        </table>

                        <h3 style="color: #1e40af; margin: 30px 0 15px;">ROI Metrics</h3>
                        <table width="100%" cellpadding="10" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 30px;">
                          <tr style="background-color: #f8f9fa;">
                            <td style="font-weight: bold; color: #333;">DSO Reduction</td>
                            <td style="text-align: right;">${results.dsoReductionDays.toFixed(1)} days</td>
                          </tr>
                          <tr>
                            <td style="font-weight: bold; color: #333;">New DSO</td>
                            <td style="text-align: right;">${results.newDSODays.toFixed(1)} days</td>
                          </tr>
                          <tr style="background-color: #f8f9fa;">
                            <td style="font-weight: bold; color: #333;">Net Annual Benefit</td>
                            <td style="text-align: right; color: #16a34a; font-weight: bold;">${formatCurrency(results.netAnnualBenefit)}</td>
                          </tr>
                          <tr>
                            <td style="font-weight: bold; color: #333; font-size: 18px;">ROI</td>
                            <td style="text-align: right; color: #16a34a; font-weight: bold; font-size: 18px;">${results.roi.toFixed(1)}%</td>
                          </tr>
                          <tr style="background-color: #f8f9fa;">
                            <td style="font-weight: bold; color: #333;">Payback Period</td>
                            <td style="text-align: right; font-weight: bold;">${results.paybackMonths.toFixed(1)} months</td>
                          </tr>
                        </table>

                        <p style="font-size: 14px; color: #666666; margin: 20px 0;">Ready to achieve these results? Let's discuss how Kuhlekt can transform your accounts receivable process.</p>
                        <div style="text-align: center; margin: 30px 0;">
                          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; background-color: #1e40af; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: bold;">Schedule a Demo</a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #999999; margin: 0;">© 2025 Kuhlekt. All rights reserved.</p>
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
          Data: `Your ${calculatorType === "simple" ? "ROI" : "Detailed ROI"} Calculation Results`,
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

    const command = new SendEmailCommand(emailParams)
    await sesClient.send(command)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
