"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const revenue = formData.get("revenue") as string
  const dso = formData.get("dso") as string

  const result = await sendEmail({
    to: email,
    subject: `ROI Report for ${company}`,
    text: `Thank you for using our ROI calculator. Revenue: ${revenue}, DSO: ${dso}`,
    html: `<h1>ROI Report</h1><p>Company: ${company}</p><p>Revenue: ${revenue}</p><p>DSO: ${dso}</p>`,
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

  const { data } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .gt("expires_at", new Date().toISOString())
    .single()

  return { success: !!data }
}
