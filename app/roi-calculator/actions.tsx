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
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      attempts: 0,
    })

    if (error) {
      console.error("[Store Code] Database error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[Store Code] Unexpected error:", error)
    return false
  }
}

// Send verification code via email
export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log("[Send Code] Starting for email:", email)

    // Generate verification code
    const code = generateVerificationCode()
    console.log("[Send Code] Generated code")

    // Store in database
    const stored = await storeVerificationCode(email, code)
    if (!stored) {
      console.error("[Send Code] Failed to store code in database")
      return {
        success: false,
        message: "Unable to process your request. Please try again.",
      }
    }
    console.log("[Send Code] Stored in database")

    // Send email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Verification Code</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You requested access to your ROI Calculator results. Please use the verification code below:</p>
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              <p><strong>This code will expire in 15 minutes.</strong></p>
              <p>If you didn't request this code, please ignore this email.</p>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
      Your Verification Code
      
      You requested access to your ROI Calculator results. Please use the verification code below:
      
      ${code}
      
      This code will expire in 15 minutes.
      
      If you didn't request this code, please ignore this email.
      
      © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
    `

    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      html: emailHtml,
      text: emailText,
    })

    if (!emailResult.success) {
      console.error("[Send Code] Email send failed:", emailResult.message)
      return {
        success: false,
        message: "Unable to send verification code. Please try again.",
      }
    }

    console.log("[Send Code] Email sent successfully")

    return {
      success: true,
      message: "Verification code sent successfully!",
    }
  } catch (error) {
    console.error("[Send Code] Unexpected error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
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
        message: "Verification code not found or expired.",
      }
    }

    // Check if code is expired
    if (new Date(data.expires_at) < new Date()) {
      await supabase.from("verification_codes").delete().eq("email", email)

      return {
        success: false,
        message: "Verification code has expired. Please request a new one.",
      }
    }

    // Check attempts
    if (data.attempts >= 3) {
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
        message: `Invalid code. ${2 - data.attempts} attempts remaining.`,
      }
    }

    // Code is valid - delete it
    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Code verified successfully!",
    }
  } catch (error) {
    console.error("[Verify Code] Error:", error)
    return {
      success: false,
      message: "An error occurred while verifying the code.",
    }
  }
}
