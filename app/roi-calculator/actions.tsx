"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const code = formData.get("code") as string

  if (!email || !code) {
    return { success: false, message: "Email and code are required" }
  }

  const supabase = await createClient()

  const { data: verification, error } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .eq("verified", false)
    .single()

  if (error || !verification) {
    return { success: false, message: "Invalid or expired verification code" }
  }

  const now = new Date()
  const expiresAt = new Date(verification.expires_at)

  if (now > expiresAt) {
    return { success: false, message: "Verification code has expired" }
  }

  await supabase.from("verification_codes").update({ verified: true }).eq("id", verification.id)

  const result = await sendEmail({
    to: email,
    subject: "Your ROI Calculator Report",
    text: "Thank you for using our ROI Calculator. Your report is attached.",
    html: "<h1>ROI Calculator Report</h1><p>Thank you for using our ROI Calculator.</p>",
  })

  return result
}

export async function generateVerificationCode(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const supabase = await createClient()

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  const { error } = await supabase.from("verification_codes").insert({
    email,
    code,
    expires_at: expiresAt.toISOString(),
    verified: false,
    attempts: 0,
  })

  if (error) {
    console.error("Error saving verification code:", error)
    return { success: false, message: "Failed to generate verification code" }
  }

  const result = await sendEmail({
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<h1>Verification Code</h1><p>Your verification code is: <strong>${code}</strong></p>`,
  })

  if (!result.success) {
    return { success: false, message: "Failed to send verification code" }
  }

  return { success: true, message: "Verification code sent" }
}

export async function verifyCode(email: string, code: string) {
  const supabase = await createClient()

  const { data: verification, error } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .eq("verified", false)
    .single()

  if (error || !verification) {
    return { success: false, message: "Invalid verification code" }
  }

  const now = new Date()
  const expiresAt = new Date(verification.expires_at)

  if (now > expiresAt) {
    return { success: false, message: "Verification code has expired" }
  }

  if (verification.attempts >= 3) {
    return { success: false, message: "Too many attempts" }
  }

  await supabase
    .from("verification_codes")
    .update({
      verified: true,
      attempts: verification.attempts + 1,
    })
    .eq("id", verification.id)

  return { success: true, message: "Code verified successfully" }
}
