"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIData {
  companyName: string
  email: string
  currentAR: number
  avgInvoiceValue: number
  avgDSO: number
  collectionCosts: number
}

export async function sendROIReport(data: ROIData) {
  try {
    const currentCollectionRate = 100 - (data.collectionCosts / data.currentAR) * 100
    const projectedDSO = Math.max(data.avgDSO * 0.6, 15)
    const projectedCollectionRate = Math.min(currentCollectionRate * 1.25, 98)
    const annualSavings = data.collectionCosts * 0.4
    const cashFlowImprovement = (data.currentAR * (data.avgDSO - projectedDSO)) / data.avgDSO

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .metric { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #4F46E5; }
            .metric-label { font-weight: bold; color: #4F46E5; }
            .metric-value { font-size: 24px; color: #1a1a1a; margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis Report</h1>
            </div>
            <div class="content">
              <p>Dear ${data.companyName},</p>
              <p>Thank you for using our ROI Calculator. Here's your personalized analysis:</p>
              
              <div class="metric">
                <div class="metric-label">Current DSO</div>
                <div class="metric-value">${data.avgDSO.toFixed(0)} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Projected DSO with Kuhlekt</div>
                <div class="metric-value">${projectedDSO.toFixed(0)} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Annual Savings</div>
                <div class="metric-value">$${annualSavings.toLocaleString()}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Cash Flow Improvement</div>
                <div class="metric-value">$${cashFlowImprovement.toLocaleString()}</div>
              </div>
              
              <p style="margin-top: 20px;">Ready to achieve these results? Schedule a demo with our team to see Kuhlekt in action.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
      Your ROI Analysis Report
      
      Dear ${data.companyName},
      
      Current DSO: ${data.avgDSO.toFixed(0)} days
      Projected DSO: ${projectedDSO.toFixed(0)} days
      Annual Savings: $${annualSavings.toLocaleString()}
      Cash Flow Improvement: $${cashFlowImprovement.toLocaleString()}
    `

    const result = await sendEmail({
      to: data.email,
      subject: "Your Kuhlekt ROI Analysis Report",
      text: emailText,
      html: emailHtml,
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
      console.error("Error inserting verification code:", insertError)
      return {
        success: false,
        message: "Failed to generate verification code",
        error: insertError.message,
      }
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .code { font-size: 32px; font-weight: bold; text-align: center; padding: 20px; background: #f0f0f0; margin: 20px 0; letter-spacing: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <p>Your verification code is:</p>
            <div class="code">${code}</div>
            <p>This code will expire in 10 minutes.</p>
          </div>
        </body>
      </html>
    `

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt Verification Code",
      text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
      html: emailHtml,
    })

    if (!emailResult.success) {
      return emailResult
    }

    return {
      success: true,
      message: "Verification code sent successfully",
    }
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
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

    const { data, error } = await supabase.from("verification_codes").select("*").eq("email", email).single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid or expired verification code",
      }
    }

    if (data.attempts >= 3) {
      await supabase.from("verification_codes").delete().eq("email", email)
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    if (new Date(data.expires_at) < new Date()) {
      await supabase.from("verification_codes").delete().eq("email", email)
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    if (data.code !== code) {
      await supabase
        .from("verification_codes")
        .update({ attempts: data.attempts + 1 })
        .eq("email", email)

      return {
        success: false,
        message: "Invalid verification code",
      }
    }

    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "Failed to verify code",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
