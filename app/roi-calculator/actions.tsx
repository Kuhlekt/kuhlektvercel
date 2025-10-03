"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const name = formData.get("name") as string
  const company = formData.get("company") as string

  const result = await sendEmail({
    to: email,
    subject: `ROI Report for ${company}`,
    text: `Hello ${name}, here is your ROI report.`,
    html: `<h1>Hello ${name}</h1><p>Here is your ROI report for ${company}.</p>`,
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
    return { success: false, error: error.message }
  }

  return { success: true, code }
}

export async function verifyCode(email: string, code: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (error || !data) {
    return { success: false, error: "Invalid or expired code" }
  }

  return { success: true }
}
