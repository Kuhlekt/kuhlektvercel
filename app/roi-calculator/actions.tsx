"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const companyName = formData.get("companyName") as string
  const annualRevenue = formData.get("annualRevenue") as string
  const currentDSO = formData.get("currentDSO") as string
  const targetDSO = formData.get("targetDSO") as string

  const htmlContent = `
    <h2>ROI Calculator Report for ${companyName}</h2>
    <p>Annual Revenue: ${annualRevenue}</p>
    <p>Current DSO: ${currentDSO}</p>
    <p>Target DSO: ${targetDSO}</p>
  `

  const textContent = `ROI Calculator Report for ${companyName}\nAnnual Revenue: ${annualRevenue}\nCurrent DSO: ${currentDSO}\nTarget DSO: ${targetDSO}`

  const result = await sendEmail({
    to: email,
    subject: "Your Kuhlekt ROI Report",
    text: textContent,
    html: htmlContent,
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
  })

  if (error) {
    return { success: false, message: "Failed to generate code" }
  }

  const result = await sendEmail({
    to: email,
    subject: "Your Kuhlekt Verification Code",
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
    return { success: false, message: "Invalid code" }
  }

  if (new Date(data.expires_at) < new Date()) {
    return { success: false, message: "Code expired" }
  }

  return { success: true, message: "Code verified" }
}
