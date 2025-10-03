"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const companyName = formData.get("companyName") as string
  const industry = formData.get("industry") as string
  const annualRevenue = formData.get("annualRevenue") as string
  const currentDSO = formData.get("currentDSO") as string
  const targetDSO = formData.get("targetDSO") as string

  const subject = `ROI Calculator Report - ${companyName}`
  const text = `ROI Report for ${companyName}\n\nIndustry: ${industry}\nAnnual Revenue: ${annualRevenue}\nCurrent DSO: ${currentDSO}\nTarget DSO: ${targetDSO}`
  const html = `<h1>ROI Report for ${companyName}</h1><p><strong>Industry:</strong> ${industry}</p><p><strong>Annual Revenue:</strong> ${annualRevenue}</p><p><strong>Current DSO:</strong> ${currentDSO}</p><p><strong>Target DSO:</strong> ${targetDSO}</p>`

  const result = await sendEmail({
    to: email,
    subject,
    text,
    html,
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
    console.error("Error storing verification code:", error)
    return { success: false, error: "Failed to generate verification code" }
  }

  const result = await sendEmail({
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  })

  return result
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
    return { success: false, error: "Verification code expired" }
  }

  if (data.attempts >= 3) {
    return { success: false, error: "Too many attempts" }
  }

  await supabase.from("verification_codes").delete().eq("email", email)

  return { success: true }
}
