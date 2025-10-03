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

export async function sendVerificationCode(email: string): Promise<{
  success: boolean
  message: string
}> {
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
      text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Verification Code</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
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
      message: "Verification code sent successfully",
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
        message: "Invalid verification code",
      }
    }

    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
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

    await supabase
      .from("verification_codes")
      .update({ attempts: data.attempts + 1 })
      .eq("id", data.id)

    return {
      success: true,
      message: "Email verified successfully",
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
  avgInvoiceValue: number
  dso: number
}): Promise<{
  timeSaved: number
  costReduction: number
  revenueAcceleration: number
  totalROI: number
}> {
  const timeSaved = data.monthlyRevenue * 0.15
  const costReduction = data.avgInvoiceValue * 0.08
  const dsoImprovement = data.dso * 0.3
  const revenueAcceleration = (data.monthlyRevenue / 30) * dsoImprovement

  return {
    timeSaved,
    costReduction,
    revenueAcceleration,
    totalROI: timeSaved + costReduction + revenueAcceleration,
  }
}

export async function calculateDetailedROI(data: {
  monthlyRevenue: number
  avgInvoiceValue: number
  dso: number
  collectionRate: number
  teamSize: number
}): Promise<{
  timeSaved: number
  costReduction: number
  revenueAcceleration: number
  staffCostSavings: number
  totalROI: number
  paybackPeriod: number
}> {
  const timeSaved = data.monthlyRevenue * 0.15
  const costReduction = data.avgInvoiceValue * 0.08
  const dsoImprovement = data.dso * 0.3
  const revenueAcceleration = (data.monthlyRevenue / 30) * dsoImprovement
  const staffCostSavings = data.teamSize * 50000 * 0.2

  const totalROI = timeSaved + costReduction + revenueAcceleration + staffCostSavings
  const implementationCost = 50000
  const paybackPeriod = implementationCost / (totalROI / 12)

  return {
    timeSaved,
    costReduction,
    revenueAcceleration,
    staffCostSavings,
    totalROI,
    paybackPeriod,
  }
}

export async function sendROIEmail(
  email: string,
  roiData: {
    timeSaved: number
    costReduction: number
    revenueAcceleration: number
    totalROI: number
  },
): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Results",
      text: `Your ROI Calculator Results:
Time Saved: $${roiData.timeSaved.toLocaleString()}
Cost Reduction: $${roiData.costReduction.toLocaleString()}
Revenue Acceleration: $${roiData.revenueAcceleration.toLocaleString()}
Total ROI: $${roiData.totalROI.toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your ROI Calculator Results</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Time Saved:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${roiData.timeSaved.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Cost Reduction:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${roiData.costReduction.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Revenue Acceleration:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${roiData.revenueAcceleration.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-top: 2px solid #000;"><strong>Total ROI:</strong></td>
              <td style="padding: 10px; border-top: 2px solid #000; font-size: 18px; font-weight: bold;">$${roiData.totalROI.toLocaleString()}</td>
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
      message: "ROI report sent successfully",
    }
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send ROI report. Please try again.",
    }
  }
}

export { generateVerificationCode }
