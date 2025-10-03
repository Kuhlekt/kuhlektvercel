"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIData {
  companyName: string
  email: string
  industry: string
  annualRevenue: number
  invoicesPerMonth: number
  averageDso: number
  badDebtPercentage: number
}

export async function sendROIReport(data: ROIData) {
  try {
    const subject = `ROI Report for ${data.companyName}`
    const text = `Thank you for your interest in Kuhlekt. Your ROI report has been generated.`
    const html = `
      <h1>ROI Report for ${data.companyName}</h1>
      <p>Thank you for your interest in Kuhlekt.</p>
      <p>Industry: ${data.industry}</p>
      <p>Annual Revenue: $${data.annualRevenue.toLocaleString()}</p>
    `

    const result = await sendEmail({
      to: data.email,
      subject,
      text,
      html,
    })

    return result
  } catch (error) {
    console.error("Error sending ROI report:", error)
    return {
      success: false,
      message: "Failed to send ROI report",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function generateVerificationCode(email: string) {
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

    if (error) {
      console.error("Error storing verification code:", error)
      return { success: false, message: "Failed to generate verification code" }
    }

    const result = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Report Verification Code",
      text: `Your verification code is: ${code}`,
      html: `
        <h2>Your Verification Code</h2>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    })

    return result
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      message: "Failed to generate verification code",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
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

    return { success: true, message: "Code verified successfully" }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "Failed to verify code",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
