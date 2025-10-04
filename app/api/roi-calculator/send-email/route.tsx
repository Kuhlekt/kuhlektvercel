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

    if (!email || !calculatorType || !results) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }

    let htmlContent = ""
    let textContent = ""

    if (calculatorType === "simple") {
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Your ROI Analysis Results</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Dear ${name || "Valued Customer"},</p>
              <p>Thank you for using our ROI Calculator. Here are your personalized results:</p>
              
              <div style="background: white; border-left: 4px solid #06b6d4; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h2 style="color: #0891b2; margin-top: 0; font-size: 24px;">Estimated Annual Savings</h2>
                <p style="font-size: 36px; font-weight: bold; color: #0891b2; margin: 10px 0;">${formatCurrency(results.annualSavings)}</p>
              </div>

              <h3 style="color: #0891b2; margin-top: 30px;">Key Metrics</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Current DSO</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${Math.round(results.currentDSO)} days</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Projected DSO</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981;">${Math.round(results.newDSO)} days</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Cash Currently Tied Up</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(results.currentCashTied)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Cash Released</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981;">${formatCurrency(results.cashReleased)}</td>
                </tr>
              </table>

              <div style="background: #ecfeff; border: 1px solid #06b6d4; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <p style="margin: 0; font-weight: bold; color: #0891b2;">Ready to unlock these savings?</p>
                <p style="margin: 10px 0 0 0;">Contact us today to learn how Kuhlekt can transform your invoice-to-cash process.</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #666; font-size: 12px; margin: 5px 0;">© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              <p style="color: #666; font-size: 12px; margin: 5px 0;">Visit us at <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #06b6d4;">kuhlekt.com</a></p>
            </div>
          </body>
        </html>
      `

      textContent = `Your ROI Analysis Results\n\nDear ${name || "Valued Customer"},\n\nThank you for using our ROI Calculator. Here are your results:\n\nEstimated Annual Savings: ${formatCurrency(results.annualSavings)}\n\nKey Metrics:\n- Current DSO: ${Math.round(results.currentDSO)} days\n- Projected DSO: ${Math.round(results.newDSO)} days\n- Cash Currently Tied Up: ${formatCurrency(results.currentCashTied)}\n- Cash Released: ${formatCurrency(results.cashReleased)}\n\nReady to unlock these savings? Contact us today to learn how Kuhlekt can transform your invoice-to-cash process.\n\nVisit us at ${process.env.NEXT_PUBLIC_SITE_URL}`
    } else {
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Your Detailed ROI Analysis</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Dear ${name || "Valued Customer"},</p>
              <p>Thank you for completing our detailed ROI analysis. Here are your comprehensive results:</p>
              
              <div style="background: white; border-left: 4px solid #06b6d4; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h2 style="color: #0891b2; margin-top: 0; font-size: 24px;">Total Annual Benefit</h2>
                <p style="font-size: 36px; font-weight: bold; color: #0891b2; margin: 10px 0;">${formatCurrency(results.totalAnnualBenefit)}</p>
                <div style="display: flex; gap: 20px; margin-top: 15px;">
                  <div>
                    <span style="color: #666; font-size: 14px;">ROI:</span>
                    <span style="font-size: 24px; font-weight: bold; color: #10b981; margin-left: 5px;">${Math.round(results.roi)}%</span>
                  </div>
                  <div>
                    <span style="color: #666; font-size: 14px;">Payback Period:</span>
                    <span style="font-size: 24px; font-weight: bold; color: #10b981; margin-left: 5px;">${results.paybackMonths.toFixed(1)} months</span>
                  </div>
                </div>
              </div>

              <h3 style="color: #0891b2; margin-top: 30px;">Financial Benefits</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Working Capital Released</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981;">${formatCurrency(results.workingCapitalReleased)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Interest Savings</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981;">${formatCurrency(results.interestSavings)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Labour Cost Savings</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981;">${formatCurrency(results.labourCostSavings)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Bad Debt Reduction</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981;">${formatCurrency(results.badDebtReduction)}</td>
                </tr>
              </table>

              <h3 style="color: #0891b2; margin-top: 30px;">DSO Improvement</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">DSO Reduction</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981;">${Math.round(results.dsoReductionDays)} days</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">New DSO</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981;">${Math.round(results.newDSODays)} days</td>
                </tr>
              </table>

              <h3 style="color: #0891b2; margin-top: 30px;">Investment</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Implementation Cost</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(results.implementationCost)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Annual Cost</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(results.annualCost)}</td>
                </tr>
                <tr style="background: #f9fafb;">
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Total First Year Cost</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">${formatCurrency(results.totalFirstYearCost)}</td>
                </tr>
              </table>

              <div style="background: #ecfeff; border: 1px solid #06b6d4; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <p style="margin: 0; font-weight: bold; color: #0891b2;">Ready to achieve these results?</p>
                <p style="margin: 10px 0 0 0;">Our team is ready to help you transform your accounts receivable process. Contact us today for a personalized consultation.</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #666; font-size: 12px; margin: 5px 0;">© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              <p style="color: #666; font-size: 12px; margin: 5px 0;">Visit us at <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #06b6d4;">kuhlekt.com</a></p>
            </div>
          </body>
        </html>
      `

      textContent = `Your Detailed ROI Analysis\n\nDear ${name || "Valued Customer"},\n\nThank you for completing our detailed ROI analysis. Here are your results:\n\nTotal Annual Benefit: ${formatCurrency(results.totalAnnualBenefit)}\nROI: ${Math.round(results.roi)}%\nPayback Period: ${results.paybackMonths.toFixed(1)} months\n\nFinancial Benefits:\n- Working Capital Released: ${formatCurrency(results.workingCapitalReleased)}\n- Interest Savings: ${formatCurrency(results.interestSavings)}\n- Labour Cost Savings: ${formatCurrency(results.labourCostSavings)}\n- Bad Debt Reduction: ${formatCurrency(results.badDebtReduction)}\n\nDSO Improvement:\n- DSO Reduction: ${Math.round(results.dsoReductionDays)} days\n- New DSO: ${Math.round(results.newDSODays)} days\n\nInvestment:\n- Implementation Cost: ${formatCurrency(results.implementationCost)}\n- Annual Cost: ${formatCurrency(results.annualCost)}\n- Total First Year Cost: ${formatCurrency(results.totalFirstYearCost)}\n\nReady to achieve these results? Contact us today for a personalized consultation.\n\nVisit us at ${process.env.NEXT_PUBLIC_SITE_URL}`
    }

    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: `Your Kuhlekt ROI Analysis Results - ${company || ""}`,
        },
        Body: {
          Html: { Data: htmlContent },
          Text: { Data: textContent },
        },
      },
    }

    await sesClient.send(new SendEmailCommand(emailParams))

    return NextResponse.json({ success: true, message: "ROI results sent successfully" })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
