"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15)

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
        message: storeResult.error || "Failed to store verification code",
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
          <h1 style="background-color: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px;">${code}</h1>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: emailResult.error || "Failed to send email",
      }
    }

    return {
      success: true,
      message: "Verification code sent successfully",
    }
  } catch (error) {
    console.error("Error in sendVerificationCode:", error)
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

    const now = new Date()
    const expiresAt = new Date(data.expires_at)

    if (now > expiresAt) {
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

    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "Failed to verify code",
    }
  }
}

export async function calculateSimpleROI(data: {
  annualRevenue: number
  currentDSO: number
  targetDSO: number
  averageInvoiceValue: number
  monthlyInvoices: number
}) {
  const dsoReduction = data.currentDSO - data.targetDSO
  const dailyRevenue = data.annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction
  const annualSavings = cashFlowImprovement * 12

  return {
    dsoReduction,
    cashFlowImprovement,
    annualSavings,
    roi: (annualSavings / data.annualRevenue) * 100,
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  currentDSO: number
  targetDSO: number
  averageInvoiceValue: number
  monthlyInvoices: number
  currentStaffCost: number
  automationSavings: number
}) {
  const simpleROI = await calculateSimpleROI(data)

  const staffSavings = data.currentStaffCost * (data.automationSavings / 100)
  const totalAnnualSavings = simpleROI.annualSavings + staffSavings * 12

  return {
    ...simpleROI,
    staffSavings,
    totalAnnualSavings,
    totalROI: (totalAnnualSavings / data.annualRevenue) * 100,
  }
}

export async function sendROIEmail(email: string, reportData: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Report",
      text: `Your ROI report has been generated. Please find the details below.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your ROI Calculator Report</h2>
          <p>Thank you for using our ROI calculator. Here are your results:</p>
          <div style="background-color: #f0f0f0; padding: 20px; margin: 20px 0;">
            <h3>Results Summary</h3>
            <p><strong>DSO Reduction:</strong> ${reportData.dsoReduction} days</p>
            <p><strong>Cash Flow Improvement:</strong> $${reportData.cashFlowImprovement.toLocaleString()}</p>
            <p><strong>Annual Savings:</strong> $${reportData.annualSavings.toLocaleString()}</p>
            <p><strong>ROI:</strong> ${reportData.roi.toFixed(2)}%</p>
          </div>
          <p>For more information about how Kuhlekt can help optimize your accounts receivable, please contact us.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: emailResult.error || "Failed to send email",
      }
    }

    return {
      success: true,
      message: "ROI report sent successfully",
    }
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send ROI report",
    }
  }
}

export { generateVerificationCode }
