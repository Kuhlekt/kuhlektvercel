"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const companyName = formData.get("companyName") as string
  const currentARDays = formData.get("currentARDays") as string
  const targetARDays = formData.get("targetARDays") as string
  const annualRevenue = formData.get("annualRevenue") as string

  const improvement = Number(currentARDays) - Number(targetARDays)
  const cashFlowImprovement = (Number(annualRevenue) / 365) * improvement

  const htmlContent = `
    <h2>Your ROI Analysis - ${companyName}</h2>
    <p><strong>Current AR Days:</strong> ${currentARDays}</p>
    <p><strong>Target AR Days:</strong> ${targetARDays}</p>
    <p><strong>Improvement:</strong> ${improvement} days</p>
    <p><strong>Estimated Cash Flow Improvement:</strong> $${cashFlowImprovement.toLocaleString()}</p>
  `

  const result = await sendEmail({
    to: email,
    subject: `ROI Analysis for ${companyName}`,
    text: `Your ROI Analysis for ${companyName}`,
    html: htmlContent,
  })

  return result
}

export async function generateVerificationCode(
  email: string,
): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt,
      attempts: 0,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return {
        success: false,
        error: "Failed to generate verification code",
      }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <strong>${code}</strong></p><p>This code will expire in 10 minutes.</p>`,
    })

    if (!emailResult.success) {
      return {
        success: false,
        error: "Failed to send verification email",
      }
    }

    return {
      success: true,
      code,
    }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single()

    if (fetchError || !data) {
      return {
        success: false,
        error: "Invalid verification code",
      }
    }

    if (new Date(data.expires_at) < new Date()) {
      return {
        success: false,
        error: "Verification code has expired",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        error: "Too many attempts",
      }
    }

    if (data.code !== code) {
      await supabase
        .from("verification_codes")
        .update({ attempts: data.attempts + 1 })
        .eq("email", email)
        .eq("code", code)

      return {
        success: false,
        error: "Invalid verification code",
      }
    }

    await supabase.from("verification_codes").delete().eq("email", email).eq("code", code)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}
