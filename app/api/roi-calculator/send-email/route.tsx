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

function generateSimpleResultsHTML(results: any, inputs: any): string {
  return `
    <div style="background: white; border-radius: 8px; padding: 30px; margin: 20px 0;">
      <h2 style="color: #0891b2; margin-top: 0;">Your ROI Calculation Results</h2>
      
      <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); border-radius: 8px; padding: 30px; text-align: center; margin: 20px 0;">
        <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-bottom: 10px;">Estimated Annual Savings</div>
        <div style="color: white; font-size: 48px; font-weight: bold;">${formatCurrency(results.annualSavings)}</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 14px;">Current DSO</div>
            <div style="font-size: 24px; font-weight: bold; color: #111827;">${Math.round(results.currentDSO)} days</div>
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 14px;">New DSO</div>
            <div style="font-size: 24px; font-weight: bold; color: #0891b2;">${Math.round(results.newDSO)} days</div>
          </td>
        </tr>
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 14px;">Current Cash Tied Up</div>
            <div style="font-size: 24px; font-weight: bold; color: #111827;">${formatCurrency(results.currentCashTied)}</div>
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 14px;">Cash Released</div>
            <div style="font-size: 24px; font-weight: bold; color: #10b981;">${formatCurrency(results.cashReleased)}</div>
          </td>
        </tr>
      </table>
    </div>
  `
}

function generateDetailedResultsHTML(results: any, inputs: any): string {
  return `
    <div style="background: white; border-radius: 8px; padding: 30px; margin: 20px 0;">
      <h2 style="color: #0891b2; margin-top: 0;">Your Comprehensive ROI Analysis</h2>
      
      <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); border-radius: 8px; padding: 30px; text-align: center; margin: 20px 0;">
        <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-bottom: 10px;">Total Annual Benefit</div>
        <div style="color: white; font-size: 48px; font-weight: bold;">${formatCurrency(results.totalAnnualBenefit)}</div>
        <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 15px;">
          ROI: <strong>${Math.round(results.roi)}%</strong> • Payback: <strong>${results.paybackMonths.toFixed(1)} months</strong>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 14px;">DSO Improvement</div>
            <div style="font-size: 24px; font-weight: bold; color: #111827;">${Math.round(results.dsoReductionDays)} days</div>
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 14px;">Working Capital Released</div>
            <div style="font-size: 24px; font-weight: bold; color: #10b981;">${formatCurrency(results.workingCapitalReleased)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 14px;">Interest Savings</div>
            <div style="font-size: 24px; font-weight: bold; color: #10b981;">${formatCurrency(results.interestSavings)}</div>
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 14px;">Labour Savings</div>
            <div style="font-size: 24px; font-weight: bold; color: #10b981;">${formatCurrency(results.labourCostSavings)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 14px;">Bad Debt Reduction</div>
            <div style="font-size: 24px; font-weight: bold; color: #10b981;">${formatCurrency(results.badDebtReduction)}</div>
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 14px;">ROI</div>
            <div style="font-size: 24px; font-weight: bold; color: #0891b2;">${Math.round(results.roi)}%</div>
          </td>
        </tr>
      </table>
    </div>
  `
}

export async function POST(request: Request) {
  try {
    const { name, email, company, calculatorType, results, inputs } = await request.json()

    if (!email || !name || !company || !calculatorType || !results) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const resultsHTML =
      calculatorType === "simple"
        ? generateSimpleResultsHTML(results, inputs)
        : generateDetailedResultsHTML(results, inputs)

    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL!,
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
            Data: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f3f4f6; margin: 0; padding: 0;">
                  <div style="max-width: 600px; margin: 0 auto; background: white;">
                    <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 32px;">Kuhlekt</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Invoice-to-Cash Automation</p>
                    </div>
                    
                    <div style="padding: 40px 30px;">
                      <h2 style="color: #111827; margin-top: 0;">Hello ${name},</h2>
                      <p style="font-size: 16px; color: #4b5563;">Thank you for using our ROI Calculator. Here are your personalized results based on ${company}'s data:</p>
                      
                      ${resultsHTML}
                      
                      <div style="background: #f9fafb; border-left: 4px solid #0891b2; padding: 20px; margin: 30px 0; border-radius: 4px;">
                        <h3 style="color: #0891b2; margin-top: 0; font-size: 18px;">Ready to transform your accounts receivable?</h3>
                        <p style="color: #4b5563; margin-bottom: 15px;">Our team would love to show you how Kuhlekt can help ${company} achieve these results.</p>
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; background: #0891b2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Schedule a Demo</a>
                      </div>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px;">
                      <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
                      <p style="margin: 0;">
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #0891b2; text-decoration: none;">Visit Website</a> •
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact" style="color: #0891b2; text-decoration: none;">Contact Us</a>
                      </p>
                    </div>
                  </div>
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
