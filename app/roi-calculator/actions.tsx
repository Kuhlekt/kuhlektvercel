"use server"

import { sendEmail } from "@/lib/aws-ses"
import { createClient } from "@/lib/supabase/server"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    const { error: deleteError } = await supabase.from("verification_codes").delete().eq("email", email)

    if (deleteError) {
      console.error("Error deleting old codes:", deleteError)
    }

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      return { success: false, error: insertError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in storeVerificationCode:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const code = generateVerificationCode()

    const storeResult = await storeVerificationCode(email, code)
    if (!storeResult.success) {
      return {
        success: false,
        message: "Failed to store verification code",
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
            Please use the following code to verify your email:
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
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
        message: "Failed to send verification email",
      }
    }

    return {
      success: true,
      message: "Verification code sent successfully",
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

    const { data, error } = await supabase.from("verification_codes").select("*").eq("email", email).single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid or expired verification code",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    if (data.code !== code) {
      await supabase
        .from("verification_codes")
        .update({ attempts: data.attempts + 1 })
        .eq("email", email)

      return {
        success: false,
        message: "Invalid verification code",
      }
    }

    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "Verification failed. Please try again.",
    }
  }
}

export { generateVerificationCode }

export async function calculateSimpleROI(data: any) {
  const annualRevenue = Number.parseFloat(data.annualRevenue) || 0
  const avgInvoiceValue = Number.parseFloat(data.avgInvoiceValue) || 0
  const currentDSO = Number.parseFloat(data.currentDSO) || 0

  const projectedDSO = currentDSO * 0.6
  const dsoReduction = currentDSO - projectedDSO
  const annualSavings = (annualRevenue / 365) * dsoReduction
  const monthlySubscription = 500
  const annualCost = monthlySubscription * 12
  const netBenefit = annualSavings - annualCost
  const roi = ((netBenefit / annualCost) * 100).toFixed(2)

  return {
    success: true,
    data: {
      currentDSO,
      projectedDSO: projectedDSO.toFixed(1),
      dsoReduction: dsoReduction.toFixed(1),
      annualSavings: annualSavings.toFixed(2),
      annualCost: annualCost.toFixed(2),
      netBenefit: netBenefit.toFixed(2),
      roi,
      paybackPeriod: (annualCost / (annualSavings / 12)).toFixed(1),
    },
  }
}

export async function calculateDetailedROI(data: any) {
  return calculateSimpleROI(data)
}

export async function sendROIEmail(email: string, reportData: any) {
  return await sendEmail({
    to: email,
    subject: "Your ROI Calculator Results",
    text: "Your ROI calculation results are attached.",
    html: "<h1>ROI Results</h1><p>Your detailed ROI analysis.</p>",
  })
}
