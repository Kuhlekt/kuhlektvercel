"use server"

import { sendEmail } from "@/lib/aws-ses"
import { createClient } from "@/lib/supabase/server"

export async function sendROIReport(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const company = formData.get("company") as string
    const revenue = formData.get("revenue") as string
    const invoices = formData.get("invoices") as string
    const dso = formData.get("dso") as string
    const savings = formData.get("savings") as string
    const timeSaved = formData.get("timeSaved") as string

    if (!email || !name) {
      return { success: false, message: "Email and name are required" }
    }

    // Generate verification code
    const verificationCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Store in Supabase
    const supabase = await createClient()
    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code: verificationCode,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      metadata: { name, company, revenue, invoices, dso, savings, timeSaved },
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return { success: false, message: "Failed to generate verification code" }
    }

    // Send email with verification link
    const verificationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/roi-calculator/verify?code=${verificationCode}`

    const result = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Report - Verify Your Email",
      text: `Hi ${name},\n\nClick the link below to download your ROI report:\n${verificationLink}\n\nThis link expires in 24 hours.`,
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for using our ROI Calculator!</p>
        <p>Click the button below to download your personalized ROI report:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Download Report</a>
        <p>Or copy this link: ${verificationLink}</p>
        <p>This link expires in 24 hours.</p>
        <p><strong>Your Results:</strong></p>
        <ul>
          <li>Annual Revenue: ${revenue}</li>
          <li>Monthly Invoices: ${invoices}</li>
          <li>Current DSO: ${dso} days</li>
          <li>Potential Savings: ${savings}</li>
          <li>Time Saved: ${timeSaved}</li>
        </ul>
      `,
    })

    return result
  } catch (error) {
    console.error("Error sending ROI report:", error)
    return {
      success: false,
      message: "Failed to send report",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
