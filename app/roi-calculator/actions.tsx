"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const annualRevenue = formData.get("annualRevenue") as string
  const dso = formData.get("dso") as string
  const collectionCost = formData.get("collectionCost") as string

  const result = await sendEmail({
    to: email,
    subject: "Your ROI Report from Kuhlekt",
    text: `Here is your ROI calculation based on: Annual Revenue: ${annualRevenue}, DSO: ${dso}, Collection Cost: ${collectionCost}`,
    html: `<h1>Your ROI Report</h1><p>Based on your inputs:</p><ul><li>Annual Revenue: ${annualRevenue}</li><li>DSO: ${dso}</li><li>Collection Cost: ${collectionCost}</li></ul>`,
  })

  return result
}

export async function generateVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (error) throw error

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    })

    if (!emailResult.success) {
      return { success: false, message: "Failed to send verification email" }
    }

    return { success: true, message: "Verification code sent" }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return { success: false, message: "Failed to generate verification code" }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single()

    if (error || !data) {
      return { success: false, message: "Invalid verification code" }
    }

    if (new Date(data.expires_at) < new Date()) {
      return { success: false, message: "Verification code expired" }
    }

    if (data.attempts >= 3) {
      return { success: false, message: "Too many attempts" }
    }

    await supabase.from("verification_codes").delete().eq("email", email)

    return { success: true, message: "Verification successful" }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, message: "Verification failed" }
  }
}
