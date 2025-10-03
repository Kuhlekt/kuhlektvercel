"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

// Generate a random 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store verification code in database
async function storeVerificationCode(email: string, code: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    // Delete any existing codes for this email
    await supabase.from("verification_codes").delete().eq("email", email)

    // Insert new code with 15 minute expiration
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
    // Generate code
    const code = generateVerificationCode()

    // Store in database
    const stored = await storeVerificationCode(email, code)
    if (!stored) {
      return {
        success: false,
        message: "Failed to store verification code. Please try again.",
      }
    }

    // Send email
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      text: `Your verification code is: ${code}. This code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">
            Your verification code for the Kuhlekt ROI Calculator is:
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #0070f3; letter-spacing: 5px;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #999;">
            This code will expire in 15 minutes.
          </p>
          <p style="font-size: 14px; color: #999;">
            If you didn't request this code, please ignore this email.
          </p>
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

    // Get the verification code
    const { data, error } = await supabase.from("verification_codes").select("*").eq("email", email).single()

    if (error || !data) {
      return {
        success: false,
        message: "No verification code found. Please request a new code.",
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
        message: "Verification code has expired. Please request a new code.",
      }
    }

    // Check attempts
    if (data.attempts >= 3) {
      // Delete after too many attempts
      await supabase.from("verification_codes").delete().eq("email", email)

      return {
        success: false,
        message: "Too many failed attempts. Please request a new code.",
      }
    }

    // Verify code
    if (data.code !== code) {
      // Increment attempts
      await supabase
        .from("verification_codes")
        .update({ attempts: data.attempts + 1 })
        .eq("email", email)

      return {
        success: false,
        message: "Invalid verification code. Please try again.",
      }
    }

    // Code is valid - delete it
    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Email verified successfully!",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "An error occurred during verification. Please try again.",
    }
  }
}

// Calculate simple ROI
export async function calculateSimpleROI(data: {
  currentRevenue: number
  dso: number
}): Promise<{ success: boolean; results?: any; message?: string }> {
  try {
    const { currentRevenue, dso } = data

    // Simple ROI calculation logic
    const targetDSO = Math.max(30, dso * 0.7) // Target 30% reduction
    const dsoReduction = dso - targetDSO
    const annualSavings = (currentRevenue / 365) * dsoReduction * 0.05 // 5% interest rate

    return {
      success: true,
      results: {
        currentDSO: dso,
        targetDSO: Math.round(targetDSO),
        dsoReduction: Math.round(dsoReduction),
        annualSavings: Math.round(annualSavings),
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
  currentRevenue: number
  dso: number
  employees: number
  collectionCosts: number
}): Promise<{ success: boolean; results?: any; message?: string }> {
  try {
    const { currentRevenue, dso, employees, collectionCosts } = data

    // Detailed ROI calculation logic
    const targetDSO = Math.max(30, dso * 0.7)
    const dsoReduction = dso - targetDSO
    const cashFlowImprovement = (currentRevenue / 365) * dsoReduction
    const interestSavings = cashFlowImprovement * 0.05
    const laborSavings = employees * 40000 * 0.3 // 30% time savings
    const costReduction = collectionCosts * 0.4 // 40% cost reduction
    const totalAnnualSavings = interestSavings + laborSavings + costReduction

    return {
      success: true,
      results: {
        currentDSO: dso,
        targetDSO: Math.round(targetDSO),
        dsoReduction: Math.round(dsoReduction),
        cashFlowImprovement: Math.round(cashFlowImprovement),
        interestSavings: Math.round(interestSavings),
        laborSavings: Math.round(laborSavings),
        costReduction: Math.round(costReduction),
        totalAnnualSavings: Math.round(totalAnnualSavings),
        threeYearROI: Math.round(totalAnnualSavings * 3),
      },
    }
  } catch (error) {
    console.error("Error calculating detailed ROI:", error)
    return {
      success: false,
      message: "Failed to calculate detailed ROI",
    }
  }
}

// Send ROI report via email
export async function sendROIEmail(email: string, results: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Analysis Results",
      text: `Your ROI analysis results are ready. Annual savings: $${results.totalAnnualSavings?.toLocaleString() || results.annualSavings?.toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Analysis Results</h2>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3>Key Metrics:</h3>
            <p><strong>Current DSO:</strong> ${results.currentDSO} days</p>
            <p><strong>Target DSO:</strong> ${results.targetDSO} days</p>
            <p><strong>DSO Reduction:</strong> ${results.dsoReduction} days</p>
            <p><strong>Annual Savings:</strong> $${(results.totalAnnualSavings || results.annualSavings)?.toLocaleString()}</p>
          </div>
          <p style="font-size: 14px; color: #666;">
            Contact us to learn more about how Kuhlekt can help you achieve these results.
          </p>
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
      message: "ROI report sent to your email.",
    }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
    }
  }
}
