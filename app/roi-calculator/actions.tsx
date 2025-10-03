"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const companyName = formData.get("companyName") as string
  const currentAR = formData.get("currentAR") as string
  const dso = formData.get("dso") as string

  const calculatedSavings = Math.round(Number.parseFloat(currentAR) * 0.15)
  const timeReduction = Math.round(Number.parseFloat(dso) * 0.3)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .metric { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .metric-value { font-size: 32px; font-weight: bold; color: #667eea; }
          .metric-label { font-size: 14px; color: #666; text-transform: uppercase; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your ROI Analysis Report</h1>
            <p>Personalized for ${companyName}</p>
          </div>
          <div class="content">
            <h2>Projected Savings & Improvements</h2>
            <div class="metric">
              <div class="metric-label">Estimated Annual Savings</div>
              <div class="metric-value">$${calculatedSavings.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">DSO Reduction</div>
              <div class="metric-value">${timeReduction} days</div>
            </div>
            <div class="metric">
              <div class="metric-label">Current AR</div>
              <div class="metric-value">$${Number.parseFloat(currentAR).toLocaleString()}</div>
            </div>
            <p>These projections are based on industry averages and your current metrics. Results may vary based on implementation and specific business factors.</p>
            <div class="footer">
              <p>Thank you for your interest in Kuhlekt!</p>
              <p>Questions? Contact us at support@kuhlekt.com</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `

  const textContent = `
Your ROI Analysis Report - ${companyName}

Estimated Annual Savings: $${calculatedSavings.toLocaleString()}
DSO Reduction: ${timeReduction} days
Current AR: $${Number.parseFloat(currentAR).toLocaleString()}

These projections are based on industry averages and your current metrics.

Thank you for your interest in Kuhlekt!
Questions? Contact us at support@kuhlekt.com
  `

  const result = await sendEmail({
    to: email,
    subject: `Your Kuhlekt ROI Analysis - ${companyName}`,
    text: textContent,
    html: htmlContent,
  })

  return result
}

export async function generateVerificationCode(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

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
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .code-box { background: #f0f0f0; padding: 30px; text-align: center; border-radius: 10px; margin: 20px 0; }
          .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Your Verification Code</h2>
          <p>Enter this code to access your ROI report:</p>
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      </body>
    </html>
  `

  const textContent = `
Your Verification Code

Enter this code to access your ROI report: ${code}

This code will expire in 15 minutes.

If you didn't request this code, please ignore this email.
  `

  const emailResult = await sendEmail({
    to: email,
    subject: "Your Kuhlekt Verification Code",
    text: textContent,
    html: htmlContent,
  })

  if (!emailResult.success) {
    return { success: false, message: "Failed to send verification email" }
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
    return { success: false, message: "Verification code expired" }
  }

  if (data.attempts >= 3) {
    return { success: false, message: "Too many attempts" }
  }

  await supabase
    .from("verification_codes")
    .update({ attempts: data.attempts + 1 })
    .eq("id", data.id)

  return { success: true, message: "Code verified" }
}
