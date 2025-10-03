"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store verification code in database
async function storeVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Set expiration to 10 minutes from now
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (error) {
      console.error("Database error storing verification code:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error storing verification code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to store verification code",
    }
  }
}

// Calculate simple ROI
export async function calculateSimpleROI(data: {
  currentRevenue: number
  dso: number
}) {
  const { currentRevenue, dso } = data

  // Calculate potential improvements
  const targetDSO = Math.max(dso * 0.7, 30) // 30% reduction, minimum 30 days
  const dsoReduction = dso - targetDSO
  const cashFreedUp = (currentRevenue / 365) * dsoReduction
  const annualSavings = cashFreedUp * 0.05 // 5% opportunity cost

  return {
    currentDSO: dso,
    targetDSO: Math.round(targetDSO),
    dsoReduction: Math.round(dsoReduction),
    cashFreedUp: Math.round(cashFreedUp),
    annualSavings: Math.round(annualSavings),
  }
}

// Calculate detailed ROI
export async function calculateDetailedROI(data: {
  currentRevenue: number
  dso: number
  arStaff: number
  badDebtRate: number
}) {
  const { currentRevenue, dso, arStaff, badDebtRate } = data

  // Calculate improvements
  const targetDSO = Math.max(dso * 0.7, 30)
  const dsoReduction = dso - targetDSO
  const cashFreedUp = (currentRevenue / 365) * dsoReduction
  const annualSavings = cashFreedUp * 0.05

  // Staff efficiency
  const staffCostPerPerson = 60000 // Average AR staff cost
  const staffReduction = Math.floor(arStaff * 0.3) // 30% reduction
  const staffSavings = staffReduction * staffCostPerPerson

  // Bad debt reduction
  const currentBadDebt = currentRevenue * (badDebtRate / 100)
  const targetBadDebtRate = badDebtRate * 0.6 // 40% reduction
  const newBadDebt = currentRevenue * (targetBadDebtRate / 100)
  const badDebtSavings = currentBadDebt - newBadDebt

  const totalAnnualSavings = annualSavings + staffSavings + badDebtSavings

  return {
    currentDSO: dso,
    targetDSO: Math.round(targetDSO),
    dsoReduction: Math.round(dsoReduction),
    cashFreedUp: Math.round(cashFreedUp),
    annualSavings: Math.round(annualSavings),
    staffReduction,
    staffSavings: Math.round(staffSavings),
    currentBadDebtRate: badDebtRate,
    targetBadDebtRate: Math.round(targetBadDebtRate * 10) / 10,
    badDebtSavings: Math.round(badDebtSavings),
    totalAnnualSavings: Math.round(totalAnnualSavings),
  }
}

// Send ROI report via email
export async function sendROIEmail(data: {
  email: string
  name: string
  company: string
  results: any
}) {
  const { email, name, company, results } = data

  const html = `
    <h2>Your ROI Analysis Results</h2>
    <p>Dear ${name},</p>
    <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results for ${company}:</p>
    
    <h3>Key Metrics:</h3>
    <ul>
      <li>Current DSO: ${results.currentDSO} days</li>
      <li>Target DSO: ${results.targetDSO} days</li>
      <li>DSO Reduction: ${results.dsoReduction} days</li>
      <li>Cash Freed Up: $${results.cashFreedUp.toLocaleString()}</li>
      <li>Annual Savings: $${results.annualSavings.toLocaleString()}</li>
    </ul>

    ${
      results.totalAnnualSavings
        ? `
      <h3>Additional Savings:</h3>
      <ul>
        <li>Staff Savings: $${results.staffSavings.toLocaleString()}</li>
        <li>Bad Debt Reduction: $${results.badDebtSavings.toLocaleString()}</li>
        <li><strong>Total Annual Savings: $${results.totalAnnualSavings.toLocaleString()}</strong></li>
      </ul>
    `
        : ""
    }

    <p>Ready to achieve these results? <a href="https://kuhlekt.com/demo">Schedule a demo</a> to see how Kuhlekt can transform your accounts receivable process.</p>
    
    <p>Best regards,<br>The Kuhlekt Team</p>
  `

  return await sendEmail({
    to: email,
    subject: `Your ROI Analysis Results - ${company}`,
    html,
  })
}

// Send verification code
export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Generate verification code
    const code = generateVerificationCode()

    // Store in database
    const storeResult = await storeVerificationCode(email, code)
    if (!storeResult.success) {
      return {
        success: false,
        message: storeResult.error || "Failed to generate verification code",
      }
    }

    // Send email with verification code
    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      html: `
        <h2>Verification Code</h2>
        <p>Your verification code is: <strong style="font-size: 24px; letter-spacing: 2px;">${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `,
      text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification code. Please try again.",
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
      message: "An error occurred. Please try again.",
    }
  }
}

// Verify code
export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    // Get the verification record
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

    // Check if expired
    const now = new Date()
    const expiresAt = new Date(data.expires_at)
    if (now > expiresAt) {
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    // Check attempts
    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many failed attempts. Please request a new code.",
      }
    }

    // Delete the used code
    await supabase.from("verification_codes").delete().eq("email", email).eq("code", code)

    return {
      success: true,
      message: "Verification successful",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)

    // Increment attempts on error
    try {
      const supabase = await createClient()
      await supabase.rpc("increment_verification_attempts", { user_email: email, user_code: code })
    } catch (incrementError) {
      console.error("Error incrementing attempts:", incrementError)
    }

    return {
      success: false,
      message: "An error occurred during verification",
    }
  }
}
