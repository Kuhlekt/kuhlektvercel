"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const companyName = formData.get("companyName") as string
  const currentAR = formData.get("currentAR") as string
  const avgDSO = formData.get("avgDSO") as string
  const staffCost = formData.get("staffCost") as string

  const savings = Math.round(Number.parseFloat(currentAR) * 0.15)
  const dsoReduction = Math.round(Number.parseFloat(avgDSO) * 0.3)
  const efficiencyGain = "40%"

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Your Kuhlekt ROI Analysis</h2>
        <p>Dear ${companyName},</p>
        <p>Thank you for using our ROI calculator. Here are your personalized results:</p>
        <ul>
          <li><strong>Estimated Annual Savings:</strong> $${savings.toLocaleString()}</li>
          <li><strong>DSO Reduction:</strong> ${dsoReduction} days</li>
          <li><strong>Efficiency Gain:</strong> ${efficiencyGain}</li>
        </ul>
        <p>Based on your current AR of $${Number.parseFloat(currentAR).toLocaleString()} and average DSO of ${avgDSO} days, Kuhlekt can help you significantly improve your accounts receivable management.</p>
        <p>Ready to get started? <a href="https://kuhlekt.com/demo">Schedule a demo</a> to see how we can help your business.</p>
        <p>Best regards,<br>The Kuhlekt Team</p>
      </body>
    </html>
  `

  const textContent = `
Your Kuhlekt ROI Analysis

Dear ${companyName},

Thank you for using our ROI calculator. Here are your personalized results:

- Estimated Annual Savings: $${savings.toLocaleString()}
- DSO Reduction: ${dsoReduction} days
- Efficiency Gain: ${efficiencyGain}

Based on your current AR of $${Number.parseFloat(currentAR).toLocaleString()} and average DSO of ${avgDSO} days, Kuhlekt can help you significantly improve your accounts receivable management.

Ready to get started? Visit https://kuhlekt.com/demo to schedule a demo.

Best regards,
The Kuhlekt Team
  `

  const result = await sendEmail({
    to: email,
    subject: "Your Kuhlekt ROI Analysis Results",
    text: textContent,
    html: htmlContent,
  })

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

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Your Kuhlekt Verification Code</h2>
        <p>Your verification code is: <strong style="font-size: 24px; color: #0066cc;">${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <p>Best regards,<br>The Kuhlekt Team</p>
      </body>
    </html>
  `

  const textContent = `
Your Kuhlekt Verification Code

Your verification code is: ${code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
The Kuhlekt Team
  `

  const emailResult = await sendEmail({
    to: email,
    subject: "Your Kuhlekt Verification Code",
    text: textContent,
    html: htmlContent,
  })

  if (!emailResult.success) {
    return { success: false, message: "Failed to send verification code" }
  }

  return { success: true, message: "Verification code sent" }
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
    return { success: false, message: "Invalid verification code" }
  }

  if (new Date(data.expires_at) < new Date()) {
    return { success: false, message: "Verification code has expired" }
  }

  if (data.attempts >= 3) {
    return { success: false, message: "Too many attempts. Please request a new code." }
  }

  await supabase
    .from("verification_codes")
    .update({ attempts: data.attempts + 1 })
    .eq("id", data.id)

  return { success: true, message: "Code verified successfully" }
}
