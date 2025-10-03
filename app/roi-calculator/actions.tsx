"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const reportData = formData.get("reportData") as string

  const result = await sendEmail({
    to: email,
    subject: "Your ROI Calculator Report",
    text: `Here is your ROI report: ${reportData}`,
    html: `<p>Here is your ROI report:</p><pre>${reportData}</pre>`,
  })

  return result
}

export async function generateVerificationCode(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  const supabase = await createClient()

  const { error } = await supabase.from("verification_codes").insert({
    email,
    code,
    expires_at: expiresAt.toISOString(),
    attempts: 0,
  })

  if (error) {
    console.error("Error saving verification code:", error)
    return { success: false, error: error.message }
  }

  const emailResult = await sendEmail({
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  })

  return emailResult
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
    return { success: false, error: "Invalid verification code" }
  }

  if (new Date(data.expires_at) < new Date()) {
    return { success: false, error: "Verification code has expired" }
  }

  if (data.attempts >= 3) {
    return { success: false, error: "Too many attempts" }
  }

  await supabase
    .from("verification_codes")
    .update({ attempts: data.attempts + 1 })
    .eq("email", email)
    .eq("code", code)

  return { success: true }
}
