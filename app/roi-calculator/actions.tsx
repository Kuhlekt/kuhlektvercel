"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIData {
  companyName: string
  email: string
  annualRevenue: number
  averageInvoiceValue: number
  numberOfInvoices: number
  daysToCollect: number
  percentageLatePayments: number
}

export async function sendROIReport(data: ROIData) {
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

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
        message: "Failed to store verification code",
      }
    }

    const result = await sendEmail({
      to: data.email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${verificationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your ROI Calculator Verification Code</h2>
          <p>Thank you for using our ROI Calculator. Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${verificationCode}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    return result
  } catch (error) {
    console.error("Error sending verification code:", error)
    return {
      success: false,
      message: "Failed to send verification code",
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
        message: "Too many attempts. Please request a new code.",
      }
    }

    const { error: deleteError } = await supabase
      .from("verification_codes")
      .delete()
      .eq("email", email)
      .eq("code", code)

    if (deleteError) {
      console.error("Error deleting verification code:", deleteError)
    }

    return {
      success: true,
      message: "Verification successful",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "Verification failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function generateVerificationCode(email: string) {
  return sendROIReport({
    companyName: "",
    email,
    annualRevenue: 0,
    averageInvoiceValue: 0,
    numberOfInvoices: 0,
    daysToCollect: 0,
    percentageLatePayments: 0,
  })
}
