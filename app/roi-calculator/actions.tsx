"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const currentAR = formData.get("currentAR") as string
  const projectedSavings = formData.get("projectedSavings") as string
  const timeSaved = formData.get("timeSaved") as string

  const subject = "Your Kuhlekt ROI Report"
  const text = `Thank you for your interest in Kuhlekt. Here is your personalized ROI report:\n\nCurrent AR: ${currentAR}\nProjected Savings: ${projectedSavings}\nTime Saved: ${timeSaved}`
  const html = `<h1>Your Kuhlekt ROI Report</h1><p>Thank you for your interest in Kuhlekt.</p><p><strong>Current AR:</strong> ${currentAR}</p><p><strong>Projected Savings:</strong> ${projectedSavings}</p><p><strong>Time Saved:</strong> ${timeSaved}</p>`

  const result = await sendEmail({ to: email, subject, text, html })
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
    return { success: false, message: "Failed to generate verification code" }
  }

  const subject = "Your Kuhlekt Verification Code"
  const text = `Your verification code is: ${code}. This code will expire in 10 minutes.`
  const html = `<h1>Your Verification Code</h1><p>Your verification code is: <strong>${code}</strong></p><p>This code will expire in 10 minutes.</p>`

  const result = await sendEmail({ to: email, subject, text, html })
  return result
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
    return { success: false, message: "Invalid or expired verification code" }
  }

  if (data.attempts >= 3) {
    return { success: false, message: "Too many attempts. Please request a new code." }
  }

  await supabase
    .from("verification_codes")
    .update({ attempts: data.attempts + 1 })
    .eq("id", data.id)

  await supabase.from("verification_codes").delete().eq("id", data.id)

  return { success: true, message: "Verification successful" }
}
