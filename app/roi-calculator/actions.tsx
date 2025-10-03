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
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
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
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Verification Code</h2>
          <p>Your verification code is:</p>
          <div style="font-size: 32px; font-weight: bold; color: #0066cc; padding: 20px; background-color: #f0f0f0; text-align: center; border-radius: 5px;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
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
    console.error("Error sending verification code:", error)
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
        message: "Verification code has expired.",
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
      message: "Verification successful!",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "Failed to verify code. Please try again.",
    }
  }
}

export async function calculateSimpleROI(data: {
  monthlyRevenue: number
  daysToCollect: number
}): Promise<{
  timeReduction: number
  cashFlowImprovement: number
  annualSavings: number
}> {
  const timeReduction = Math.round(data.daysToCollect * 0.6)
  const cashFlowImprovement = Math.round(data.monthlyRevenue * (timeReduction / 30))
  const annualSavings = cashFlowImprovement * 12

  return {
    timeReduction,
    cashFlowImprovement,
    annualSavings,
  }
}

export async function calculateDetailedROI(data: {
  companyName: string
  email: string
  annualRevenue: number
  averageInvoiceValue: number
  daysToCollect: number
  disputeRate: number
  arTeamSize: number
  averageSalary: number
}): Promise<{
  currentCosts: {
    totalDSO: number
    cashTied: number
    annualLabor: number
    disputeCost: number
  }
  withKuhlekt: {
    newDSO: number
    cashFreed: number
    laborSavings: number
    disputeReduction: number
  }
  improvements: {
    dsoReduction: number
    cashFlowImprovement: number
    annualSavings: number
    roi: number
  }
}> {
  const totalDSO = data.daysToCollect
  const cashTied = (data.annualRevenue / 365) * totalDSO
  const annualLabor = data.arTeamSize * data.averageSalary
  const disputeCost = (data.annualRevenue * data.disputeRate) / 100

  const newDSO = Math.round(totalDSO * 0.4)
  const cashFreed = (data.annualRevenue / 365) * (totalDSO - newDSO)
  const laborSavings = annualLabor * 0.5
  const disputeReduction = disputeCost * 0.7

  const dsoReduction = totalDSO - newDSO
  const cashFlowImprovement = cashFreed
  const annualSavings = laborSavings + disputeReduction
  const kuhlektCost = 50000
  const roi = ((annualSavings + cashFlowImprovement - kuhlektCost) / kuhlektCost) * 100

  return {
    currentCosts: {
      totalDSO,
      cashTied,
      annualLabor,
      disputeCost,
    },
    withKuhlekt: {
      newDSO,
      cashFreed,
      laborSavings,
      disputeReduction,
    },
    improvements: {
      dsoReduction,
      cashFlowImprovement,
      annualSavings,
      roi,
    },
  }
}

export async function sendROIEmail(
  email: string,
  companyName: string,
  results: Awaited<ReturnType<typeof calculateDetailedROI>>,
): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: `ROI Analysis for ${companyName}`,
      text: `Your ROI Analysis Results\n\nDSO Reduction: ${results.improvements.dsoReduction} days\nCash Flow Improvement: $${results.improvements.cashFlowImprovement.toLocaleString()}\nAnnual Savings: $${results.improvements.annualSavings.toLocaleString()}\nROI: ${results.improvements.roi.toFixed(2)}%`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>ROI Analysis for ${companyName}</h2>
          <h3>Your Results</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 10px; border: 1px solid #ddd;">DSO Reduction</td>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${results.improvements.dsoReduction} days</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">Cash Flow Improvement</td>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">$${results.improvements.cashFlowImprovement.toLocaleString()}</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 10px; border: 1px solid #ddd;">Annual Savings</td>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">$${results.improvements.annualSavings.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">ROI</td>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #0066cc;">${results.improvements.roi.toFixed(2)}%</td>
            </tr>
          </table>
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
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      message: "Failed to send ROI report. Please try again.",
    }
  }
}

export { generateVerificationCode }
