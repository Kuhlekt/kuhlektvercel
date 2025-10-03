"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(email: string, reportData: any) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .metric { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #4f46e5; }
            .metric-label { font-weight: bold; color: #6b7280; }
            .metric-value { font-size: 24px; color: #4f46e5; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Kuhlekt ROI Report</h1>
            </div>
            <div class="content">
              <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
              
              <div class="metric">
                <div class="metric-label">Current Annual Revenue</div>
                <div class="metric-value">$${reportData.currentRevenue?.toLocaleString()}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Current DSO</div>
                <div class="metric-value">${reportData.currentDSO} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Potential DSO Reduction</div>
                <div class="metric-value">${reportData.dsoReduction} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Annual Cash Flow Improvement</div>
                <div class="metric-value">$${reportData.cashFlowImprovement?.toLocaleString()}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">ROI Timeline</div>
                <div class="metric-value">${reportData.roiTimeline} months</div>
              </div>
              
              <p style="margin-top: 30px;">Ready to unlock these savings? Contact us to learn more about Kuhlekt.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
Your Kuhlekt ROI Report

Current Annual Revenue: $${reportData.currentRevenue?.toLocaleString()}
Current DSO: ${reportData.currentDSO} days
Potential DSO Reduction: ${reportData.dsoReduction} days
Annual Cash Flow Improvement: $${reportData.cashFlowImprovement?.toLocaleString()}
ROI Timeline: ${reportData.roiTimeline} months

Ready to unlock these savings? Contact us to learn more about Kuhlekt.
    `

    const result = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Report",
      text,
      html,
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

export async function generateVerificationCode(email: string) {
  try {
    const supabase = await createClient()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const { error: deleteError } = await supabase.from("verification_codes").delete().eq("email", email)

    if (deleteError) {
      console.error("Error deleting old codes:", deleteError)
    }

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (insertError) {
      throw insertError
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .code { font-size: 32px; font-weight: bold; color: #4f46e5; text-align: center; padding: 20px; background: white; margin: 20px 0; letter-spacing: 5px; }
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
          </div>
        </body>
      </html>
    `

    const text = `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt Verification Code",
      text,
      html,
    })

    if (!emailResult.success) {
      return { success: false, message: "Failed to send verification email" }
    }

    return { success: true, message: "Verification code sent" }
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
      .single()

    if (error || !data) {
      const { error: updateError } = await supabase
        .from("verification_codes")
        .update({ attempts: supabase.rpc("increment_attempts", { email_param: email }) })
        .eq("email", email)

      return { success: false, message: "Invalid verification code" }
    }

    if (new Date(data.expires_at) < new Date()) {
      await supabase.from("verification_codes").delete().eq("email", email)
      return { success: false, message: "Verification code has expired" }
    }

    if (data.attempts >= 3) {
      await supabase.from("verification_codes").delete().eq("email", email)
      return { success: false, message: "Too many attempts. Please request a new code." }
    }

    await supabase.from("verification_codes").delete().eq("email", email)

    return { success: true, message: "Email verified successfully" }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "Failed to verify code",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
