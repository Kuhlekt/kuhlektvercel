"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface VerificationCode {
  email: string
  code: string
  expires_at: string
}

export async function generateVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const supabase = await createClient()

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt,
      attempts: 0,
    })

    if (insertError) {
      console.error("Database error:", insertError)
      return {
        success: false,
        message: "Failed to generate verification code. Please try again.",
      }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">Enter this code to access your ROI calculator results:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #999;">This code will expire in 10 minutes.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification email. Please try again.",
      }
    }

    return {
      success: true,
      message: "Verification code sent to your email.",
    }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    const { data, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !data) {
      return {
        success: false,
        message: "No verification code found for this email.",
      }
    }

    const record = data as VerificationCode & { attempts: number }

    if (record.attempts >= 3) {
      return {
        success: false,
        message: "Too many failed attempts. Please request a new code.",
      }
    }

    if (new Date(record.expires_at) < new Date()) {
      return {
        success: false,
        message: "Verification code has expired. Please request a new one.",
      }
    }

    if (record.code !== code) {
      await supabase
        .from("verification_codes")
        .update({ attempts: record.attempts + 1 })
        .eq("email", email)
        .eq("code", record.code)

      return {
        success: false,
        message: "Invalid verification code. Please try again.",
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
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function calculateSimpleROI(data: any) {
  const annualRevenue = Number.parseFloat(data.annualRevenue) || 0
  const averageInvoiceValue = Number.parseFloat(data.averageInvoiceValue) || 0
  const currentDSO = Number.parseFloat(data.currentDSO) || 0

  const targetDSO = Math.max(currentDSO * 0.7, 30)
  const dsoReduction = currentDSO - targetDSO
  const daysImprovement = dsoReduction
  const cashFlowImprovement = (annualRevenue / 365) * daysImprovement
  const yearlyValue = cashFlowImprovement

  return {
    currentDSO,
    targetDSO,
    dsoReduction,
    cashFlowImprovement,
    yearlyValue,
    annualRevenue,
  }
}

export async function calculateDetailedROI(data: any) {
  const simpleROI = await calculateSimpleROI(data)

  const monthlyInvoices = Number.parseFloat(data.monthlyInvoices) || 0
  const hoursPerInvoice = Number.parseFloat(data.hoursPerInvoice) || 0
  const hourlyRate = Number.parseFloat(data.hourlyRate) || 0

  const currentMonthlyCost = monthlyInvoices * hoursPerInvoice * hourlyRate
  const automatedMonthlyCost = currentMonthlyCost * 0.3
  const monthlySavings = currentMonthlyCost - automatedMonthlyCost
  const yearlySavings = monthlySavings * 12

  const totalYearlyBenefit = simpleROI.yearlyValue + yearlySavings

  return {
    ...simpleROI,
    currentMonthlyCost,
    automatedMonthlyCost,
    monthlySavings,
    yearlySavings,
    totalYearlyBenefit,
  }
}

export async function sendROIEmail(email: string, results: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Analysis Results",
      text: `Your ROI Analysis Results\n\nCash Flow Improvement: $${results.cashFlowImprovement.toFixed(2)}\nYearly Value: $${results.yearlyValue.toFixed(2)}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your ROI Analysis Results</h2>
          <p><strong>Cash Flow Improvement:</strong> $${results.cashFlowImprovement.toFixed(2)}</p>
          <p><strong>Yearly Value:</strong> $${results.yearlyValue.toFixed(2)}</p>
        </div>
      `,
    })

    return emailResult
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send ROI report.",
    }
  }
}
