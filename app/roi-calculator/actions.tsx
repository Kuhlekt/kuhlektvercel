"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<boolean> {
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
      return false
    }

    return true
  } catch (error) {
    console.error("Error in storeVerificationCode:", error)
    return false
  }
}

export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const code = generateVerificationCode()
    const stored = await storeVerificationCode(email, code)

    if (!stored) {
      return {
        success: false,
        message: "Failed to store verification code",
      }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">ROI Calculator Verification</h2>
          <p style="font-size: 16px; color: #666;">Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
          <p style="font-size: 14px; color: #999; margin-top: 30px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification email",
      }
    }

    return {
      success: true,
      message: "Verification code sent successfully",
    }
  } catch (error) {
    console.error("Error sending verification code:", error)
    return {
      success: false,
      message: "Failed to send verification code",
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

    if (new Date(data.expires_at) < new Date()) {
      await supabase.from("verification_codes").delete().eq("id", data.id)
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    await supabase.from("verification_codes").delete().eq("id", data.id)

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "Failed to verify code",
    }
  }
}

export async function calculateSimpleROI(data: {
  annualRevenue: number
  dso: number
  targetDso: number
}) {
  const { annualRevenue, dso, targetDso } = data
  const dailyRevenue = annualRevenue / 365
  const dsoReduction = dso - targetDso
  const cashReleased = dailyRevenue * dsoReduction
  const annualSavings = cashReleased * 0.05

  return {
    cashReleased: Math.round(cashReleased),
    annualSavings: Math.round(annualSavings),
    dsoReduction: Math.round(dsoReduction),
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  currentDSO: number
  targetDSO: number
  badDebtRate: number
  arStaffCount: number
  avgStaffCost: number
  interestRate: number
}) {
  const dailyRevenue = data.annualRevenue / 365
  const dsoReduction = data.currentDSO - data.targetDSO
  const cashReleased = dailyRevenue * dsoReduction
  const opportunityCost = cashReleased * (data.interestRate / 100)
  const badDebtSavings = data.annualRevenue * (data.badDebtRate / 100) * 0.3
  const staffSavings = data.arStaffCount * data.avgStaffCost * 0.25
  const totalAnnualSavings = opportunityCost + badDebtSavings + staffSavings

  return {
    cashReleased: Math.round(cashReleased),
    opportunityCost: Math.round(opportunityCost),
    badDebtSavings: Math.round(badDebtSavings),
    staffSavings: Math.round(staffSavings),
    totalAnnualSavings: Math.round(totalAnnualSavings),
    dsoReduction: Math.round(dsoReduction),
    roi: Math.round((totalAnnualSavings / 50000) * 100),
  }
}

export async function sendROIEmail(email: string, results: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Results",
      text: `Your ROI Calculator Results\n\nCash Released: $${results.cashReleased.toLocaleString()}\nAnnual Savings: $${results.annualSavings?.toLocaleString() || results.totalAnnualSavings.toLocaleString()}\nDSO Reduction: ${results.dsoReduction} days`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Calculator Results</h2>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Cash Released</h3>
            <p style="font-size: 24px; font-weight: bold; color: #2563eb;">$${results.cashReleased.toLocaleString()}</p>
            
            <h3 style="color: #333;">Annual Savings</h3>
            <p style="font-size: 24px; font-weight: bold; color: #16a34a;">$${results.annualSavings?.toLocaleString() || results.totalAnnualSavings.toLocaleString()}</p>
            
            <h3 style="color: #333;">DSO Reduction</h3>
            <p style="font-size: 24px; font-weight: bold; color: #7c3aed;">${results.dsoReduction} days</p>
          </div>
          <p style="font-size: 14px; color: #666;">
            These results are based on your inputs and industry benchmarks. Contact us to learn more about how Kuhlekt can help you achieve these improvements.
          </p>
        </div>
      `,
    })

    return emailResult
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      message: "Failed to send ROI email",
    }
  }
}

export { generateVerificationCode }
