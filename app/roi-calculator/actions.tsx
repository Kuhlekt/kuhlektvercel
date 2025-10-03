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

    // Delete any existing codes for this email
    await supabase.from("verification_codes").delete().eq("email", email)

    // Insert new code with 10-minute expiration
    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      attempts: 0,
    })

    if (error) {
      console.error("[ROI] Error storing verification code:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[ROI] Error in storeVerificationCode:", error)
    return false
  }
}

// Send verification code via email
export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log("[ROI] Starting verification process for:", email)

    // Generate code
    const code = generateVerificationCode()
    console.log("[ROI] Generated code")

    // Store in database
    const stored = await storeVerificationCode(email, code)
    if (!stored) {
      return {
        success: false,
        message: "Unable to process your request. Please try again.",
      }
    }
    console.log("[ROI] Code stored in database")

    // Send email
    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
      text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
    })

    if (!emailResult.success) {
      console.error("[ROI] Email send failed:", emailResult.message)
      return {
        success: false,
        message: "Unable to send verification code. Please try again.",
      }
    }

    console.log("[ROI] Verification email sent successfully")
    return {
      success: true,
      message: "Verification code sent to your email",
    }
  } catch (error) {
    console.error("[ROI] Error in sendVerificationCode:", error)
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

    // Get the stored code
    const { data, error } = await supabase.from("verification_codes").select("*").eq("email", email).single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid or expired verification code",
      }
    }

    // Check if code has expired
    if (new Date(data.expires_at) < new Date()) {
      await supabase.from("verification_codes").delete().eq("email", email)

      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    // Check if too many attempts
    if (data.attempts >= 3) {
      await supabase.from("verification_codes").delete().eq("email", email)

      return {
        success: false,
        message: "Too many failed attempts. Please request a new code.",
      }
    }

    // Verify the code
    if (data.code !== code) {
      // Increment attempts
      await supabase
        .from("verification_codes")
        .update({ attempts: data.attempts + 1 })
        .eq("email", email)

      return {
        success: false,
        message: "Invalid verification code",
      }
    }

    // Code is valid - delete it
    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("[ROI] Error in verifyCode:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
    }
  }
}
