"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function generateVerificationCode(email: string) {
  const supabase = await createClient()
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  const { error } = await supabase.from("verification_codes").insert({
    email,
    code,
    expires_at: expiresAt.toISOString(),
    attempts: 0,
  })

  if (error) {
    console.error("Error storing verification code:", error)
    return { success: false, message: "Failed to generate verification code" }
  }

  const emailResult = await sendEmail({
    to: email,
    subject: "Your ROI Report Verification Code",
    text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
    html: `<p>Your verification code is: <strong>${code}</strong></p><p>This code will expire in 10 minutes.</p>`,
  })

  if (!emailResult.success) {
    return { success: false, message: "Failed to send verification email" }
  }

  return { success: true, message: "Verification code sent to your email" }
}

export async function verifyCode(email: string, code: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .single()

  if (error || !data) {
    return { success: false, message: "Invalid verification code" }
  }

  if (new Date(data.expires_at) < new Date()) {
    return { success: false, message: "Verification code has expired" }
  }

  if (data.attempts >= 3) {
    return { success: false, message: "Too many attempts. Please request a new code." }
  }

  await supabase
    .from("verification_codes")
    .update({ attempts: data.attempts + 1 })
    .eq("id", data.id)

  await supabase.from("verification_codes").delete().eq("id", data.id)

  return { success: true, message: "Email verified successfully" }
}

export async function sendROIReport(email: string, reportData: any) {
  const emailResult = await sendEmail({
    to: email,
    subject: "Your ROI Analysis Report",
    text: `Here is your ROI analysis report.`,
    html: `<h1>Your ROI Analysis Report</h1><p>Thank you for using our ROI calculator.</p>`,
  })

  return emailResult
}
