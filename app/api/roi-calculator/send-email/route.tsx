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
    maximumFractionDigits: 0,
  }).format(value)
}

function generateSimpleEmailHTML(data: any): string {
  const { name, company, results, inputs } = data

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Kuhlekt</h1>
          <p style="color: #e0f2fe; margin: 10px 0 0 0;">Your ROI Calculator Results</p>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="font-size: 16px; color: #4b5563;">
            Hi ${name},
          </p>
          
          <p style="font-size: 16px; color: #4b5563;">
            Thank you for using the Kuhlekt ROI Calculator. Here are your results for ${company}:
          </p>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0891b2; padding: 20px; margin: 30px 0;">
            <h2 style="color: #0891b2; margin-top: 0; font-size: 24px;">Estimated Annual Savings</h2>
            <div style="font-size: 42px; font-weight: bold; color: #0891b2;">
              ${formatCurrency(results.annualSavings)}
            </div>
          </div>
          
          <h3 style="color: #0891b2; margin-top: 30px;">Key Metrics</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Current DSO</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${inputs.currentDSO} days</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">New DSO</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #0891b2;">${results.newDSO.toFixed(0)} days</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Current Cash Tied Up</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(results.currentCashTied)}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Cash Released</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981; font-weight: 600;">${formatCurrency(results.cashReleased)}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: 600;">DSO Improvement</td>
              <td style="padding: 12px; text-align: right;">${results.dsoImprovement.toFixed(0)}%</td>
            </tr>
          </table>
          
          <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <h3 style="color: #d97706; margin-top: 0;">Next Steps</h3>
            <p style="margin: 0; color: #78350f;">
              Ready to unlock these savings? Contact our team to schedule a demo and see how Kuhlekt can transform your accounts receivable process.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="background: #0891b2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              Schedule a Demo
            </a>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="font-size: 12px; color: #6b7280; margin: 0;">
            © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
          </p>
          <p style="font-size: 12px; color: #6b7280; margin: 10px 0 0 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #0891b2; text-decoration: none;">Visit our website</a>
          </p>
        </div>
      </body>
    </html>
  `
}

function generateDetailedEmailHTML(data: any): string {
  const { name, company, results, inputs } = data

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Kuhlekt</h1>
          <p style="color: #e0f2fe; margin: 10px 0 0 0;">Your Comprehensive ROI Analysis</p>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="font-size: 16px; color: #4b5563;">
            Hi ${name},
          </p>
          
          <p style="font-size: 16px; color: #4b5563;">
            Thank you for completing the detailed ROI analysis. Here's your comprehensive report for ${company}:
          </p>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0891b2; padding: 20px; margin: 30px 0;">
            <h2 style="color: #0891b2; margin-top: 0; font-size: 24px;">Total Annual Benefit</h2>
            <div style="font-size: 42px; font-weight: bold; color: #0891b2;">
              ${formatCurrency(results.totalAnnualBenefit)}
            </div>
            <div style="display: flex; gap: 20px; margin-top: 15px; font-size: 14px; color: #4b5563;">
              <span>ROI: <strong>${results.roi.toFixed(0)}%</strong></span>
              <span>•</span>
              <span>Payback: <strong>${results.paybackMonths.toFixed(1)} months</strong></span>
            </div>
          </div>
          
          <h3 style="color: #0891b2; margin-top: 30px;">Financial Impact</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">DSO Reduction</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${results.dsoReductionDays.toFixed(0)} days</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Working Capital Released</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981; font-weight: 600;">${formatCurrency(results.workingCapitalReleased)}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Interest Savings</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981;">${formatCurrency(results.interestSavings)}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Labour Cost Savings</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981;">${formatCurrency(results.labourCostSavings)}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Bad Debt Reduction</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981;">${formatCurrency(results.badDebtReduction)}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 12px; font-weight: 600;">Total Annual Benefit</td>
              <td style="padding: 12px; text-align: right; font-weight: 600; color: #0891b2;">${formatCurrency(results.totalAnnualBenefit)}</td>
            </tr>
          </table>
          
          <h3 style="color: #0891b2; margin-top: 30px;">Investment Summary</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">Implementation Cost</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(results.implementationCost)}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">Annual Subscription</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(results.annualCost)}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">Net Annual Benefit</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981; font-weight: 600;">${formatCurrency(results.netAnnualBenefit)}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: 600;">Return on Investment</td>
              <td style="padding: 12px; text-align: right; font-weight: 600; color: #0891b2;">${results.roi.toFixed(0)}%</td>
            </tr>
          </table>
          
          <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <h3 style="color: #d97706; margin-top: 0;">What This Means for Your Business</h3>
            <p style="margin: 0; color: #78350f;">
              With a ${results.paybackMonths.toFixed(1)}-month payback period and ${results.roi.toFixed(0)}% ROI, Kuhlekt can deliver significant financial benefits while streamlining your accounts receivable operations.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="background: #0891b2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              Schedule Your Demo Today
            </a>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="font-size: 12px; color: #6b7280; margin: 0;">
            © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
          </p>
          <p style="font-size: 12px; color: #6b7280; margin: 10px 0 0 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #0891b2; text-decoration: none;">Visit our website</a>
          </p>
        </div>
      </body>
    </html>
  `
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, email, company, calculatorType, results, inputs } = data

    if (!name || !email || !company || !calculatorType || !results || !inputs) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const htmlContent = calculatorType === "simple" ? generateSimpleEmailHTML(data) : generateDetailedEmailHTML(data)

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
          Text: {
            Data: `Hi ${name},\n\nThank you for using the Kuhlekt ROI Calculator. Your results for ${company} are ready.\n\nPlease view your results in the calculator or visit ${process.env.NEXT_PUBLIC_SITE_URL} to learn more.\n\nBest regards,\nThe Kuhlekt Team`,
          },
        },
      },
    }

    await sesClient.send(new SendEmailCommand(emailParams))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
