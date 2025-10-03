"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store verification code in database
async function storeVerificationCode(email: string, code: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

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

// Send verification code via email
export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const code = generateVerificationCode()
    const stored = await storeVerificationCode(email, code)

    if (!stored) {
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
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #2563eb;">${code}</h1>
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
      message: "Verification code sent to your email.",
    }
  } catch (error) {
    console.error("Error in sendVerificationCode:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
    }
  }
}

// Verify the code entered by user
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

    // Check if code has expired
    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
      return {
        success: false,
        message: "Verification code has expired.",
      }
    }

    // Check attempts
    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many failed attempts.",
      }
    }

    // Delete the used code
    await supabase.from("verification_codes").delete().eq("id", data.id)

    return {
      success: true,
      message: "Verification successful!",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
    }
  }
}

// Calculate simple ROI
export async function calculateSimpleROI(params: {
  currentDSO: number
  targetDSO: number
  annualRevenue: number
}) {
  const dsoReduction = params.currentDSO - params.targetDSO
  const dailyRevenue = params.annualRevenue / 365
  const cashFlowImprovement = dsoReduction * dailyRevenue

  return {
    dsoReduction,
    cashFlowImprovement,
    annualSavings: cashFlowImprovement,
  }
}

// Calculate detailed ROI
export async function calculateDetailedROI(params: {
  currentDSO: number
  targetDSO: number
  annualRevenue: number
  currentARStaff: number
  currentCostPerCollection: number
}) {
  const simpleROI = await calculateSimpleROI(params)

  const laborSavings = params.currentARStaff * 0.3 * 50000 // Assume 30% efficiency gain, $50k per staff
  const collectionCostSavings = params.currentCostPerCollection * 0.4 * 1000 // 40% reduction, 1000 collections/year

  const totalAnnualSavings = simpleROI.cashFlowImprovement + laborSavings + collectionCostSavings
  const threeYearROI = totalAnnualSavings * 3

  return {
    ...simpleROI,
    laborSavings,
    collectionCostSavings,
    totalAnnualSavings,
    threeYearROI,
  }
}

// Send ROI report via email
export async function sendROIEmail(email: string, roiData: any) {
  return await sendEmail({
    to: email,
    subject: "Your ROI Calculator Report",
    text: `Your ROI report is ready.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your ROI Calculator Report</h2>
        <p>Here are your results:</p>
        <pre>${JSON.stringify(roiData, null, 2)}</pre>
      </div>
    `,
  })
}
