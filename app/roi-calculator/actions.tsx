"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15)

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
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">
            Enter this code to access your ROI calculator results:
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #999;">
            This code will expire in 15 minutes.
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

    const now = new Date()
    const expiresAt = new Date(data.expires_at)

    if (now > expiresAt) {
      await supabase.from("verification_codes").delete().eq("id", data.id)

      return {
        success: false,
        message: "Verification code has expired.",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many verification attempts. Please request a new code.",
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

export async function calculateSimpleROI(formData: {
  annualRevenue: number
  averageInvoiceValue: number
  monthlyInvoices: number
  averageDSO: number
  writeOffPercentage: number
}) {
  const annualInvoices = formData.monthlyInvoices * 12
  const totalAR = formData.annualRevenue
  const currentDSO = formData.averageDSO
  const targetDSO = Math.max(30, currentDSO * 0.6)
  const dsoReduction = currentDSO - targetDSO
  const cashReleased = (totalAR / 365) * dsoReduction
  const writeOffReduction = (formData.writeOffPercentage / 100) * 0.5
  const annualSavings = totalAR * writeOffReduction
  const efficiencyGain = annualInvoices * 0.7 * 25
  const totalBenefit = cashReleased + annualSavings + efficiencyGain

  return {
    currentDSO,
    targetDSO,
    dsoReduction,
    cashReleased,
    writeOffReduction: writeOffReduction * 100,
    annualSavings,
    efficiencyGain,
    totalBenefit,
    roi: (totalBenefit / 50000 - 1) * 100,
    paybackMonths: 50000 / (totalBenefit / 12),
  }
}

export async function calculateDetailedROI(formData: {
  annualRevenue: number
  averageInvoiceValue: number
  monthlyInvoices: number
  averageDSO: number
  writeOffPercentage: number
  collectionStaff: number
  averageStaffCost: number
  creditCheckCost: number
  monthlyDisputeHours: number
}) {
  const simpleROI = await calculateSimpleROI(formData)

  const staffCostSavings = formData.collectionStaff * formData.averageStaffCost * 0.4
  const creditCheckSavings = formData.creditCheckCost * 12 * 0.6
  const disputeResolutionSavings = formData.monthlyDisputeHours * 12 * 50 * 0.5
  const additionalSavings = staffCostSavings + creditCheckSavings + disputeResolutionSavings

  const totalBenefit = simpleROI.totalBenefit + additionalSavings
  const implementationCost = 50000
  const annualSubscription = 30000

  return {
    ...simpleROI,
    staffCostSavings,
    creditCheckSavings,
    disputeResolutionSavings,
    additionalSavings,
    totalBenefit,
    roi: (totalBenefit / implementationCost - 1) * 100,
    paybackMonths: implementationCost / (totalBenefit / 12),
    threeYearValue: totalBenefit * 3 - implementationCost - annualSubscription * 3,
  }
}

export async function sendROIEmail(
  email: string,
  calculationType: "simple" | "detailed",
  results: any,
): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Results",
      text: `Thank you for using the Kuhlekt ROI Calculator. Your results are attached.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Calculator Results</h2>
          <p style="font-size: 16px; color: #666;">
            Thank you for using the Kuhlekt ROI Calculator. Here are your results:
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3>Key Metrics:</h3>
            <ul>
              <li>DSO Reduction: ${results.dsoReduction.toFixed(0)} days</li>
              <li>Cash Released: $${results.cashReleased.toLocaleString()}</li>
              <li>Total Annual Benefit: $${results.totalBenefit.toLocaleString()}</li>
              <li>ROI: ${results.roi.toFixed(0)}%</li>
              <li>Payback Period: ${results.paybackMonths.toFixed(1)} months</li>
            </ul>
          </div>
          <p style="font-size: 14px; color: #999;">
            To learn more about how Kuhlekt can help your business, contact us today.
          </p>
        </div>
      `,
    })

    return emailResult
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send email. Please try again.",
    }
  }
}

export { generateVerificationCode }
