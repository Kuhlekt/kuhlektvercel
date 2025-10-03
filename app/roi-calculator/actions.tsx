"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const revenue = formData.get("revenue") as string
  const employees = formData.get("employees") as string

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .metric { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #4F46E5; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your ROI Calculation Results</h1>
        </div>
        <div class="content">
          <p>Thank you for using our ROI Calculator. Here are your results:</p>
          <div class="metric">
            <strong>Annual Revenue:</strong> $${revenue}
          </div>
          <div class="metric">
            <strong>Number of Employees:</strong> ${employees}
          </div>
          <p>Based on your inputs, implementing Kuhlekt could save your organization significant time and resources.</p>
        </div>
        <div class="footer">
          <p>© 2025 Kuhlekt. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
Your ROI Calculation Results

Thank you for using our ROI Calculator. Here are your results:

Annual Revenue: $${revenue}
Number of Employees: ${employees}

Based on your inputs, implementing Kuhlekt could save your organization significant time and resources.

© 2025 Kuhlekt. All rights reserved.
  `

  const result = await sendEmail({
    to: email,
    subject: "Your ROI Calculation Results - Kuhlekt",
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
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  })

  if (error) {
    console.error("Error storing verification code:", error)
    return { success: false, error: "Failed to generate verification code" }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .code { font-size: 32px; font-weight: bold; text-align: center; padding: 20px; background: white; margin: 20px 0; letter-spacing: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification</h1>
        </div>
        <div class="content">
          <p>Your verification code is:</p>
          <div class="code">${code}</div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2025 Kuhlekt. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
Email Verification

Your verification code is: ${code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

© 2025 Kuhlekt. All rights reserved.
  `

  const emailResult = await sendEmail({
    to: email,
    subject: "Your Verification Code - Kuhlekt",
    text: textContent,
    html: htmlContent,
  })

  if (!emailResult.success) {
    return { success: false, error: "Failed to send verification email" }
  }

  return { success: true }
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
    await supabase
      .from("verification_codes")
      .update({ attempts: supabase.rpc("increment_attempts") })
      .eq("email", email)
      .eq("code", code)

    return { success: false, error: "Invalid verification code" }
  }

  const expiresAt = new Date(data.expires_at)
  if (expiresAt < new Date()) {
    return { success: false, error: "Verification code has expired" }
  }

  if (data.attempts >= 3) {
    return { success: false, error: "Too many failed attempts" }
  }

  await supabase.from("verification_codes").delete().eq("email", email).eq("code", code)

  return { success: true }
}
