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
      email: email.toLowerCase(),
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

    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">
            Use the following code to access your ROI calculator results:
          </p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #999;">
            This code will expire in 10 minutes.
          </p>
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
      .eq("email", email.toLowerCase())
      .eq("code", code)
      .single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid verification code.",
      }
    }

    if (new Date(data.expires_at) < new Date()) {
      await supabase.from("verification_codes").delete().eq("id", data.id)
      return {
        success: false,
        message: "Verification code has expired.",
      }
    }

    if (data.attempts >= 3) {
      await supabase.from("verification_codes").delete().eq("id", data.id)
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    await supabase.from("verification_codes").delete().eq("id", data.id)

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
  monthlyRevenue: number
  dso: number
  collectionRate: number
}): Promise<{
  success: boolean
  results?: {
    currentAR: number
    targetDSO: number
    targetAR: number
    cashImprovement: number
    annualSavings: number
  }
  message?: string
}> {
  try {
    const currentAR = (data.monthlyRevenue * data.dso) / 30
    const targetDSO = Math.max(data.dso * 0.7, 15)
    const targetAR = (data.monthlyRevenue * targetDSO) / 30
    const cashImprovement = currentAR - targetAR
    const annualSavings = cashImprovement * 0.05

    return {
      success: true,
      results: {
        currentAR,
        targetDSO,
        targetAR,
        cashImprovement,
        annualSavings,
      },
    }
  } catch (error) {
    console.error("Error calculating simple ROI:", error)
    return {
      success: false,
      message: "Failed to calculate ROI",
    }
  }
}

export async function calculateDetailedROI(data: {
  companyName: string
  monthlyRevenue: number
  dso: number
  collectionRate: number
  averageInvoiceValue: number
  numberOfInvoices: number
  fteCost: number
}): Promise<{
  success: boolean
  results?: {
    currentAR: number
    targetDSO: number
    targetAR: number
    cashImprovement: number
    annualSavings: number
    laborSavings: number
    totalAnnualBenefit: number
    implementationCost: number
    roi: number
    paybackMonths: number
  }
  message?: string
}> {
  try {
    const currentAR = (data.monthlyRevenue * data.dso) / 30
    const targetDSO = Math.max(data.dso * 0.7, 15)
    const targetAR = (data.monthlyRevenue * targetDSO) / 30
    const cashImprovement = currentAR - targetAR
    const annualSavings = cashImprovement * 0.05

    const manualTimePerInvoice = 15
    const automatedTimePerInvoice = 3
    const timeSavingsPerInvoice = manualTimePerInvoice - automatedTimePerInvoice
    const monthlyTimeSavings = (data.numberOfInvoices * timeSavingsPerInvoice) / 60
    const laborSavings = (monthlyTimeSavings * data.fteCost * 12) / 160

    const totalAnnualBenefit = annualSavings + laborSavings

    const implementationCost = 50000
    const roi = ((totalAnnualBenefit - implementationCost) / implementationCost) * 100
    const paybackMonths = implementationCost / (totalAnnualBenefit / 12)

    return {
      success: true,
      results: {
        currentAR,
        targetDSO,
        targetAR,
        cashImprovement,
        annualSavings,
        laborSavings,
        totalAnnualBenefit,
        implementationCost,
        roi,
        paybackMonths,
      },
    }
  } catch (error) {
    console.error("Error calculating detailed ROI:", error)
    return {
      success: false,
      message: "Failed to calculate ROI",
    }
  }
}

export async function sendROIEmail(email: string, results: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Results",
      text: `Here are your ROI calculation results:\n\nCash Improvement: $${results.cashImprovement.toLocaleString()}\nAnnual Savings: $${results.annualSavings.toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Calculation Results</h2>
          <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0;">
            <p><strong>Cash Improvement:</strong> $${results.cashImprovement.toLocaleString()}</p>
            <p><strong>Annual Savings:</strong> $${results.annualSavings.toLocaleString()}</p>
            ${results.totalAnnualBenefit ? `<p><strong>Total Annual Benefit:</strong> $${results.totalAnnualBenefit.toLocaleString()}</p>` : ""}
            ${results.roi ? `<p><strong>ROI:</strong> ${results.roi.toFixed(1)}%</p>` : ""}
          </div>
        </div>
      `,
    })

    return emailResult
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      message: "Failed to send email",
    }
  }
}

export { generateVerificationCode }
