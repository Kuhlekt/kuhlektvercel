"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(email: string, reportData: any) {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Your ROI Report",
      text: "Your ROI report is attached",
      html: "<h1>ROI Report</h1><p>Report data here</p>",
    })
    return result
  } catch (error) {
    return { success: false, message: "Failed to send report" }
  }
}

export async function generateVerificationCode(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const supabase = createClient()

  await supabase.from("verification_codes").insert({
    email,
    code,
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  })

  return code
}

export async function verifyCode(email: string, code: string) {
  const supabase = createClient()

  const { data } = await supabase.from("verification_codes").select("*").eq("email", email).eq("code", code).single()

  return !!data
}
