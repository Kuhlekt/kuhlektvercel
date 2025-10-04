import { NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const ses = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
}

export async function POST(request: Request) {
  try {
    const { name, email, company, calculatorType, results, inputs } = await request.json()

    if (!name || !email || !company || !calculatorType || !results) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    let htmlContent = ""

    if (calculatorType === "simple") {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .results { background: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .result-item { padding: 10px 0; border-bottom: 1px solid #ddd; }
            .result-item:last-child { border-bottom: none; }
            .label { font-weight: bold; }
            .value { float: right; color: #2563eb; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Calculator Results</h1>
            </div>
            <p>Dear ${name},</p>
            <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
            
            <div class="results">
              <h3>Simple ROI Analysis for ${company}</h3>
              <div class="result-item">
                <span class="label">Current DSO:</span>
                <span class="value">${results.currentDSO.toFixed(1)} days</span>
              </div>
              <div class="result-item">
                <span class="label">New DSO:</span>
                <span class="value">${results.newDSO.toFixed(1)} days</span>
              </div>
              <div class="result-item">
                <span class="label">DSO Improvement:</span>
                <span class="value">${results.dsoImprovement.toFixed(1)}%</span>
              </div>
              <div class="result-item">
                <span class="label">Current Cash Tied:</span>
                <span class="value">${formatCurrency(results.currentCashTied)}</span>
              </div>
              <div class="result-item">
                <span class="label">Cash Released:</span>
                <span class="value">${formatCurrency(results.cashReleased)}</span>
              </div>
              <div class="result-item">
                <span class="label">Annual Savings:</span>
                <span class="value">${formatCurrency(results.annualSavings)}</span>
              </div>
            </div>

            <p>These results demonstrate the potential financial impact of implementing Kuhlekt's AR automation solution.</p>
            <p>Would you like to learn more about how Kuhlekt can help your business? Our team is ready to discuss a customized solution for ${company}.</p>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Schedule a Demo</a></p>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `
    } else {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .results { background: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .result-item { padding: 10px 0; border-bottom: 1px solid #ddd; }
            .result-item:last-child { border-bottom: none; }
            .label { font-weight: bold; }
            .value { float: right; color: #2563eb; }
            .highlight { background: #2563eb; color: white; padding: 15px; text-align: center; font-size: 18px; margin: 20px 0; border-radius: 5px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Detailed ROI Analysis</h1>
            </div>
            <p>Dear ${name},</p>
            <p>Thank you for completing the detailed ROI analysis. Here's your comprehensive report for ${company}:</p>
            
            <div class="highlight">
              <strong>Estimated ROI: ${results.roi.toFixed(1)}%</strong><br>
              Payback Period: ${results.paybackMonths.toFixed(1)} months
            </div>

            <div class="results">
              <h3>Investment Summary</h3>
              <div class="result-item">
                <span class="label">Implementation Cost:</span>
                <span class="value">${formatCurrency(results.implementationCost)}</span>
              </div>
              <div class="result-item">
                <span class="label">Annual Subscription Cost:</span>
                <span class="value">${formatCurrency(results.annualCost)}</span>
              </div>
              <div class="result-item">
                <span class="label">Total First Year Cost:</span>
                <span class="value">${formatCurrency(results.totalFirstYearCost)}</span>
              </div>
            </div>

            <div class="results">
              <h3>Expected Benefits</h3>
              <div class="result-item">
                <span class="label">Labour Cost Savings:</span>
                <span class="value">${formatCurrency(results.labourCostSavings)}</span>
              </div>
              <div class="result-item">
                <span class="label">DSO Reduction:</span>
                <span class="value">${results.dsoReductionDays.toFixed(1)} days (to ${results.newDSODays.toFixed(1)} days)</span>
              </div>
              <div class="result-item">
                <span class="label">Working Capital Released:</span>
                <span class="value">${formatCurrency(results.workingCapitalReleased)}</span>
              </div>
              <div class="result-item">
                <span class="label">Interest Savings:</span>
                <span class="value">${formatCurrency(results.interestSavings)}</span>
              </div>
              <div class="result-item">
                <span class="label">Bad Debt Reduction:</span>
                <span class="value">${formatCurrency(results.badDebtReduction)}</span>
              </div>
              <div class="result-item">
                <span class="label">Total Annual Benefit:</span>
                <span class="value">${formatCurrency(results.totalAnnualBenefit)}</span>
              </div>
              <div class="result-item">
                <span class="label">Net Annual Benefit:</span>
                <span class="value">${formatCurrency(results.netAnnualBenefit)}</span>
              </div>
            </div>

            <p>These results show the significant value Kuhlekt can deliver to ${company}. Our AR automation solution can transform your accounts receivable process and deliver measurable financial benefits.</p>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Schedule a Personalized Demo</a></p>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: `Your ROI Calculator Results - ${company}` },
        Body: { Html: { Data: htmlContent } },
      },
    }

    await ses.send(new SendEmailCommand(emailParams))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in send ROI email route:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
