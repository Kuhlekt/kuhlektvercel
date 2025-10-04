"use server"

import { createClient } from "@/lib/supabase/server"

// ROI Calculation Types
interface SimpleROIInput {
  annualRevenue: number
  averageInvoiceValue: number
  averageDSO: number
}

interface DetailedROIInput extends SimpleROIInput {
  numberOfInvoices: number
  badDebtPercentage: number
  collectionCosts: number
  numberOfStaff: number
  averageSalary: number
}

interface SimpleROIResult {
  potentialSavings: number
  timeReduction: number
  dsoImprovement: number
}

interface DetailedROIResult extends SimpleROIResult {
  badDebtReduction: number
  costReduction: number
  staffProductivityGain: number
  totalAnnualBenefit: number
  roi: number
  paybackPeriod: number
}

// Calculate Simple ROI
export async function calculateSimpleROI(input: SimpleROIInput): Promise<SimpleROIResult> {
  const dsoImprovement = Math.round(input.averageDSO * 0.3) // 30% improvement
  const timeReduction = 40 // 40% time reduction
  const potentialSavings = Math.round(input.annualRevenue * (dsoImprovement / 365) * 0.05)

  return {
    potentialSavings,
    timeReduction,
    dsoImprovement,
  }
}

// Calculate Detailed ROI
export async function calculateDetailedROI(input: DetailedROIInput): Promise<DetailedROIResult> {
  const simpleROI = await calculateSimpleROI(input)

  const badDebtReduction = Math.round(input.annualRevenue * (input.badDebtPercentage / 100) * 0.5)
  const costReduction = Math.round(input.collectionCosts * 0.6)
  const staffProductivityGain = Math.round(input.numberOfStaff * input.averageSalary * 0.25)

  const totalAnnualBenefit = simpleROI.potentialSavings + badDebtReduction + costReduction + staffProductivityGain
  const assumedCost = 50000 // Assumed annual cost of the solution
  const roi = Math.round(((totalAnnualBenefit - assumedCost) / assumedCost) * 100)
  const paybackPeriod = Math.round((assumedCost / totalAnnualBenefit) * 12 * 10) / 10

  return {
    ...simpleROI,
    badDebtReduction,
    costReduction,
    staffProductivityGain,
    totalAnnualBenefit,
    roi,
    paybackPeriod,
  }
}

// Helper function to send email via ClickSend
async function sendClickSendEmail(to: string, subject: string, htmlBody: string): Promise<boolean> {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "support@kuhlekt.com"

  if (!username || !apiKey) {
    console.error("ClickSend credentials not configured")
    return false
  }

  const authToken = Buffer.from(`${username}:${apiKey}`).toString("base64")

  const payload = {
    to: [
      {
        email: to,
        name: to.split("@")[0],
      },
    ],
    from: {
      email_address: fromEmail,
      name: "Kuhlekt",
    },
    subject: subject,
    body: htmlBody,
  }

  console.log("Sending email via ClickSend:", {
    to,
    subject,
    from: fromEmail,
  })

  try {
    const response = await fetch("https://rest.clicksend.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`,
      },
      body: JSON.stringify(payload),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error("ClickSend API error:", {
        status: response.status,
        body: responseData,
      })
      return false
    }

    console.log("Email sent successfully via ClickSend:", responseData)
    return true
  } catch (error) {
    console.error("Error sending email via ClickSend:", error)
    return false
  }
}

// Generate and send verification code
export async function generateVerificationCode(
  email: string,
): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    const supabase = await createClient()

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store in database
    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return { success: false, error: "Failed to generate code" }
    }

    // Send email
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
            .code { font-size: 32px; font-weight: bold; color: #0066cc; text-align: center; padding: 20px; background-color: white; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Verification Code</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for requesting your ROI calculation. Please use the verification code below to proceed:</p>
              <div class="code">${code}</div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailSent = await sendClickSendEmail(email, "Your Kuhlekt Verification Code", htmlBody)

    if (!emailSent) {
      console.log("Email failed to send, but returning code for testing:", code)
    }

    return { success: true, code }
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Verify code
export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !data) {
      return { success: false, error: "Invalid or expired code" }
    }

    // Mark as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Send ROI results via email
export async function sendROIEmail(
  email: string,
  results: SimpleROIResult | DetailedROIResult,
  isDetailed: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const htmlBody = isDetailed
      ? `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
              .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
              .metric { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
              .metric-label { font-size: 14px; color: #666; }
              .metric-value { font-size: 24px; font-weight: bold; color: #0066cc; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Your Detailed ROI Analysis</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>Thank you for using the Kuhlekt ROI Calculator. Here are your personalized results:</p>
                
                <div class="metric">
                  <div class="metric-label">Potential Annual Savings</div>
                  <div class="metric-value">$${results.potentialSavings.toLocaleString()}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">DSO Improvement</div>
                  <div class="metric-value">${results.dsoImprovement} days</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Time Reduction</div>
                  <div class="metric-value">${results.timeReduction}%</div>
                </div>
                
                ${
                  isDetailed
                    ? `
                <div class="metric">
                  <div class="metric-label">Bad Debt Reduction</div>
                  <div class="metric-value">$${(results as DetailedROIResult).badDebtReduction.toLocaleString()}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Cost Reduction</div>
                  <div class="metric-value">$${(results as DetailedROIResult).costReduction.toLocaleString()}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Staff Productivity Gain</div>
                  <div class="metric-value">$${(results as DetailedROIResult).staffProductivityGain.toLocaleString()}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Total Annual Benefit</div>
                  <div class="metric-value">$${(results as DetailedROIResult).totalAnnualBenefit.toLocaleString()}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Return on Investment</div>
                  <div class="metric-value">${(results as DetailedROIResult).roi}%</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Payback Period</div>
                  <div class="metric-value">${(results as DetailedROIResult).paybackPeriod} months</div>
                </div>
                `
                    : ""
                }
                
                <p style="margin-top: 30px;">Ready to see these results in action? <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo">Schedule a demo</a> to learn more about how Kuhlekt can transform your accounts receivable process.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
      : `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
              .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
              .metric { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
              .metric-label { font-size: 14px; color: #666; }
              .metric-value { font-size: 24px; font-weight: bold; color: #0066cc; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Your ROI Analysis</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
                
                <div class="metric">
                  <div class="metric-label">Potential Annual Savings</div>
                  <div class="metric-value">$${results.potentialSavings.toLocaleString()}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">DSO Improvement</div>
                  <div class="metric-value">${results.dsoImprovement} days</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Time Reduction</div>
                  <div class="metric-value">${results.timeReduction}%</div>
                </div>
                
                <p style="margin-top: 30px;">Want a more detailed analysis? <a href="${process.env.NEXT_PUBLIC_SITE_URL}">Return to the calculator</a> to enter more information.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `

    const emailSent = await sendClickSendEmail(email, "Your Kuhlekt ROI Analysis Results", htmlBody)

    if (!emailSent) {
      return { success: false, error: "Failed to send email" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
