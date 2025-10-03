"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const verificationCode = formData.get("verificationCode") as string
  const reportData = formData.get("reportData") as string

  if (!email || !verificationCode || !reportData) {
    return { success: false, message: "Missing required fields" }
  }

  const supabase = await createClient()
  const { data: verification, error } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", verificationCode)
    .eq("verified", false)
    .single()

  if (error || !verification) {
    return { success: false, message: "Invalid verification code" }
  }

  const report = JSON.parse(reportData)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .metric { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
          .metric-label { font-weight: bold; color: #4F46E5; }
          .metric-value { font-size: 24px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Your ROI Calculator Results</h1>
        </div>
        <div class="content">
          <p>Thank you for using our ROI Calculator. Here are your results:</p>
          <div class="metric">
            <div class="metric-label">Total Savings</div>
            <div class="metric-value">$${report.totalSavings?.toLocaleString() || 0}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Time Saved</div>
            <div class="metric-value">${report.timeSaved || 0} hours/month</div>
          </div>
          <div class="metric">
            <div class="metric-label">ROI Percentage</div>
            <div class="metric-value">${report.roiPercentage || 0}%</div>
          </div>
        </div>
      </body>
    </html>
  `

  const textContent = `
Your ROI Calculator Results

Total Savings: $${report.totalSavings?.toLocaleString() || 0}
Time Saved: ${report.timeSaved || 0} hours/month
ROI Percentage: ${report.roiPercentage || 0}%

Thank you for using our ROI Calculator.
  `

  const result = await sendEmail({
    to: email,
    subject: "Your ROI Calculator Results",
    text: textContent,
    html: htmlContent,
  })

  if (result.success) {
    await supabase.from("verification_codes").update({ verified: true }).eq("email", email).eq("code", verificationCode)
  }

  return result
}

export async function generateVerificationCode(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const supabase = await createClient()

  await supabase.from("verification_codes").delete().eq("email", email)

  const { error } = await supabase.from("verification_codes").insert({
    email,
    code,
    created_at: new Date().toISOString(),
    verified: false,
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
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .code { font-size: 32px; font-weight: bold; text-align: center; margin: 30px 0; color: #4F46E5; letter-spacing: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Your Verification Code</h1>
        </div>
        <div class="content">
          <p>Your verification code is:</p>
          <div class="code">${code}</div>
          <p>This code will expire in 10 minutes.</p>
        </div>
      </body>
    </html>
  `

  const textContent = `
Your verification code is: ${code}

This code will expire in 10 minutes.
  `

  const result = await sendEmail({
    to: email,
    subject: "Your Verification Code",
    text: textContent,
    html: htmlContent,
  })

  return result
}

export async function verifyCode(email: string, code: string) {
  const supabase = await createClient()

  const { data: verification, error } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .eq("verified", false)
    .single()

  if (error || !verification) {
    await supabase
      .from("verification_codes")
      .update({ attempts: (verification?.attempts || 0) + 1 })
      .eq("email", email)
      .eq("code", code)

    return { success: false, message: "Invalid verification code" }
  }

  const createdAt = new Date(verification.created_at)
  const now = new Date()
  const diffMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60

  if (diffMinutes > 10) {
    return { success: false, message: "Verification code has expired" }
  }

  return { success: true, message: "Code verified successfully" }
}
