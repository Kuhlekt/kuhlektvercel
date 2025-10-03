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

    // Insert new code
    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
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
        message: "Failed to generate verification code. Please try again.",
      }
    }

    // Send email
    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; text-align: center;">
            <h1 style="color: #2563eb; margin-bottom: 20px;">ROI Calculator Verification</h1>
            <p style="font-size: 16px; margin-bottom: 30px;">Your verification code is:</p>
            <div style="background-color: white; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; margin-bottom: 30px;">
              ${code}
            </div>
            <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
            <p style="font-size: 14px; color: #666;">If you didn't request this code, please ignore this email.</p>
          </div>
        </body>
        </html>
      `,
      text: `Your ROI Calculator verification code is: ${code}. This code will expire in 10 minutes.`,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification code. Please try again.",
      }
    }

    return {
      success: true,
      message: "Verification code sent successfully!",
    }
  } catch (error) {
    console.error("Error sending verification code:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
    }
  }
}

// Verify the code
export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    // Get the verification code
    const { data, error } = await supabase.from("verification_codes").select("*").eq("email", email).single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid or expired verification code.",
      }
    }

    // Check if code has expired
    if (new Date(data.expires_at) < new Date()) {
      // Delete expired code
      await supabase.from("verification_codes").delete().eq("email", email)

      return {
        success: false,
        message: "Verification code has expired. Please request a new one.",
      }
    }

    // Check attempts
    if (data.attempts >= 3) {
      // Delete code after too many attempts
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

    // Code is valid, delete it
    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Email verified successfully!",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "An error occurred during verification.",
    }
  }
}
