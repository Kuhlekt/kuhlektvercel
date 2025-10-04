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

    if (!name || !email || !calculatorType || !results) {
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
  <title>Your ROI Results</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Your ROI Results</h1>
              <p style="color: #e0f2fe; margin: 8px 0 0 0; font-size: 14px;">Kuhlekt Invoice-to-Cash Platform</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="color: #111827; margin: 0 0 24px 0; font-size: 16px;">Dear ${name},</p>
              <p style="color: #6b7280; margin: 0 0 32px 0; font-size: 16px; line-height: 1.5;">
                Thank you for using our ROI Calculator. Based on your inputs, here are your estimated savings:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); padding: 32px; text-align: center; border-radius: 8px;">
                    <p style="color: #0891b2; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Estimated Annual Savings</p>
                    <h2 style="color: #0e7490; margin: 0; font-size: 48px; font-weight: 700;">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="padding: 16px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #0891b2;">
                    <p style="color: #6b7280; margin: 0 0 4px 0; font-size: 14px;">Current Cash Tied Up</p>
                    <p style="color: #111827; margin: 0; font-size: 20px; font-weight: 600;">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="padding: 16px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                    <p style="color: #059669; margin: 0 0 4px 0; font-size: 14px;">Cash Released</p>
                    <p style="color: #047857; margin: 0; font-size: 20px; font-weight: 600;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td width="50%" style="padding: 16px; background-color: #fef3c7; border-radius: 8px 0 0 8px; border-left: 4px solid #f59e0b;">
                    <p style="color: #92400e; margin: 0 0 4px 0; font-size: 14px;">Current DSO</p>
                    <p style="color: #78350f; margin: 0; font-size: 20px; font-weight: 600;">${inputs.currentDSO} days</p>
                  </td>
                  <td width="50%" style="padding: 16px; background-color: #dbeafe; border-radius: 0 8px 8px 0; border-left: 4px solid #3b82f6;">
                    <p style="color: #1e40af; margin: 0 0 4px 0; font-size: 14px;">New DSO</p>
                    <p style="color: #1e3a8a; margin: 0; font-size: 20px; font-weight: 600;">${results.newDSO?.toFixed(0)} days</p>
                  </td>
                </tr>
              </table>

              <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px; line-height: 1.5;">
                These results are based on a ${results.dsoImprovement}% DSO improvement and the financial data you provided.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 32px; border-top: 1px solid #e5e7eb;">
              <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Next Steps</h3>
              <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px; line-height: 1.5;">
                Ready to realize these savings? Schedule a demo with our team to see how Kuhlekt can transform your invoice-to-cash process.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #0891b2; border-radius: 6px; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">Schedule a Demo</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; margin: 0 0 8px 0; font-size: 12px;">
                Questions? Contact us at <a href="mailto:info@kuhlekt.com" style="color: #0891b2; text-decoration: none;">info@kuhlekt.com</a>
              </p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
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
  <title>Your Detailed ROI Results</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Your Detailed ROI Results</h1>
              <p style="color: #e0f2fe; margin: 8px 0 0 0; font-size: 14px;">Kuhlekt Invoice-to-Cash Platform</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="color: #111827; margin: 0 0 24px 0; font-size: 16px;">Dear ${name},</p>
              <p style="color: #6b7280; margin: 0 0 32px 0; font-size: 16px; line-height: 1.5;">
                Thank you for completing our detailed ROI analysis. Here's your comprehensive financial breakdown:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); padding: 32px; text-align: center; border-radius: 8px;">
                    <p style="color: #0891b2; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Total Annual Benefit</p>
                    <h2 style="color: #0e7490; margin: 0 0 16px 0; font-size: 48px; font-weight: 700;">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding: 8px; text-align: center;">
                          <p style="color: #0891b2; margin: 0 0 4px 0; font-size: 12px;">ROI</p>
                          <p style="color: #0e7490; margin: 0; font-size: 24px; font-weight: 600;">${results.roi?.toFixed(0)}%</p>
                        </td>
                        <td width="50%" style="padding: 8px; text-align: center; border-left: 1px solid #a5f3fc;">
                          <p style="color: #0891b2; margin: 0 0 4px 0; font-size: 12px;">Payback Period</p>
                          <p style="color: #0e7490; margin: 0; font-size: 24px; font-weight: 600;">${results.paybackMonths?.toFixed(1)} months</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Key Benefits Breakdown</h3>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="padding: 16px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                    <p style="color: #059669; margin: 0 0 4px 0; font-size: 14px;">Working Capital Released</p>
                    <p style="color: #047857; margin: 0; font-size: 20px; font-weight: 600;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    <p style="color: #059669; margin: 8px 0 0 0; font-size: 12px;">From ${results.dsoReductionDays?.toFixed(0)} days DSO improvement</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="padding: 16px; background-color: #ede9fe; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                    <p style="color: #7c3aed; margin: 0 0 4px 0; font-size: 14px;">Interest Savings</p>
                    <p style="color: #6d28d9; margin: 0; font-size: 20px; font-weight: 600;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="padding: 16px; background-color: #dbeafe; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <p style="color: #2563eb; margin: 0 0 4px 0; font-size: 14px;">Labour Cost Savings</p>
                    <p style="color: #1e40af; margin: 0; font-size: 20px; font-weight: 600;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="padding: 16px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <p style="color: #d97706; margin: 0 0 4px 0; font-size: 14px;">Bad Debt Reduction</p>
                    <p style="color: #92400e; margin: 0; font-size: 20px; font-weight: 600;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px; background-color: #f9fafb; border-radius: 8px; padding: 24px;">
                <tr>
                  <td>
                    <h4 style="color: #111827; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Investment Summary</h4>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Implementation Cost</td>
                        <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right;">$${results.implementationCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Annual Software Cost</td>
                        <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right;">$${results.annualCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      </tr>
                      <tr style="border-top: 2px solid #e5e7eb;">
                        <td style="color: #111827; font-size: 14px; font-weight: 600; padding-top: 8px;">Total First Year Cost</td>
                        <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right; padding-top: 8px;">$${results.totalFirstYearCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 32px; border-top: 1px solid #e5e7eb;">
              <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Next Steps</h3>
              <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px; line-height: 1.5;">
                Your analysis shows significant potential for improvement. Let's discuss how we can help you achieve these results.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #0891b2; border-radius: 6px; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">Schedule a Demo</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; margin: 0 0 8px 0; font-size: 12px;">
                Questions? Contact us at <a href="mailto:info@kuhlekt.com" style="color: #0891b2; text-decoration: none;">info@kuhlekt.com</a>
              </p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
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
          Data: `Your Kuhlekt ROI Calculator Results - ${company}`,
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
