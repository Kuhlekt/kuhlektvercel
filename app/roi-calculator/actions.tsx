"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

// Generate a random 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store verification code in database
async function storeVerificationCode(email: string, code: string) {
  try {
    const supabase = await createClient()

    // Delete any existing codes for this email
    await supabase.from("verification_codes").delete().eq("email", email)

    // Insert new code with 10 minute expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt,
      attempts: 0,
    })

    if (error) {
      console.error("Error storing verification code:", error)
      throw new Error("Failed to store verification code")
    }

    return { success: true }
  } catch (error) {
    console.error("Error in storeVerificationCode:", error)
    throw error
  }
}

// Send verification code via email
export async function sendVerificationCode(email: string) {
  try {
    const code = generateVerificationCode()

    // Store code in database
    await storeVerificationCode(email, code)

    // Send email with verification code
    await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p>Your verification code is:</p>
          <h1 style="background: #f4f4f4; padding: 20px; text-align: center; letter-spacing: 5px;">${code}</h1>
          <p style="color: #666;">This code will expire in 10 minutes.</p>
        </div>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending verification code:", error)
    return {
      success: false,
      error: "Failed to send verification code. Please try again.",
    }
  }
}

// Verify the code entered by user
export async function verifyCode(email: string, code: string) {
  try {
    const supabase = await createClient()

    // Get the verification code
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single()

    if (error || !data) {
      return { success: false, error: "Invalid verification code" }
    }

    // Check if code is expired
    if (new Date(data.expires_at) < new Date()) {
      await supabase.from("verification_codes").delete().eq("email", email)

      return { success: false, error: "Verification code has expired" }
    }

    // Check attempts
    if (data.attempts >= 3) {
      return { success: false, error: "Too many attempts. Please request a new code." }
    }

    // Delete the used code
    await supabase.from("verification_codes").delete().eq("email", email)

    return { success: true }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, error: "Verification failed. Please try again." }
  }
}

// Calculate simple ROI
export async function calculateSimpleROI(data: any) {
  // Implementation for simple ROI calculation
  return { success: true, data }
}

// Calculate detailed ROI
export async function calculateDetailedROI(data: any) {
  // Implementation for detailed ROI calculation
  return { success: true, data }
}

// Send ROI email
export async function sendROIEmail(email: string, data: any) {
  try {
    await sendEmail({
      to: email,
      subject: "Your ROI Calculation Results",
      text: "Please find your ROI calculation results attached.",
      html: "<p>Please find your ROI calculation results attached.</p>",
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
