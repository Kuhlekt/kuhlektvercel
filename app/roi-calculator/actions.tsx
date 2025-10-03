"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROICalculation {
  currentAR: number
  currentDSO: number
  averageInvoiceValue: number
  monthlyInvoices: number
  collectionCosts: number
  creditLosses: number
  expectedDSOReduction: number
  annualSavings: number
  efficiency: number
  cashFlowImprovement: number
}

export async function sendROIReport(email: string, calculation: ROICalculation) {
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    const supabase = await createClient()
    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code: verificationCode,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      attempts: 0,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return {
        success: false,
        message: "Failed to generate verification code",
        error: dbError.message,
      }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Verify Your Email - Kuhlekt ROI Report",
      text: `Your verification code is: ${verificationCode}. This code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email</h2>
          <p>Thank you for calculating your ROI with Kuhlekt!</p>
          <p>Your verification code is:</p>
          <h1 style="background-color: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px;">${verificationCode}</h1>
          <p>This code will expire in 15 minutes.</p>
          <p>Enter this code on the website to receive your detailed ROI report.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return emailResult
    }

    return {
      success: true,
      message: "Verification code sent to your email",
    }
  } catch (error) {
    console.error("Error in sendROIReport:", error)
    return {
      success: false,
      message: "Failed to send verification code",
      error: error instanceof Error ? error.message : "Unknown error",
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

    if (new Date(data.expires_at) < new Date()) {
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many failed attempts. Please request a new code.",
      }
    }

    await supabase.from("verification_codes").delete().eq("email", email).eq("code", code)

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "Failed to verify code",
    }
  }
}

export async function generateVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    const supabase = await createClient()

    await supabase.from("verification_codes").delete().eq("email", email)

    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code: verificationCode,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      attempts: 0,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return {
        success: false,
        message: "Failed to generate verification code",
      }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Verification Code - Kuhlekt",
      text: `Your verification code is: ${verificationCode}. This code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Verification Code</h2>
          <p>Your verification code is:</p>
          <h1 style="background-color: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px;">${verificationCode}</h1>
          <p>This code will expire in 15 minutes.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return emailResult
    }

    return {
      success: true,
      message: "Verification code sent",
    }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      message: "Failed to generate verification code",
    }
  }
}
