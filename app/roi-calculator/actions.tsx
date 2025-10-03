"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIData {
  companyName: string
  email: string
  annualRevenue: number
  currentDSO: number
  targetDSO: number
  averageInvoiceValue: number
  numberOfCustomers: number
}

export async function sendROIReport(data: ROIData) {
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    const supabase = await createClient()

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email: data.email,
      code: verificationCode,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      attempts: 0,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      return {
        success: false,
        message: "Failed to generate verification code",
        error: insertError.message,
      }
    }

    const emailResult = await sendEmail({
      to: data.email,
      subject: "Verify Your Email - Kuhlekt ROI Report",
      text: `Your verification code is: ${verificationCode}. This code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Thank you for requesting your ROI report from Kuhlekt.</p>
          <p>Your verification code is:</p>
          <h1 style="background-color: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px;">
            ${verificationCode}
          </h1>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification email",
        error: emailResult.error,
      }
    }

    return {
      success: true,
      message: "Verification code sent to your email",
    }
  } catch (error) {
    console.error("Error in sendROIReport:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const supabase = await createClient()

    const { data: verificationData, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single()

    if (fetchError || !verificationData) {
      return {
        success: false,
        message: "Invalid verification code",
      }
    }

    if (new Date(verificationData.expires_at) < new Date()) {
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    if (verificationData.attempts >= 3) {
      return {
        success: false,
        message: "Maximum verification attempts exceeded",
      }
    }

    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ attempts: verificationData.attempts + 1 })
      .eq("email", email)
      .eq("code", code)

    if (updateError) {
      console.error("Error updating attempts:", updateError)
    }

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function generateVerificationCode(email: string) {
  return sendROIReport({
    companyName: "",
    email,
    annualRevenue: 0,
    currentDSO: 0,
    targetDSO: 0,
    averageInvoiceValue: 0,
    numberOfCustomers: 0,
  })
}
