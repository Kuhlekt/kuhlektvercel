"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const companyName = formData.get("companyName") as string
  const annualRevenue = formData.get("annualRevenue") as string
  const currentDSO = formData.get("currentDSO") as string
  const targetDSO = formData.get("targetDSO") as string

  const emailHtml = `
    <h1>ROI Report for ${companyName}</h1>
    <p>Annual Revenue: $${annualRevenue}</p>
    <p>Current DSO: ${currentDSO} days</p>
    <p>Target DSO: ${targetDSO} days</p>
  `

  const result = await sendEmail({
    to: email,
    subject: "Your ROI Report",
    text: `ROI Report for ${companyName}`,
    html: emailHtml,
  })

  return result
}

export async function generateVerificationCode(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const supabase = await createClient()

  await supabase.from("verification_codes").insert({
    email,
    code,
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    attempts: 0,
  })

  await sendEmail({
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  })

  return { success: true }
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
    return { success: false, message: "Invalid code" }
  }

  if (new Date(data.expires_at) < new Date()) {
    return { success: false, message: "Code expired" }
  }

  return { success: true }
}
