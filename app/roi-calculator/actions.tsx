"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const reportData = formData.get("reportData") as string

  if (!email || !reportData) {
    return { success: false, message: "Missing required fields" }
  }

  const result = await sendEmail({
    to: email,
    subject: "Your ROI Calculator Report",
    text: `Here is your ROI report: ${reportData}`,
    html: `<h1>Your ROI Report</h1><pre>${reportData}</pre>`,
  })

  return result
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
    console.error("Error storing verification code:", error)
    return { success: false, message: "Failed to generate verification code" }
  }

  const emailResult = await sendEmail({
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<h1>Your Verification Code</h1><p>Your code is: <strong>${code}</strong></p>`,
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
    return { success: false, message: "Invalid verification code" }
  }

  if (new Date(data.expires_at) < new Date()) {
    return { success: false, message: "Verification code expired" }
  }

  if (data.attempts >= 3) {
    return { success: false, message: "Too many attempts" }
  }

  await supabase
    .from("verification_codes")
    .update({ attempts: data.attempts + 1 })
    .eq("id", data.id)

  return { success: true, message: "Code verified successfully" }
}
