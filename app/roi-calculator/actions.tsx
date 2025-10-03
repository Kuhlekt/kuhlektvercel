"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIData {
  companyName: string
  email: string
  annualRevenue: number
  invoiceVolume: number
  dso: number
}

export async function sendROIReport(data: ROIData) {
  try {
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    const supabase = await createClient()

    const { error: dbError } = await supabase.from("verification_codes").insert({
      email: data.email,
      code: verificationCode,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
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
      to: data.email,
      subject: "Verify Your Email - Kuhlekt ROI Calculator",
      text: `Your verification code is: ${verificationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
            ${verificationCode}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
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
      message: "An error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const supabase = await createClient()

    const { data: verification, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("verified", false)
      .single()

    if (fetchError || !verification) {
      return {
        success: false,
        message: "Invalid verification code",
      }
    }

    if (new Date(verification.expires_at) < new Date()) {
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    if (verification.attempts >= 3) {
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ verified: true })
      .eq("id", verification.id)

    if (updateError) {
      return {
        success: false,
        message: "Failed to verify code",
      }
    }

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "An error occurred during verification",
    }
  }
}

export async function generateVerificationCode(email: string) {
  try {
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    const supabase = await createClient()

    const { error: dbError } = await supabase.from("verification_codes").insert({
      email: email,
      code: verificationCode,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
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
      subject: "Verify Your Email - Kuhlekt ROI Calculator",
      text: `Your verification code is: ${verificationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
            ${verificationCode}
          </div>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    })

    return emailResult
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      message: "Failed to generate verification code",
    }
  }
}
