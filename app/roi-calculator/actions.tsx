"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const reportData = formData.get("reportData") as string

  if (!email || !reportData) {
    return { success: false, message: "Missing required fields" }
  }

  const parsedData = JSON.parse(reportData)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .metric { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
        .metric-label { font-weight: bold; color: #667eea; }
        .metric-value { font-size: 24px; color: #333; margin: 5px 0; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your ROI Analysis Report</h1>
        </div>
        <div class="content">
          <h2>Results Summary</h2>
          <div class="metric">
            <div class="metric-label">Annual Revenue</div>
            <div class="metric-value">$${parsedData.annualRevenue?.toLocaleString()}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Current DSO</div>
            <div class="metric-value">${parsedData.currentDSO} days</div>
          </div>
          <div class="metric">
            <div class="metric-label">Projected DSO with Kuhlekt</div>
            <div class="metric-value">${parsedData.projectedDSO} days</div>
          </div>
          <div class="metric">
            <div class="metric-label">Annual Savings</div>
            <div class="metric-value">$${parsedData.annualSavings?.toLocaleString()}</div>
          </div>
          <div class="metric">
            <div class="metric-label">ROI</div>
            <div class="metric-value">${parsedData.roi}%</div>
          </div>
        </div>
        <div class="footer">
          <p>Thank you for using Kuhlekt's ROI Calculator</p>
          <p>Visit us at <a href="https://kuhlekt.com">kuhlekt.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
Your ROI Analysis Report

Results Summary:
- Annual Revenue: $${parsedData.annualRevenue?.toLocaleString()}
- Current DSO: ${parsedData.currentDSO} days
- Projected DSO with Kuhlekt: ${parsedData.projectedDSO} days
- Annual Savings: $${parsedData.annualSavings?.toLocaleString()}
- ROI: ${parsedData.roi}%

Thank you for using Kuhlekt's ROI Calculator
Visit us at https://kuhlekt.com
  `

  const result = await sendEmail({
    to: email,
    subject: "Your Kuhlekt ROI Analysis Report",
    text: textContent,
    html: htmlContent,
  })

  return result
}

export async function generateVerificationCode(email: string) {
  const supabase = await createClient()
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  const { error: deleteError } = await supabase.from("verification_codes").delete().eq("email", email)

  if (deleteError) {
    console.error("Error deleting old codes:", deleteError)
  }

  const { error: insertError } = await supabase
    .from("verification_codes")
    .insert({ email, code, expires_at: expiresAt, attempts: 0 })

  if (insertError) {
    console.error("Error inserting verification code:", insertError)
    return { success: false, message: "Failed to generate verification code" }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; text-align: center; }
        .code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 5px; padding: 20px; background: white; border-radius: 10px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
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
          <p>Kuhlekt - Automated Accounts Receivable Management</p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
Your verification code is: ${code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Kuhlekt - Automated Accounts Receivable Management
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

  return { success: true, message: "Verification code sent successfully" }
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
    const { error: attemptsError } = await supabase.rpc("increment_attempts", { user_email: email })

    if (attemptsError) {
      console.error("Error incrementing attempts:", attemptsError)
    }

    return { success: false, message: "Invalid verification code" }
  }

  if (new Date(data.expires_at) < new Date()) {
    return { success: false, message: "Verification code has expired" }
  }

  if (data.attempts >= 3) {
    return { success: false, message: "Too many attempts. Please request a new code." }
  }

  const { error: deleteError } = await supabase.from("verification_codes").delete().eq("email", email)

  if (deleteError) {
    console.error("Error deleting verification code:", deleteError)
  }

  return { success: true, message: "Email verified successfully" }
}
