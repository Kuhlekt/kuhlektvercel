"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const verificationCode = formData.get("verificationCode") as string

  if (!email || !verificationCode) {
    return { success: false, message: "Email and verification code are required" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", verificationCode)
    .eq("verified", false)
    .single()

  if (error || !data) {
    return { success: false, message: "Invalid or expired verification code" }
  }

  if (new Date(data.expires_at) < new Date()) {
    return { success: false, message: "Verification code has expired" }
  }

  await supabase.from("verification_codes").update({ verified: true }).eq("id", data.id)

  const reportData = JSON.parse(data.report_data)

  const result = await sendEmail({
    to: email,
    subject: "Your ROI Calculator Report",
    text: `Here is your ROI report: ${JSON.stringify(reportData)}`,
    html: `<h1>Your ROI Report</h1><pre>${JSON.stringify(reportData, null, 2)}</pre>`,
  })

  return result
}

export async function generateVerificationCode(email: string, reportData: any) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  const supabase = await createClient()

  const { error } = await supabase.from("verification_codes").insert({
    email,
    code,
    report_data: JSON.stringify(reportData),
    expires_at: expiresAt.toISOString(),
    verified: false,
    attempts: 0,
  })

  if (error) {
    console.error("Error creating verification code:", error)
    return { success: false, message: "Failed to generate verification code" }
  }

  const result = await sendEmail({
    to: email,
    subject: "Your ROI Calculator Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<h1>Your Verification Code</h1><p>Your verification code is: <strong>${code}</strong></p>`,
  })

  return { ...result, code }
}

export async function verifyCode(email: string, code: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .eq("verified", false)
    .single()

  if (error || !data) {
    return { success: false, message: "Invalid verification code" }
  }

  if (new Date(data.expires_at) < new Date()) {
    return { success: false, message: "Verification code has expired" }
  }

  await supabase.from("verification_codes").update({ verified: true }).eq("id", data.id)

  return { success: true, message: "Verification successful" }
}
