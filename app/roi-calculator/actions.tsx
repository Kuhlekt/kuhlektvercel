"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

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
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">Enter this code to view your ROI calculation:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #999;">This code will expire in 10 minutes.</p>
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
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid or expired verification code.",
      }
    }

    if (data.attempts >= 3) {
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
  badDebt: number
}): Promise<{
  success: boolean
  results?: {
    currentDSO: number
    targetDSO: number
    dsoReduction: number
    cashFlowImprovement: number
    badDebtReduction: number
    totalAnnualBenefit: number
    roi: number
  }
  error?: string
}> {
  try {
    const currentDSO = data.dso
    const targetDSO = Math.max(currentDSO * 0.7, 30)
    const dsoReduction = currentDSO - targetDSO
    const dailyRevenue = data.annualRevenue / 365
    const cashFlowImprovement = dailyRevenue * dsoReduction
    const badDebtReduction = data.badDebt * 0.5
    const totalAnnualBenefit = cashFlowImprovement + badDebtReduction
    const implementationCost = data.annualRevenue * 0.02
    const roi = ((totalAnnualBenefit - implementationCost) / implementationCost) * 100

    return {
      success: true,
      results: {
        currentDSO,
        targetDSO: Math.round(targetDSO),
        dsoReduction: Math.round(dsoReduction),
        cashFlowImprovement: Math.round(cashFlowImprovement),
        badDebtReduction: Math.round(badDebtReduction),
        totalAnnualBenefit: Math.round(totalAnnualBenefit),
        roi: Math.round(roi),
      },
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to calculate ROI",
    }
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  dso: number
  badDebt: number
  arStaffCount: number
  timeSpentOnAR: number
}): Promise<{
  success: boolean
  results?: {
    currentDSO: number
    targetDSO: number
    dsoReduction: number
    cashFlowImprovement: number
    badDebtReduction: number
    laborSavings: number
    totalAnnualBenefit: number
    roi: number
    paybackPeriod: number
  }
  error?: string
}> {
  try {
    const currentDSO = data.dso
    const targetDSO = Math.max(currentDSO * 0.7, 30)
    const dsoReduction = currentDSO - targetDSO
    const dailyRevenue = data.annualRevenue / 365
    const cashFlowImprovement = dailyRevenue * dsoReduction
    const badDebtReduction = data.badDebt * 0.5
    const avgSalary = 60000
    const laborSavings = data.arStaffCount * avgSalary * (data.timeSpentOnAR / 100) * 0.5
    const totalAnnualBenefit = cashFlowImprovement + badDebtReduction + laborSavings
    const implementationCost = data.annualRevenue * 0.02
    const roi = ((totalAnnualBenefit - implementationCost) / implementationCost) * 100
    const paybackPeriod = implementationCost / (totalAnnualBenefit / 12)

    return {
      success: true,
      results: {
        currentDSO,
        targetDSO: Math.round(targetDSO),
        dsoReduction: Math.round(dsoReduction),
        cashFlowImprovement: Math.round(cashFlowImprovement),
        badDebtReduction: Math.round(badDebtReduction),
        laborSavings: Math.round(laborSavings),
        totalAnnualBenefit: Math.round(totalAnnualBenefit),
        roi: Math.round(roi),
        paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to calculate detailed ROI",
    }
  }
}

export async function sendROIEmail(email: string, results: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Analysis Results",
      text: `Your ROI Analysis Results\n\nTotal Annual Benefit: $${results.totalAnnualBenefit.toLocaleString()}\nROI: ${results.roi}%`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Analysis Results</h2>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3>Total Annual Benefit: $${results.totalAnnualBenefit.toLocaleString()}</h3>
            <p>ROI: ${results.roi}%</p>
          </div>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send ROI report. Please try again.",
      }
    }

    return {
      success: true,
      message: "ROI report sent successfully!",
    }
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send ROI report. Please try again.",
    }
  }
}

export { generateVerificationCode }
