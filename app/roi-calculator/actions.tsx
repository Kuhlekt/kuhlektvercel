"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIInputs {
  email: string
  companyName: string
  annualRevenue: number
  averageInvoiceValue: number
  numberOfInvoices: number
  averageDSO: number
  collectionCosts: number
  badDebtPercentage: number
}

export async function sendROIReport(inputs: ROIInputs, reportData: any) {
  try {
    const subject = `ROI Analysis Report for ${inputs.companyName}`
    const text = `Thank you for using our ROI Calculator. Please see your detailed analysis attached.`
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .metrics { margin: 20px 0; }
            .metric { background-color: #f3f4f6; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .metric-label { font-weight: bold; color: #4f46e5; }
            .metric-value { font-size: 24px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Your ROI Analysis Report</h1>
            <p>${inputs.companyName}</p>
          </div>
          <div class="content">
            <h2>Summary</h2>
            <div class="metrics">
              <div class="metric">
                <div class="metric-label">Potential Annual Savings</div>
                <div class="metric-value">$${reportData.savings?.toLocaleString() || "0"}</div>
              </div>
              <div class="metric">
                <div class="metric-label">DSO Improvement</div>
                <div class="metric-value">${reportData.dsoReduction || "0"} days</div>
              </div>
              <div class="metric">
                <div class="metric-label">ROI</div>
                <div class="metric-value">${reportData.roi || "0"}%</div>
              </div>
            </div>
            <p>Thank you for using our ROI Calculator. Contact us to learn more about how we can help optimize your accounts receivable process.</p>
          </div>
        </body>
      </html>
    `

    const result = await sendEmail({
      to: inputs.email,
      subject,
      text,
      html,
    })

    return result
  } catch (error) {
    console.error("Error in sendROIReport:", error)
    return {
      success: false,
      message: "Failed to send report",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function generateVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (insertError) {
      console.error("Error inserting verification code:", insertError)
      return { success: false, message: "Failed to generate verification code" }
    }

    const subject = "Your Verification Code"
    const text = `Your verification code is: ${code}. This code will expire in 10 minutes.`
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .code-box { background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; letter-spacing: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Your Verification Code</h2>
            <p>Use the following code to verify your email address:</p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        </body>
      </html>
    `

    const emailResult = await sendEmail({ to: email, subject, text, html })

    if (!emailResult.success) {
      return { success: false, message: "Failed to send verification email" }
    }

    return { success: true, message: "Verification code sent successfully" }
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
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
      return { success: false, message: "Verification code has expired" }
    }

    if (data.attempts >= 3) {
      return { success: false, message: "Too many attempts. Please request a new code" }
    }

    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ attempts: data.attempts + 1 })
      .eq("id", data.id)

    if (updateError) {
      console.error("Error updating attempts:", updateError)
    }

    return { success: true, message: "Verification successful" }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return { success: false, message: "Verification failed" }
  }
}
