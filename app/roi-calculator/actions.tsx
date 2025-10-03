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
        message: "Failed to store verification code. Please try again.",
      }
    }

    const result = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">Enter this code to access your ROI calculator results:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #999;">This code will expire in 10 minutes.</p>
        </div>
      `,
    })

    if (!result.success) {
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
        message: "Invalid verification code.",
      }
    }

    if (new Date(data.expires_at) < new Date()) {
      return {
        success: false,
        message: "Verification code has expired. Please request a new one.",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many failed attempts. Please request a new code.",
      }
    }

    if (data.code !== code) {
      await supabase
        .from("verification_codes")
        .update({ attempts: data.attempts + 1 })
        .eq("id", data.id)

      return {
        success: false,
        message: "Invalid verification code.",
      }
    }

    await supabase.from("verification_codes").delete().eq("id", data.id)

    return {
      success: true,
      message: "Verification successful!",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "Failed to verify code. Please try again.",
    }
  }
}

export async function calculateSimpleROI(invoiceVolume: number, averageInvoiceValue: number) {
  const manualProcessingCost = invoiceVolume * 15
  const automatedProcessingCost = invoiceVolume * 2
  const annualSavings = manualProcessingCost - automatedProcessingCost
  const implementationCost = 50000
  const roi = ((annualSavings - implementationCost) / implementationCost) * 100
  const paybackPeriod = implementationCost / (annualSavings / 12)

  return {
    annualSavings,
    roi,
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    manualProcessingCost,
    automatedProcessingCost,
  }
}

export async function calculateDetailedROI(data: {
  invoiceVolume: number
  averageInvoiceValue: number
  currentDSO: number
  collectionStaff: number
  avgStaffCost: number
}) {
  const { invoiceVolume, averageInvoiceValue, currentDSO, collectionStaff, avgStaffCost } = data

  const manualProcessingCost = invoiceVolume * 15
  const automatedProcessingCost = invoiceVolume * 2
  const processingTimeSavings = manualProcessingCost - automatedProcessingCost

  const staffCostSavings = collectionStaff * avgStaffCost * 0.4

  const targetDSO = currentDSO * 0.7
  const dsoImprovement = currentDSO - targetDSO
  const cashFlowImprovement = (invoiceVolume * averageInvoiceValue * dsoImprovement) / 365

  const annualSavings = processingTimeSavings + staffCostSavings + cashFlowImprovement * 0.05

  const implementationCost = 50000
  const roi = ((annualSavings - implementationCost) / implementationCost) * 100
  const paybackPeriod = implementationCost / (annualSavings / 12)

  return {
    annualSavings,
    roi,
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    processingTimeSavings,
    staffCostSavings,
    cashFlowImprovement,
    dsoImprovement,
    targetDSO: Math.round(targetDSO),
  }
}

export async function sendROIEmail(email: string, results: any): Promise<{ success: boolean; message: string }> {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Results",
      text: `Your ROI Calculator Results\n\nAnnual Savings: $${results.annualSavings.toLocaleString()}\nROI: ${results.roi.toFixed(1)}%\nPayback Period: ${results.paybackPeriod} months`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Calculator Results</h2>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <p><strong>Annual Savings:</strong> $${results.annualSavings.toLocaleString()}</p>
            <p><strong>ROI:</strong> ${results.roi.toFixed(1)}%</p>
            <p><strong>Payback Period:</strong> ${results.paybackPeriod} months</p>
          </div>
        </div>
      `,
    })

    return result
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send ROI results. Please try again.",
    }
  }
}

export { generateVerificationCode }
