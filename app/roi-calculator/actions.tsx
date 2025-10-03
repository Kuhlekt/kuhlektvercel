"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIData {
  annualRevenue: number
  averageInvoiceValue: number
  currentDSO: number
  paymentTerms: number
  collectionCosts: number
}

export async function sendROIReport(email: string, roiData: ROIData) {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    const supabase = await createClient()

    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      attempts: 0,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return { success: false, message: "Failed to generate verification code" }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Report - Verification Code",
      text: `Your verification code is: ${code}. This code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Kuhlekt ROI Report</h2>
          <p>Thank you for your interest in Kuhlekt's accounts receivable automation platform.</p>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0;">Your Verification Code:</h3>
            <p style="font-size: 32px; font-weight: bold; color: #0066cc; letter-spacing: 5px; text-align: center;">${code}</p>
            <p style="text-align: center; color: #666;">This code will expire in 15 minutes</p>
          </div>
          <p>Enter this code to view your personalized ROI report.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This email was sent by Kuhlekt. If you did not request this report, please ignore this email.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return { success: false, message: emailResult.message }
    }

    return { success: true, message: "Verification code sent to your email" }
  } catch (error) {
    console.error("Error in sendROIReport:", error)
    return { success: false, message: "An error occurred. Please try again." }
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("verified", false)
      .single()

    if (error || !data) {
      return { success: false, message: "Invalid verification code" }
    }

    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
      return { success: false, message: "Verification code has expired" }
    }

    if (data.attempts >= 3) {
      return { success: false, message: "Too many attempts. Please request a new code." }
    }

    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ verified: true })
      .eq("id", data.id)

    if (updateError) {
      return { success: false, message: "Verification failed" }
    }

    return { success: true, message: "Email verified successfully" }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return { success: false, message: "An error occurred during verification" }
  }
}

export async function generateVerificationCode(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  const supabase = await createClient()

  const { error } = await supabase.from("verification_codes").insert({
    email,
    code,
    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    attempts: 0,
  })

  if (error) {
    throw new Error("Failed to generate verification code")
  }

  return code
}
