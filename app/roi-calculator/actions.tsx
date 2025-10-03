"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface VerificationResult {
  success: boolean
  message: string
}

interface SendCodeResult {
  success: boolean
  message: string
}

export async function sendVerificationCode(email: string): Promise<SendCodeResult> {
  try {
    console.log("[ROI Calculator] Sending verification code to:", email)

    const supabase = await createClient()

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    console.log("[ROI Calculator] Generated code:", code)

    // Store the code in the database
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    const { error: dbError } = await supabase.from("verification_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (dbError) {
      console.error("[ROI Calculator] Database error:", dbError)
      return {
        success: false,
        message: "Unable to generate verification code. Please try again.",
      }
    }

    // Send the email
    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">
            Use the following code to access your ROI calculation report:
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #999;">
            This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
          </p>
        </div>
      `,
      text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
    })

    if (!emailResult.success) {
      console.error("[ROI Calculator] Email send failed:", emailResult.message)
      return {
        success: false,
        message: "Unable to send verification email. Please check your email address and try again.",
      }
    }

    console.log("[ROI Calculator] Verification code sent successfully")
    return {
      success: true,
      message: "Verification code sent successfully",
    }
  } catch (error) {
    console.error("[ROI Calculator] Error in sendVerificationCode:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<VerificationResult> {
  try {
    console.log("[ROI Calculator] Verifying code for:", email)

    const supabase = await createClient()

    // Get the verification record
    const { data: verification, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("code", code)
      .single()

    if (fetchError || !verification) {
      console.error("[ROI Calculator] Verification not found:", fetchError)
      return {
        success: false,
        message: "Invalid verification code",
      }
    }

    // Check if code has expired
    if (new Date(verification.expires_at) < new Date()) {
      console.log("[ROI Calculator] Code expired")

      // Delete expired code
      await supabase.from("verification_codes").delete().eq("id", verification.id)

      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    // Check attempts
    if (verification.attempts >= 3) {
      console.log("[ROI Calculator] Too many attempts")

      // Delete after too many attempts
      await supabase.from("verification_codes").delete().eq("id", verification.id)

      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    // Increment attempts
    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ attempts: verification.attempts + 1 })
      .eq("id", verification.id)

    if (updateError) {
      console.error("[ROI Calculator] Error updating attempts:", updateError)
    }

    // Delete the used code
    await supabase.from("verification_codes").delete().eq("id", verification.id)

    console.log("[ROI Calculator] Code verified successfully")
    return {
      success: true,
      message: "Code verified successfully",
    }
  } catch (error) {
    console.error("[ROI Calculator] Error in verifyCode:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
