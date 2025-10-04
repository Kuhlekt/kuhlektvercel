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

    if (!name || !email || !company || !calculatorType || !results) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    let resultsHtml = ""

    if (calculatorType === "simple") {
      resultsHtml = `
        <div style="margin: 30px 0;">
          <h3 style="color: #0891b2; font-size: 20px; margin: 0 0 20px 0;">Simple ROI Results</h3>
          <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
            <tr style="background-color: #f0f9ff;">
              <td style="padding: 15px; border: 1px solid #e0e0e0;"><strong>Current DSO</strong></td>
              <td style="padding: 15px; border: 1px solid #e0e0e0;">${results.currentDSO?.toFixed(0)} days</td>
            </tr>
            <tr>
              <td style="padding: 15px; border: 1px solid #e0e0e0;"><strong>New DSO</strong></td>
              <td style="padding: 15px; border: 1px solid #e0e0e0; color: #0891b2; font-weight: bold;">${results.newDSO?.toFixed(0)} days</td>
            </tr>
            <tr style="background-color: #f0f9ff;">
              <td style="padding: 15px; border: 1px solid #e0e0e0;"><strong>Current Cash Tied Up</strong></td>
              <td style="padding: 15px; border: 1px solid #e0e0e0;">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
            </tr>
            <tr>
              <td style="padding: 15px; border: 1px solid #e0e0e0;"><strong>Cash Released</strong></td>
              <td style="padding: 15px; border: 1px solid #e0e0e0; color: #10b981; font-weight: bold;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
            </tr>
            <tr style="background-color: #dcfce7;">
              <td style="padding: 15px; border: 1px solid #e0e0e0;"><strong>Annual Savings</strong></td>
              <td style="padding: 15px; border: 1px solid #e0e0e0; color: #10b981; font-weight: bold; font-size: 18px;">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
            </tr>
          </table>
        </div>
      `
    } else {
      resultsHtml = `
        <div style="margin: 30px 0;">
          <h3 style="color: #0891b2; font-size: 20px; margin: 0 0 20px 0;">Detailed ROI Results</h3>
          <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
            <tr style="background-color: #dcfce7;">
              <td style="padding: 15px; border: 1px solid #e0e0e0;"><strong>Total Annual Benefit</strong></td>
              <td style="padding: 15px; border: 1px solid #e0e0e0; color: #10b981; font-weight: bold; font-size: 18px;">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
            </tr>
            <tr style="background-color: #f0f9ff;">
              <td style="padding: 15px; border: 1px solid #e0e0e0;"><strong>ROI</strong></td>
              <td style="padding: 15px; border: 1px solid #e0e0e0; color: #0891b2; font-weight: bold;">${results.roi?.toFixed(0)}%</td>
            </tr>
            <tr>
              <td style="padding: 15px; border: 1px solid #e0e0e0;"><strong>Payback Period</strong></td>
              <td style="padding: 15px; border: 1px solid #e0e0e0;">${results.paybackMonths?.toFixed(1)} months</td>
            </tr>
            <tr style="background-color: #f0f9ff;">
              <td style="padding: 15px; border: 1px solid #e0e0e0;"><strong>DSO Reduction</strong></td>
              <td style="padding: 15px; border: 1px solid #e0e0e0;">${results.dsoReductionDays?.toFixed(0)} days</td>
            </tr>
            <tr>
              <td style="padding: 15px; border: 1px solid #e0e0e0;"><strong>Working Capital Released</strong></td>
              <td style="padding: 15px; border: 1px solid #e0e0e0; color: #10b981; font-weight: bold;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
            </tr>
            <tr style="background-color: #f0f9ff;">
              <td style="padding: 15px; border: 1px solid #e0e0e0;"><strong>Interest Savings</strong></td>
              <td style="padding: 15px; border: 1px solid #e0e0e0; color: #10b981; font-weight: bold;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
            </tr>
            <tr>
              <td style="padding: 15px; border: 1px solid #e0e0e0;"><strong>Labour Cost Savings</strong></td>
              <td style="padding: 15px; border: 1px solid #e0e0e0; color: #10b981; font-weight: bold;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
            </tr>
            <tr style="background-color: #f0f9ff;">
              <td style="padding: 15px; border: 1px solid #e0e0e0;"><strong>Bad Debt Reduction</strong></td>
              <td style="padding: 15px; border: 1px solid #e0e0e0; color: #10b981; font-weight: bold;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
            </tr>
          </table>
        </div>
      `
    }

    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Your Kuhlekt ROI Calculator Results",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
                  <tr>
                    <td align="center">
                      <table width="650" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <tr>
                          <td style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Kuhlekt</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 18px;">Your ROI Calculator Results</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 40px;">
                            <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px;">
                              Dear ${name},
                            </p>
                            <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                              Thank you for using the Kuhlekt ROI Calculator. Below are your personalized results based on the information you provided.
                            </p>
                            ${resultsHtml}
                            <div style="margin: 40px 0; padding: 30px; background-color: #f0f9ff; border-left: 4px solid #0891b2; border-radius: 4px;">
                              <h3 style="margin: 0 0 15px 0; color: #0891b2; font-size: 18px;">Next Steps</h3>
                              <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.6;">
                                Ready to see these benefits in action? Schedule a personalized demo with our team to learn how Kuhlekt can transform your accounts receivable process.
                              </p>
                            </div>
                            <div style="text-align: center; margin: 40px 0;">
                              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; background-color: #0891b2; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">Schedule a Demo</a>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="background-color: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px; text-align: center;">
                              Have questions? Contact us at <a href="mailto:info@kuhlekt.com" style="color: #0891b2; text-decoration: none;">info@kuhlekt.com</a>
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
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

    return NextResponse.json({
      success: true,
      message: "ROI results sent successfully",
    })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
