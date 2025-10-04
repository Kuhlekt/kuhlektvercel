import { type NextRequest, NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, calculatorType, results, inputs } = body

    if (!email || !name || !company || !calculatorType || !results) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Format results based on calculator type
    let resultsHtml = ""

    if (calculatorType === "simple") {
      resultsHtml = `
        <div style="background: white; padding: 30px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #0891b2; margin-bottom: 20px;">Your ROI Analysis Results</h2>
          
          <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">Estimated Annual Savings</p>
            <p style="color: white; font-size: 48px; font-weight: bold; margin: 0;">
              $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">Current Cash Tied Up</p>
              <p style="color: #333; font-size: 24px; font-weight: bold; margin: 0;">
                $${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">Cash Released</p>
              <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 0;">
                $${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">Current DSO</p>
              <p style="color: #333; font-size: 24px; font-weight: bold; margin: 0;">
                ${inputs.currentDSO} days
              </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">New DSO</p>
              <p style="color: #0891b2; font-size: 24px; font-weight: bold; margin: 0;">
                ${results.newDSO?.toFixed(0)} days
              </p>
            </div>
          </div>
        </div>
      `
    } else {
      resultsHtml = `
        <div style="background: white; padding: 30px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #0891b2; margin-bottom: 20px;">Your Detailed ROI Analysis</h2>
          
          <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">Total Annual Benefit</p>
            <p style="color: white; font-size: 48px; font-weight: bold; margin: 0;">
              $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p style="color: white; font-size: 14px; margin: 10px 0 0 0;">
              ROI: ${results.roi?.toFixed(0)}% • Payback: ${results.paybackMonths?.toFixed(1)} months
            </p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;">DSO Improvement</p>
              <p style="color: #333; font-size: 20px; font-weight: bold; margin: 0;">
                ${results.dsoReductionDays?.toFixed(0)} days
              </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;">Working Capital Released</p>
              <p style="color: #10b981; font-size: 20px; font-weight: bold; margin: 0;">
                $${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;">Interest Savings</p>
              <p style="color: #10b981; font-size: 20px; font-weight: bold; margin: 0;">
                $${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;">Labour Savings</p>
              <p style="color: #10b981; font-size: 20px; font-weight: bold; margin: 0;">
                $${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;">Bad Debt Reduction</p>
              <p style="color: #10b981; font-size: 20px; font-weight: bold; margin: 0;">
                $${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;">ROI</p>
              <p style="color: #0891b2; font-size: 20px; font-weight: bold; margin: 0;">
                ${results.roi?.toFixed(0)}%
              </p>
            </div>
          </div>
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
          Data: `Your Kuhlekt ROI Calculator Results - ${company}`,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                </head>
                <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                  <div style="background: white; border-radius: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 32px;">Kuhlekt ROI Calculator</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
                        Your Personalized ROI Analysis
                      </p>
                    </div>

                    <div style="padding: 40px;">
                      <p style="font-size: 18px; color: #333; margin-bottom: 10px;">
                        Dear ${name},
                      </p>
                      <p style="font-size: 16px; color: #666; line-height: 1.6;">
                        Thank you for using the Kuhlekt ROI Calculator. Below are your personalized results based on the information you provided for <strong>${company}</strong>.
                      </p>

                      ${resultsHtml}

                      <div style="background: #f0f9ff; border-left: 4px solid #0891b2; padding: 20px; margin: 30px 0; border-radius: 5px;">
                        <h3 style="color: #0891b2; margin: 0 0 10px 0;">Next Steps</h3>
                        <p style="color: #666; margin: 0; line-height: 1.6;">
                          Want to learn more about how Kuhlekt can help you achieve these results? 
                          Our team is ready to discuss your specific needs and show you how our platform can transform your accounts receivable process.
                        </p>
                      </div>

                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" 
                           style="display: inline-block; background: #0891b2; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                          Schedule a Demo
                        </a>
                      </div>
                    </div>

                    <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
                        Questions? Contact us at <a href="mailto:info@kuhlekt.com" style="color: #0891b2;">info@kuhlekt.com</a>
                      </p>
                      <p style="color: #999; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
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

    await sesClient.send(new SendEmailCommand(emailParams))

    return NextResponse.json({ success: true, message: "ROI results sent successfully" })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
