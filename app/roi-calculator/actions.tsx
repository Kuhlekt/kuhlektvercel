"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

// Generate a random 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store verification code in database
async function storeVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (error) {
      console.error("Database error storing verification code:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error storing verification code:", error)
    return { success: false, error: "Failed to store verification code" }
  }
}

// Send verification code via email
export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const code = generateVerificationCode()
    const storeResult = await storeVerificationCode(email, code)

    if (!storeResult.success) {
      return {
        success: false,
        message: "Failed to generate verification code. Please try again.",
      }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Verification Code</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
            ${code}
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification code. Please try again.",
      }
    }

    return {
      success: true,
      message: "Verification code sent successfully!",
    }
  } catch (error) {
    console.error("Error in sendVerificationCode:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
    }
  }
}

// Verify the code entered by the user
export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid verification code.",
      }
    }

    if (new Date(data.expires_at) < new Date()) {
      return {
        success: false,
        message: "Verification code has expired.",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Email verified successfully!",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "An error occurred during verification.",
    }
  }
}

// Calculate simple ROI
export async function calculateSimpleROI(data: {
  currentARDays: number
  targetARDays: number
  monthlyRevenue: number
  collectionCosts: number
}) {
  const currentDSO = data.currentARDays
  const targetDSO = data.targetARDays
  const dsoReduction = currentDSO - targetDSO
  const dsoReductionPercent = (dsoReduction / currentDSO) * 100

  const currentAR = (data.monthlyRevenue * currentDSO) / 30
  const targetAR = (data.monthlyRevenue * targetDSO) / 30
  const cashFreed = currentAR - targetAR

  const annualCostSavings = data.collectionCosts * 0.6 * 12
  const firstYearROI = ((cashFreed + annualCostSavings) / 50000) * 100

  return {
    currentDSO,
    targetDSO,
    dsoReduction,
    dsoReductionPercent,
    cashFreed,
    annualCostSavings,
    firstYearROI,
  }
}

// Calculate detailed ROI
export async function calculateDetailedROI(data: {
  industry: string
  companySize: string
  currentARDays: number
  targetARDays: number
  monthlyRevenue: number
  collectionCosts: number
  badDebtRate: number
  averageInvoiceValue: number
  monthlyInvoices: number
}) {
  const simpleROI = await calculateSimpleROI(data)

  const badDebtReduction = data.monthlyRevenue * 12 * (data.badDebtRate / 100) * 0.3
  const timeToValue = 3
  const implementationCost = 50000
  const threeYearValue = simpleROI.cashFreed + simpleROI.annualCostSavings * 3 + badDebtReduction * 3
  const threeYearROI = ((threeYearValue - implementationCost) / implementationCost) * 100
  const paybackPeriod = implementationCost / (simpleROI.annualCostSavings / 12 + badDebtReduction / 12)

  return {
    ...simpleROI,
    badDebtReduction,
    timeToValue,
    threeYearValue,
    threeYearROI,
    paybackPeriod,
    implementationCost,
  }
}

// Send ROI report via email
export async function sendROIEmail(email: string, roiData: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Results",
      text: `Here are your ROI calculation results:\n\nDSO Reduction: ${roiData.dsoReduction} days\nCash Freed: $${roiData.cashFreed.toLocaleString()}\nFirst Year ROI: ${roiData.firstYearROI.toFixed(1)}%`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your ROI Calculator Results</h2>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3>Key Metrics</h3>
            <p><strong>DSO Reduction:</strong> ${roiData.dsoReduction} days (${roiData.dsoReductionPercent.toFixed(1)}%)</p>
            <p><strong>Cash Freed:</strong> $${roiData.cashFreed.toLocaleString()}</p>
            <p><strong>Annual Cost Savings:</strong> $${roiData.annualCostSavings.toLocaleString()}</p>
            <p><strong>First Year ROI:</strong> ${roiData.firstYearROI.toFixed(1)}%</p>
          </div>
          <p>Thank you for using our ROI Calculator!</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send email. Please try again.",
      }
    }

    return {
      success: true,
      message: "ROI report sent successfully!",
    }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      message: "An error occurred while sending the email.",
    }
  }
}

export { generateVerificationCode }
