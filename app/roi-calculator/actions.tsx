"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

// Generate a random 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store verification code in Supabase
async function storeVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

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
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
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
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">Enter this code to access your ROI calculation:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #999;">This code will expire in 10 minutes.</p>
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

// Verify the code entered by the user
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
        message: "Maximum verification attempts exceeded. Please request a new code.",
      }
    }

    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Verification successful!",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "Verification failed. Please try again.",
    }
  }
}

// Calculate simple ROI
export async function calculateSimpleROI(data: {
  annualRevenue: number
  dso: number
  targetDso: number
}): Promise<{
  success: boolean
  data?: {
    currentDso: number
    targetDso: number
    dsoReduction: number
    cashFlowImprovement: number
    annualSavings: number
  }
  error?: string
}> {
  try {
    const dsoReduction = data.dso - data.targetDso
    const dailyRevenue = data.annualRevenue / 365
    const cashFlowImprovement = dailyRevenue * dsoReduction
    const annualSavings = cashFlowImprovement * 0.05

    return {
      success: true,
      data: {
        currentDso: data.dso,
        targetDso: data.targetDso,
        dsoReduction,
        cashFlowImprovement,
        annualSavings,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Calculate detailed ROI
export async function calculateDetailedROI(data: {
  annualRevenue: number
  dso: number
  targetDso: number
  arStaffCount: number
  avgSalary: number
  collectionRate: number
  manualProcessTime: number
}): Promise<{
  success: boolean
  data?: {
    currentDso: number
    targetDso: number
    dsoReduction: number
    cashFlowImprovement: number
    staffProductivityGain: number
    collectionRateImprovement: number
    annualSavings: number
    roi: number
    paybackPeriod: number
  }
  error?: string
}> {
  try {
    const dsoReduction = data.dso - data.targetDso
    const dailyRevenue = data.annualRevenue / 365
    const cashFlowImprovement = dailyRevenue * dsoReduction

    const staffProductivityGain = data.arStaffCount * data.avgSalary * 0.3
    const collectionRateImprovement = data.annualRevenue * (0.05 * data.collectionRate)

    const annualSavings = cashFlowImprovement * 0.05 + staffProductivityGain + collectionRateImprovement

    const estimatedCost = 50000
    const roi = ((annualSavings - estimatedCost) / estimatedCost) * 100
    const paybackPeriod = estimatedCost / (annualSavings / 12)

    return {
      success: true,
      data: {
        currentDso: data.dso,
        targetDso: data.targetDso,
        dsoReduction,
        cashFlowImprovement,
        staffProductivityGain,
        collectionRateImprovement,
        annualSavings,
        roi,
        paybackPeriod,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Send ROI calculation via email
export async function sendROIEmail(
  email: string,
  calculation: {
    currentDso: number
    targetDso: number
    dsoReduction: number
    cashFlowImprovement: number
    annualSavings: number
    roi?: number
    paybackPeriod?: number
  },
): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculation Results",
      text: `Your ROI Calculation Results\n\nCurrent DSO: ${calculation.currentDso} days\nTarget DSO: ${calculation.targetDso} days\nDSO Reduction: ${calculation.dsoReduction} days\nCash Flow Improvement: $${calculation.cashFlowImprovement.toLocaleString()}\nAnnual Savings: $${calculation.annualSavings.toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Calculation Results</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold;">Current DSO</td>
              <td style="padding: 10px; text-align: right;">${calculation.currentDso} days</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold;">Target DSO</td>
              <td style="padding: 10px; text-align: right;">${calculation.targetDso} days</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold;">DSO Reduction</td>
              <td style="padding: 10px; text-align: right;">${calculation.dsoReduction} days</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold;">Cash Flow Improvement</td>
              <td style="padding: 10px; text-align: right;">$${calculation.cashFlowImprovement.toLocaleString()}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold;">Annual Savings</td>
              <td style="padding: 10px; text-align: right;">$${calculation.annualSavings.toLocaleString()}</td>
            </tr>
            ${
              calculation.roi
                ? `<tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold;">ROI</td>
              <td style="padding: 10px; text-align: right;">${calculation.roi.toFixed(1)}%</td>
            </tr>`
                : ""
            }
            ${
              calculation.paybackPeriod
                ? `<tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold;">Payback Period</td>
              <td style="padding: 10px; text-align: right;">${calculation.paybackPeriod.toFixed(1)} months</td>
            </tr>`
                : ""
            }
          </table>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            Ready to see these results in your business? <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="color: #0066cc;">Schedule a demo</a> to learn more.
          </p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send ROI calculation. Please try again.",
      }
    }

    return {
      success: true,
      message: "ROI calculation sent successfully!",
    }
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send ROI calculation. Please try again.",
    }
  }
}

export { generateVerificationCode }
