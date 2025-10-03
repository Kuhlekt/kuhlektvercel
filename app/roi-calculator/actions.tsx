"use server"

import { sendEmail } from "@/lib/aws-ses"
import { createClient } from "@/lib/supabase/server"

// Generate a random 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store verification code in database
async function storeVerificationCode(email: string, code: string) {
  const supabase = await createClient()

  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 15) // 15 minutes expiry

  const { error } = await supabase.from("verification_codes").insert({
    email,
    code,
    expires_at: expiresAt.toISOString(),
    attempts: 0,
  })

  if (error) {
    console.error("Error storing verification code:", error)
    throw new Error("Failed to store verification code")
  }
}

// Send verification code via email
export async function sendVerificationCode(email: string) {
  try {
    const code = generateVerificationCode()

    // Store code in database
    await storeVerificationCode(email, code)

    // Send email with verification code
    const result = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Verification Code</h2>
          <p>Your verification code is:</p>
          <h1 style="font-size: 36px; color: #007bff; letter-spacing: 5px;">${code}</h1>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    if (!result.success) {
      throw new Error(result.error || "Failed to send email")
    }

    return { success: true, message: "Verification code sent successfully" }
  } catch (error) {
    console.error("Error sending verification code:", error)
    return {
      success: false,
      message: "Failed to send verification code. Please try again.",
    }
  }
}

// Verify the code entered by user
export async function verifyCode(email: string, code: string) {
  try {
    const supabase = await createClient()

    // Get the verification code
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single()

    if (error || !data) {
      return { success: false, message: "Invalid verification code" }
    }

    // Check if code has expired
    if (new Date(data.expires_at) < new Date()) {
      return { success: false, message: "Verification code has expired" }
    }

    // Check attempts
    if (data.attempts >= 3) {
      return { success: false, message: "Too many attempts. Please request a new code." }
    }

    // Increment attempts
    await supabase
      .from("verification_codes")
      .update({ attempts: data.attempts + 1 })
      .eq("id", data.id)

    // Delete the used code
    await supabase.from("verification_codes").delete().eq("id", data.id)

    return { success: true, message: "Code verified successfully" }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, message: "Failed to verify code" }
  }
}

// Calculate simple ROI
export async function calculateSimpleROI(data: {
  annualRevenue: number
  averageInvoiceValue: number
  numberOfInvoices: number
  averageDSO: number
}) {
  const potentialDSOReduction = Math.floor(data.averageDSO * 0.3) // 30% reduction
  const newDSO = data.averageDSO - potentialDSOReduction
  const dailyRevenue = data.annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * potentialDSOReduction
  const annualSavings = cashFlowImprovement * 12

  return {
    currentDSO: data.averageDSO,
    projectedDSO: newDSO,
    dsoReduction: potentialDSOReduction,
    cashFlowImprovement,
    annualSavings,
    roi: (annualSavings / (data.annualRevenue * 0.001)) * 100, // Assuming 0.1% of revenue as software cost
  }
}

// Calculate detailed ROI
export async function calculateDetailedROI(data: {
  annualRevenue: number
  averageInvoiceValue: number
  numberOfInvoices: number
  averageDSO: number
  collectionStaffCount: number
  avgStaffSalary: number
  badDebtPercentage: number
}) {
  const simpleROI = await calculateSimpleROI(data)

  // Labor savings (assuming 40% time reduction)
  const laborSavings = data.collectionStaffCount * data.avgStaffSalary * 0.4

  // Bad debt reduction (assuming 50% reduction in bad debt)
  const currentBadDebt = (data.annualRevenue * data.badDebtPercentage) / 100
  const badDebtReduction = currentBadDebt * 0.5

  const totalAnnualBenefit = simpleROI.annualSavings + laborSavings + badDebtReduction

  return {
    ...simpleROI,
    laborSavings,
    badDebtReduction,
    currentBadDebt,
    totalAnnualBenefit,
    paybackPeriod: 6, // months
    threeYearValue: totalAnnualBenefit * 3,
  }
}

// Send ROI report via email
export async function sendROIEmail(email: string, roiData: any) {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Results - Kuhlekt",
      text: `Thank you for using the Kuhlekt ROI Calculator. Your results are attached.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your ROI Calculator Results</h2>
          <p>Thank you for using the Kuhlekt ROI Calculator.</p>
          <h3>Key Findings:</h3>
          <ul>
            <li>Current DSO: ${roiData.currentDSO} days</li>
            <li>Projected DSO: ${roiData.projectedDSO} days</li>
            <li>DSO Reduction: ${roiData.dsoReduction} days</li>
            <li>Annual Savings: $${roiData.annualSavings.toLocaleString()}</li>
            ${roiData.totalAnnualBenefit ? `<li>Total Annual Benefit: $${roiData.totalAnnualBenefit.toLocaleString()}</li>` : ""}
          </ul>
          <p>To learn more about how Kuhlekt can help your business, schedule a demo with us.</p>
        </div>
      `,
    })

    if (!result.success) {
      throw new Error(result.error || "Failed to send email")
    }

    return { success: true, message: "ROI report sent successfully" }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      message: "Failed to send ROI report. Please try again.",
    }
  }
}
