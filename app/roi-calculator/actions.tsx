"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const verificationCode = formData.get("verificationCode") as string

  const supabase = createClient()
  const { data, error } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", verificationCode)
    .eq("verified", false)
    .single()

  if (error || !data) {
    return { success: false, message: "Invalid verification code" }
  }

  const result = await sendEmail({
    to: email,
    subject: "Your ROI Report",
    text: "Here is your ROI report",
    html: "<p>Here is your ROI report</p>",
  })

  if (result.success) {
    await supabase.from("verification_codes").update({ verified: true }).eq("id", data.id)
  }

  return result
}

export async function generateVerificationCode(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const supabase = createClient()

  await supabase.from("verification_codes").insert({
    email,
    code,
    verified: false,
    created_at: new Date().toISOString(),
  })

  await sendEmail({
    to: email,
    subject: "Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  })

  return { success: true }
}

export async function verifyCode(email: string, code: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .eq("verified", false)
    .single()

  return { success: !error && !!data }
}
