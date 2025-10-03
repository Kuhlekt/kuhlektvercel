"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (error) {
      console.error("Error storing verification code:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in storeVerificationCode:", error)
    return { success: false, error: "Failed to store verification code" }
  }
}

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
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this code, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">Enter this code to access your ROI calculator results:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #999;">This code will expire in 15 minutes.</p>
          <p style="font-size: 14px; color: #999;">If you didn't request this code, please ignore this email.</p>
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
      message: "Failed to send verification code. Please try again.",
    }
  }
}

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
        message: "Invalid verification code",
      }
    }

    const now = new Date()
    const expiresAt = new Date(data.expires_at)

    if (now > expiresAt) {
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    if (data.attempts >= 5) {
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    await supabase
      .from("verification_codes")
      .update({ attempts: data.attempts + 1 })
      .eq("id", data.id)

    return {
      success: true,
      message: "Code verified successfully!",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "Failed to verify code. Please try again.",
    }
  }
}

export async function calculateSimpleROI(data: {
  annualRevenue: number
  dso: number
  industryAverage: number
}) {
  const currentCashTied = (data.annualRevenue / 365) * data.dso
  const optimizedCashTied = (data.annualRevenue / 365) * data.industryAverage
  const cashReleased = currentCashTied - optimizedCashTied
  const yearlyROI = cashReleased * 0.05

  return {
    currentCashTied,
    optimizedCashTied,
    cashReleased,
    yearlyROI,
    dsoReduction: data.dso - data.industryAverage,
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  currentDSO: number
  targetDSO: number
  costOfCapital: number
  badDebtRate: number
  collectionCosts: number
}) {
  const currentCashTied = (data.annualRevenue / 365) * data.currentDSO
  const targetCashTied = (data.annualRevenue / 365) * data.targetDSO
  const cashReleased = currentCashTied - targetCashTied
  const financingCostSavings = cashReleased * (data.costOfCapital / 100)
  const badDebtReduction = data.annualRevenue * (data.badDebtRate / 100) * 0.5
  const collectionCostSavings = data.collectionCosts * 0.3
  const totalAnnualSavings = financingCostSavings + badDebtReduction + collectionCostSavings
  const threeYearROI = totalAnnualSavings * 3
  const implementationCost = 50000
  const netROI = threeYearROI - implementationCost
  const paybackPeriod = implementationCost / (totalAnnualSavings / 12)

  return {
    currentCashTied,
    targetCashTied,
    cashReleased,
    financingCostSavings,
    badDebtReduction,
    collectionCostSavings,
    totalAnnualSavings,
    threeYearROI,
    implementationCost,
    netROI,
    paybackPeriod,
    dsoReduction: data.currentDSO - data.targetDSO,
  }
}

export async function sendROIEmail(email: string, results: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Results",
      text: `Your ROI Calculator Results\n\nThank you for using the Kuhlekt ROI Calculator.\n\nYour results have been calculated and are ready for review.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Calculator Results</h2>
          <p style="font-size: 16px; color: #666;">Thank you for using the Kuhlekt ROI Calculator.</p>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3 style="color: #333;">Key Findings:</h3>
            <p style="font-size: 14px; color: #666;">Your personalized ROI results have been calculated and are ready for review.</p>
          </div>
          <p style="font-size: 14px; color: #999;">For more information, please contact us at info@kuhlekt.com</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send ROI results. Please try again.",
      }
    }

    return {
      success: true,
      message: "ROI results sent successfully!",
    }
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send ROI results. Please try again.",
    }
  }
}

export { generateVerificationCode }
