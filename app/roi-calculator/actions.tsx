"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(email: string, reportData: any) {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Analysis Report",
      text: `Here is your ROI analysis report: ${JSON.stringify(reportData)}`,
      html: `<h1>Your ROI Analysis Report</h1><pre>${JSON.stringify(reportData, null, 2)}</pre>`,
    })

    return result
  } catch (error) {
    console.error("Error sending ROI report:", error)
    return {
      success: false,
      message: "Failed to send report",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function generateVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: deleteError } = await supabase.from("verification_codes").delete().eq("email", email)

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt,
      attempts: 0,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      return {
        success: false,
        message: "Failed to generate verification code",
      }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt Verification Code",
      text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
      html: `<h2>Your Verification Code</h2><p>Your verification code is: <strong>${code}</strong></p><p>This code will expire in 10 minutes.</p>`,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification code",
      }
    }

    return {
      success: true,
      message: "Verification code sent successfully",
    }
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
    return {
      success: false,
      message: "An error occurred while generating verification code",
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("verification_codes").select("*").eq("email", email).single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid or expired verification code",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    if (new Date(data.expires_at) < new Date()) {
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    if (data.code !== code) {
      await supabase
        .from("verification_codes")
        .update({ attempts: data.attempts + 1 })
        .eq("email", email)

      return {
        success: false,
        message: "Invalid verification code",
      }
    }

    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Verification successful",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "An error occurred during verification",
    }
  }
}
