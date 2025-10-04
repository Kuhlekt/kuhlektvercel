"use server"

import { createClient } from "@/lib/supabase/server"

// Types
interface SimpleROIInput {
  currentDSO: number
  targetDSO: number
  annualRevenue: number
}

interface DetailedROIInput extends SimpleROIInput {
  currentCollectionRate: number
  targetCollectionRate: number
  currentBadDebtRate: number
  targetBadDebtRate: number
  numberOfInvoices: number
  averageInvoiceValue: number
  collectionStaffCost: number
  currentSystemCost: number
}

interface SimpleROIResult {
  cashFlowImprovement: number
  annualSavings: number
  roi: number
  paybackPeriod: number
}

interface DetailedROIResult extends SimpleROIResult {
  improvedCollectionAmount: number
  reducedBadDebt: number
  timeEfficiencySavings: number
  totalAnnualBenefit: number
}

// Calculate Simple ROI
export async function calculateSimpleROI(input: SimpleROIInput): Promise<SimpleROIResult> {
  const { currentDSO, targetDSO, annualRevenue } = input

  const dsoImprovement = currentDSO - targetDSO
  const dailyRevenue = annualRevenue / 365
  const cashFlowImprovement = dsoImprovement * dailyRevenue

  const estimatedSoftwareCost = annualRevenue * 0.001 // 0.1% of revenue
  const roi = (cashFlowImprovement / estimatedSoftwareCost) * 100
  const paybackPeriod = estimatedSoftwareCost / (cashFlowImprovement / 12)

  return {
    cashFlowImprovement,
    annualSavings: cashFlowImprovement,
    roi,
    paybackPeriod,
  }
}

// Calculate Detailed ROI
export async function calculateDetailedROI(input: DetailedROIInput): Promise<DetailedROIResult> {
  const {
    currentDSO,
    targetDSO,
    annualRevenue,
    currentCollectionRate,
    targetCollectionRate,
    currentBadDebtRate,
    targetBadDebtRate,
    numberOfInvoices,
    averageInvoiceValue,
    collectionStaffCost,
    currentSystemCost,
  } = input

  // DSO improvement
  const dsoImprovement = currentDSO - targetDSO
  const dailyRevenue = annualRevenue / 365
  const cashFlowImprovement = dsoImprovement * dailyRevenue

  // Collection rate improvement
  const collectionRateImprovement = targetCollectionRate - currentCollectionRate
  const improvedCollectionAmount = (annualRevenue * collectionRateImprovement) / 100

  // Bad debt reduction
  const badDebtReduction = currentBadDebtRate - targetBadDebtRate
  const reducedBadDebt = (annualRevenue * badDebtReduction) / 100

  // Time efficiency savings (assuming 30% reduction in manual work)
  const timeEfficiencySavings = collectionStaffCost * 0.3

  // Total annual benefit
  const totalAnnualBenefit = cashFlowImprovement + improvedCollectionAmount + reducedBadDebt + timeEfficiencySavings

  // Software cost estimation
  const estimatedSoftwareCost = Math.max(annualRevenue * 0.001, numberOfInvoices * 0.5)

  const netBenefit = totalAnnualBenefit - estimatedSoftwareCost - currentSystemCost
  const roi = (netBenefit / estimatedSoftwareCost) * 100
  const paybackPeriod = estimatedSoftwareCost / (totalAnnualBenefit / 12)

  return {
    cashFlowImprovement,
    annualSavings: totalAnnualBenefit,
    roi,
    paybackPeriod,
    improvedCollectionAmount,
    reducedBadDebt,
    timeEfficiencySavings,
    totalAnnualBenefit,
  }
}

// Helper function to send email via ClickSend
async function sendClickSendEmail(to: string, subject: string, htmlBody: string): Promise<void> {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_EMAIL_ADDRESS_ID || "support@kuhlekt.com"

  console.log("ClickSend environment check:", {
    hasUsername: !!username,
    hasApiKey: !!apiKey,
    fromEmail,
  })

  if (!username || !apiKey) {
    console.error("Missing ClickSend credentials")
    throw new Error("Missing ClickSend credentials")
  }

  const auth = Buffer.from(`${username}:${apiKey}`).toString("base64")

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
    subject,
    body: htmlBody,
  }

  console.log("Sending ClickSend email:", {
    to,
    subject,
    from: payload.from,
  })

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  })

  const responseData = await response.json()
  console.log("ClickSend response:", responseData)

  if (!response.ok) {
    console.error("ClickSend API error:", {
      status: response.status,
      body: responseData,
    })
    throw new Error(`Failed to send email: ${JSON.stringify(responseData)}`)
  }
}

// Generate and send verification code
export async function generateVerificationCode(
  email: string,
): Promise<{ success: boolean; message: string; code?: string }> {
  try {
    console.log("Generating verification code for:", email)

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in Supabase
    const supabase = createClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (insertError) {
      console.error("Supabase insert error:", insertError)
      throw insertError
    }

    console.log("Verification code stored in database")

    // Send email via ClickSend
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code { font-size: 32px; font-weight: bold; color: #667eea; text-align: center; padding: 20px; background: white; border-radius: 8px; letter-spacing: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Verification Code</h1>
            </div>
            <div class="content">
              <p>Thank you for your interest in Kuhlekt's ROI Calculator!</p>
              <p>Please use the verification code below to access your personalized ROI report:</p>
              <div class="code">${code}</div>
              <p><strong>This code will expire in 10 minutes.</strong></p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    try {
      await sendClickSendEmail(email, "Your Kuhlekt ROI Calculator Verification Code", htmlBody)
      console.log("Verification email sent successfully")

      return {
        success: true,
        message: "Verification code sent to your email",
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      // Return code for testing even if email fails
      return {
        success: true,
        message: "Verification code generated (email failed to send)",
        code, // Only for testing
      }
    }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to generate verification code",
    }
  }
}

// Verify code
export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createClient()

    // Find valid code
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid or expired verification code",
      }
    }

    // Mark as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return {
      success: true,
      message: "Code verified successfully",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "Failed to verify code",
    }
  }
}

// Send ROI results via email
export async function sendROIEmail(
  email: string,
  results: SimpleROIResult | DetailedROIResult,
  isDetailed: boolean,
): Promise<{ success: boolean; message: string }> {
  try {
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .metric { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; }
            .metric-label { font-size: 14px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
            .metric-value { font-size: 28px; font-weight: bold; color: #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .cta { text-align: center; margin: 30px 0; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis Results</h1>
            </div>
            <div class="content">
              <p>Thank you for using Kuhlekt's ROI Calculator. Here are your personalized results:</p>
              
              <div class="metric">
                <div class="metric-label">Cash Flow Improvement</div>
                <div class="metric-value">$${results.cashFlowImprovement.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Annual Savings</div>
                <div class="metric-value">$${results.annualSavings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Return on Investment</div>
                <div class="metric-value">${results.roi.toFixed(1)}%</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Payback Period</div>
                <div class="metric-value">${results.paybackPeriod.toFixed(1)} months</div>
              </div>
              
              ${
                isDetailed && "improvedCollectionAmount" in results
                  ? `
                <div class="metric">
                  <div class="metric-label">Improved Collection Amount</div>
                  <div class="metric-value">$${results.improvedCollectionAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Reduced Bad Debt</div>
                  <div class="metric-value">$${results.reducedBadDebt.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Time Efficiency Savings</div>
                  <div class="metric-value">$${results.timeEfficiencySavings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">Total Annual Benefit</div>
                  <div class="metric-value">$${results.totalAnnualBenefit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              `
                  : ""
              }
              
              <div class="cta">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://kuhlekt.com"}" class="button">Learn More About Kuhlekt</a>
              </div>
              
              <p>Ready to transform your accounts receivable process? Contact us today to schedule a personalized demo and see how Kuhlekt can help you achieve these results.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, "Your Kuhlekt ROI Analysis Results", htmlBody)

    return {
      success: true,
      message: "ROI results sent successfully",
    }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      message: "Failed to send ROI results",
    }
  }
}
