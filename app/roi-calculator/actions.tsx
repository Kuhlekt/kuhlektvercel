"use server"

import { sendEmail } from "@/lib/aws-ses"
import { createClient } from "@/lib/supabase/server"

// Generate a random 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store verification code in Supabase
async function storeVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Delete any existing codes for this email
    await supabase.from("verification_codes").delete().eq("email", email)

    // Insert new code with 15-minute expiration
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
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Send verification code via email
export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Generate and store the code
    const code = generateVerificationCode()
    const storeResult = await storeVerificationCode(email, code)

    if (!storeResult.success) {
      console.error("Failed to store verification code:", storeResult.error)
      return {
        success: false,
        message: "Failed to generate verification code. Please try again.",
      }
    }

    // Send the email
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this code, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Your Verification Code</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code will expire in 15 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.message)
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
      message: "An error occurred. Please try again.",
    }
  }
}

// Verify the code entered by the user
export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    // Get the verification code
    const { data, error } = await supabase.from("verification_codes").select("*").eq("email", email).single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid or expired verification code.",
      }
    }

    // Check if code has expired
    const now = new Date()
    const expiresAt = new Date(data.expires_at)
    if (now > expiresAt) {
      // Delete expired code
      await supabase.from("verification_codes").delete().eq("email", email)
      return {
        success: false,
        message: "Verification code has expired. Please request a new one.",
      }
    }

    // Check if too many attempts
    if (data.attempts >= 3) {
      await supabase.from("verification_codes").delete().eq("email", email)
      return {
        success: false,
        message: "Too many attempts. Please request a new verification code.",
      }
    }

    // Check if code matches
    if (data.code !== code) {
      // Increment attempts
      await supabase
        .from("verification_codes")
        .update({ attempts: data.attempts + 1 })
        .eq("email", email)

      return {
        success: false,
        message: `Invalid code. ${2 - data.attempts} attempts remaining.`,
      }
    }

    // Code is valid - delete it
    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Verification successful!",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "An error occurred during verification.",
    }
  }
}

// Calculate simple ROI
export async function calculateSimpleROI(data: {
  monthlyRevenue: number
  dso: number
}): Promise<{ success: boolean; results?: any; message?: string }> {
  try {
    const targetDSO = Math.max(30, data.dso * 0.7) // 30% reduction, minimum 30 days
    const dsoReduction = data.dso - targetDSO
    const annualRevenue = data.monthlyRevenue * 12
    const currentAR = (annualRevenue / 365) * data.dso
    const improvedAR = (annualRevenue / 365) * targetDSO
    const cashReleased = currentAR - improvedAR

    return {
      success: true,
      results: {
        currentDSO: data.dso,
        targetDSO: Math.round(targetDSO),
        dsoReduction: Math.round(dsoReduction),
        cashReleased: Math.round(cashReleased),
        annualRevenue: Math.round(annualRevenue),
        currentAR: Math.round(currentAR),
        improvedAR: Math.round(improvedAR),
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

// Calculate detailed ROI
export async function calculateDetailedROI(data: {
  annualRevenue: number
  currentDSO: number
  collectionStaff: number
  avgStaffCost: number
  badDebtRate: number
}): Promise<{ success: boolean; results?: any; message?: string }> {
  try {
    const targetDSO = Math.max(30, data.currentDSO * 0.7)
    const dsoReduction = data.currentDSO - targetDSO
    const currentAR = (data.annualRevenue / 365) * data.currentDSO
    const improvedAR = (data.annualRevenue / 365) * targetDSO
    const cashReleased = currentAR - improvedAR

    const efficiencyGain = 0.4 // 40% efficiency improvement
    const staffReduction = Math.floor(data.collectionStaff * efficiencyGain)
    const laborSavings = staffReduction * data.avgStaffCost

    const currentBadDebt = data.annualRevenue * (data.badDebtRate / 100)
    const improvedBadDebtRate = data.badDebtRate * 0.6 // 40% reduction
    const improvedBadDebt = data.annualRevenue * (improvedBadDebtRate / 100)
    const badDebtReduction = currentBadDebt - improvedBadDebt

    const totalAnnualBenefit = cashReleased * 0.05 + laborSavings + badDebtReduction // 5% cost of capital
    const estimatedCost = 50000 // Estimated annual software cost
    const roi = ((totalAnnualBenefit - estimatedCost) / estimatedCost) * 100
    const paybackMonths = estimatedCost / (totalAnnualBenefit / 12)

    return {
      success: true,
      results: {
        currentDSO: data.currentDSO,
        targetDSO: Math.round(targetDSO),
        dsoReduction: Math.round(dsoReduction),
        cashReleased: Math.round(cashReleased),
        currentAR: Math.round(currentAR),
        improvedAR: Math.round(improvedAR),
        staffReduction,
        laborSavings: Math.round(laborSavings),
        currentBadDebt: Math.round(currentBadDebt),
        improvedBadDebt: Math.round(improvedBadDebt),
        badDebtReduction: Math.round(badDebtReduction),
        totalAnnualBenefit: Math.round(totalAnnualBenefit),
        estimatedCost,
        roi: Math.round(roi),
        paybackMonths: Math.round(paybackMonths * 10) / 10,
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

// Send ROI report via email
export async function sendROIEmail(email: string, results: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Results",
      text: `Your ROI Calculator Results\n\nDSO Reduction: ${results.dsoReduction} days\nCash Released: $${results.cashReleased.toLocaleString()}\nROI: ${results.roi}%\n\nView the full report for more details.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Your ROI Calculator Results</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Key Metrics</h3>
            <p><strong>DSO Reduction:</strong> ${results.dsoReduction} days</p>
            <p><strong>Cash Released:</strong> $${results.cashReleased.toLocaleString()}</p>
            <p><strong>ROI:</strong> ${results.roi}%</p>
            <p><strong>Payback Period:</strong> ${results.paybackMonths} months</p>
          </div>
          <p>Contact us to learn more about how Kuhlekt can help optimize your accounts receivable process.</p>
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
