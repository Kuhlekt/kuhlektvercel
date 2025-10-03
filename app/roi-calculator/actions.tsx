"use server"

import { sendEmail } from "@/lib/aws-ses"

interface ROICalculatorData {
  companyName: string
  email: string
  currentDSO: number
  annualRevenue: number
  averageInvoiceValue: number
  numberOfCustomers: number
}

interface ROIResults {
  currentDSO: number
  projectedDSO: number
  dsoReduction: number
  annualSavings: number
  timesSaved: number
  additionalCashFlow: number
  roi: number
  paybackPeriod: number
}

// Store verification codes temporarily (in production, use Redis or database)
const verificationCodes = new Map<string, { code: string; timestamp: number; data: ROICalculatorData }>()

// Clean up old codes (older than 15 minutes)
function cleanupOldCodes() {
  const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000
  for (const [email, data] of verificationCodes.entries()) {
    if (data.timestamp < fifteenMinutesAgo) {
      verificationCodes.delete(email)
    }
  }
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function calculateROI(data: ROICalculatorData): ROIResults {
  const { currentDSO, annualRevenue, averageInvoiceValue, numberOfCustomers } = data

  // Calculate projected improvements
  const dsoReduction = Math.round(currentDSO * 0.3) // 30% reduction
  const projectedDSO = currentDSO - dsoReduction

  // Calculate financial impact
  const dailyRevenue = annualRevenue / 365
  const additionalCashFlow = dailyRevenue * dsoReduction

  // Calculate time savings (assuming 2 hours per week per customer reduced to 0.4 hours)
  const currentHoursPerYear = numberOfCustomers * 2 * 52
  const projectedHoursPerYear = numberOfCustomers * 0.4 * 52
  const hoursSaved = currentHoursPerYear - projectedHoursPerYear
  const timesSaved = Math.round((hoursSaved / currentHoursPerYear) * 100)

  // Calculate annual savings (labor cost + improved cash flow)
  const laborCostPerHour = 50 // Average cost per hour
  const laborSavings = hoursSaved * laborCostPerHour
  const annualSavings = laborSavings + additionalCashFlow * 0.05 // 5% opportunity cost

  // Calculate ROI (assuming annual cost of $50k)
  const annualCost = 50000
  const roi = Math.round(((annualSavings - annualCost) / annualCost) * 100)
  const paybackPeriod = annualCost / (annualSavings / 12) // in months

  return {
    currentDSO,
    projectedDSO,
    dsoReduction,
    annualSavings: Math.round(annualSavings),
    timesSaved,
    additionalCashFlow: Math.round(additionalCashFlow),
    roi,
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
  }
}

export async function sendVerificationCode(data: ROICalculatorData): Promise<{ success: boolean; error?: string }> {
  try {
    cleanupOldCodes()

    const code = generateVerificationCode()
    const email = data.email.toLowerCase().trim()

    // Store the code and data
    verificationCodes.set(email, {
      code,
      timestamp: Date.now(),
      data,
    })

    // Send verification email
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #0891b2 0%, #2563eb 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .code-box {
              background: white;
              border: 2px solid #0891b2;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            }
            .code {
              font-size: 32px;
              font-weight: bold;
              color: #0891b2;
              letter-spacing: 5px;
            }
            .button {
              display: inline-block;
              background: #0891b2;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Calculator Verification Code</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for your interest in Kuhlekt! To view your personalized ROI analysis, please use the verification code below:</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              
              <p><strong>This code will expire in 15 minutes.</strong></p>
              
              <p>Simply enter this code in the ROI Calculator to see your customized results showing how Kuhlekt can:</p>
              <ul>
                <li>Reduce your Days Sales Outstanding (DSO) by up to 40%</li>
                <li>Automate 85% of manual collection tasks</li>
                <li>Improve cash flow predictability</li>
                <li>Save your team valuable time</li>
              </ul>
              
              <p>If you didn't request this code, you can safely ignore this email.</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
                <p>Need help? Contact us at support@kuhlekt.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      htmlBody,
    })

    console.log(`Verification code sent to ${email}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending verification code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send verification code",
    }
  }
}

export async function verifyCodeAndCalculateROI(
  email: string,
  code: string,
): Promise<{ success: boolean; results?: ROIResults; error?: string }> {
  try {
    cleanupOldCodes()

    const normalizedEmail = email.toLowerCase().trim()
    const normalizedCode = code.trim()

    const stored = verificationCodes.get(normalizedEmail)

    if (!stored) {
      return {
        success: false,
        error: "Verification code not found or expired. Please request a new code.",
      }
    }

    if (stored.code !== normalizedCode) {
      return {
        success: false,
        error: "Invalid verification code. Please check and try again.",
      }
    }

    // Calculate ROI
    const results = calculateROI(stored.data)

    // Send results email
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #0891b2 0%, #2563eb 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
            }
            .metric {
              background: white;
              border-left: 4px solid #0891b2;
              padding: 15px;
              margin: 15px 0;
              border-radius: 5px;
            }
            .metric-value {
              font-size: 28px;
              font-weight: bold;
              color: #0891b2;
            }
            .metric-label {
              color: #6b7280;
              font-size: 14px;
            }
            .highlight {
              background: #dcfce7;
              border-left: 4px solid #16a34a;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .button {
              display: inline-block;
              background: #0891b2;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Kuhlekt ROI Analysis</h1>
              <p>${stored.data.companyName}</p>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for using our ROI Calculator. Based on the information you provided, here's what Kuhlekt can do for your business:</p>
              
              <div class="highlight">
                <h3 style="margin-top: 0;">💰 Estimated Annual Savings: $${results.annualSavings.toLocaleString()}</h3>
                <p style="margin-bottom: 0;">Return on Investment: ${results.roi}% | Payback Period: ${results.paybackPeriod} months</p>
              </div>

              <h3>Key Improvements:</h3>
              
              <div class="metric">
                <div class="metric-value">${results.dsoReduction} days</div>
                <div class="metric-label">DSO Reduction (from ${results.currentDSO} to ${results.projectedDSO} days)</div>
              </div>

              <div class="metric">
                <div class="metric-value">$${results.additionalCashFlow.toLocaleString()}</div>
                <div class="metric-label">Additional Cash Flow Released</div>
              </div>

              <div class="metric">
                <div class="metric-value">${results.timesSaved}%</div>
                <div class="metric-label">Time Saved on Manual Collection Tasks</div>
              </div>

              <h3>What's Next?</h3>
              <p>See how Kuhlekt can transform your accounts receivable process:</p>
              <ul>
                <li>Schedule a personalized demo with our team</li>
                <li>Explore our platform features in detail</li>
                <li>Get a customized implementation plan</li>
                <li>Start your 14-day free trial</li>
              </ul>

              <center>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" class="button">Schedule Your Demo</a>
              </center>

              <p>Have questions? Our team is here to help you understand exactly how Kuhlekt can benefit your business.</p>
              
              <div class="footer">
                <p><strong>Kuhlekt</strong> - AI-Powered Accounts Receivable Automation</p>
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
                <p>Questions? Email us at sales@kuhlekt.com or call (555) 123-4567</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail({
      to: normalizedEmail,
      subject: `Your Kuhlekt ROI Analysis - ${stored.data.companyName}`,
      htmlBody,
    })

    // Clean up the used code
    verificationCodes.delete(normalizedEmail)

    console.log(`ROI results sent to ${normalizedEmail}`)
    return { success: true, results }
  } catch (error) {
    console.error("Error verifying code and calculating ROI:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process your request",
    }
  }
}
