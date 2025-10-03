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
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function sendVerificationCode(
  email: string,
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const code = generateVerificationCode()

    const storeResult = await storeVerificationCode(email, code)
    if (!storeResult.success) {
      return {
        success: false,
        message: "Failed to send verification code. Please try again.",
        error: storeResult.error,
      }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}

This code will expire in 10 minutes.

If you did not request this code, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
          <p style="font-size: 14px; color: #999;">If you did not request this code, please ignore this email.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification code. Please try again.",
        error: emailResult.error,
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
      error: error instanceof Error ? error.message : "Unknown error",
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
      .gt("expires_at", new Date().toISOString())
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

    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Email verified successfully!",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "Verification failed. Please try again.",
    }
  }
}

export async function calculateSimpleROI(data: {
  annualRevenue: number
  invoiceVolume: number
  avgDaysToCollect: number
}): Promise<{
  success: boolean
  data?: {
    currentDSO: number
    projectedDSO: number
    dsoReduction: number
    cashFlowImprovement: number
    annualSavings: number
  }
  error?: string
}> {
  try {
    const currentDSO = data.avgDaysToCollect
    const projectedDSO = Math.round(currentDSO * 0.65)
    const dsoReduction = currentDSO - projectedDSO
    const dailyRevenue = data.annualRevenue / 365
    const cashFlowImprovement = dailyRevenue * dsoReduction
    const annualSavings = cashFlowImprovement * 12

    return {
      success: true,
      data: {
        currentDSO,
        projectedDSO,
        dsoReduction,
        cashFlowImprovement,
        annualSavings,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Calculation failed",
    }
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  invoiceVolume: number
  avgDaysToCollect: number
  staffCost: number
  writeOffRate: number
}): Promise<{
  success: boolean
  data?: {
    currentDSO: number
    projectedDSO: number
    dsoReduction: number
    cashFlowImprovement: number
    annualSavings: number
    staffEfficiencyGain: number
    writeOffReduction: number
    totalROI: number
    paybackPeriod: number
  }
  error?: string
}> {
  try {
    const currentDSO = data.avgDaysToCollect
    const projectedDSO = Math.round(currentDSO * 0.65)
    const dsoReduction = currentDSO - projectedDSO
    const dailyRevenue = data.annualRevenue / 365
    const cashFlowImprovement = dailyRevenue * dsoReduction
    const annualSavings = cashFlowImprovement * 12

    const staffEfficiencyGain = data.staffCost * 0.4
    const writeOffReduction = ((data.annualRevenue * data.writeOffRate) / 100) * 0.5
    const totalROI = annualSavings + staffEfficiencyGain + writeOffReduction

    const estimatedImplementationCost = 50000
    const paybackPeriod = estimatedImplementationCost / (totalROI / 12)

    return {
      success: true,
      data: {
        currentDSO,
        projectedDSO,
        dsoReduction,
        cashFlowImprovement,
        annualSavings,
        staffEfficiencyGain,
        writeOffReduction,
        totalROI,
        paybackPeriod,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Calculation failed",
    }
  }
}

export async function sendROIEmail(
  email: string,
  roiData: any,
  calculationType: "simple" | "detailed",
): Promise<{ success: boolean; message: string }> {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Results",
      text: `Your ROI calculation results are ready.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Calculation Results</h2>
          <p style="font-size: 16px; color: #666;">Here are your calculated results:</p>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <pre>${JSON.stringify(roiData, null, 2)}</pre>
          </div>
        </div>
      `,
    })

    if (!result.success) {
      return {
        success: false,
        message: "Failed to send email. Please try again.",
      }
    }

    return {
      success: true,
      message: "Results sent to your email!",
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to send email. Please try again.",
    }
  }
}

export { generateVerificationCode }
