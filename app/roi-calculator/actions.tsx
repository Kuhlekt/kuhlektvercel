"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const annualRevenue = formData.get("annualRevenue") as string
  const dso = formData.get("dso") as string

  const subject = "Your ROI Report from Kuhlekt"
  const text = `Thank you for using our ROI calculator. Company: ${company}, Annual Revenue: ${annualRevenue}, DSO: ${dso}`
  const html = `<h1>ROI Report</h1><p>Company: ${company}</p><p>Annual Revenue: ${annualRevenue}</p><p>DSO: ${dso}</p>`

  const result = await sendEmail({ to: email, subject, text, html })
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
    return { success: false, message: "Invalid code" }
  }

  if (new Date(data.expires_at) < new Date()) {
    return { success: false, message: "Code expired" }
  }

  await supabase.from("verification_codes").delete().eq("email", email)

  return { success: true, message: "Verified" }
}
