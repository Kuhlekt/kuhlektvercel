"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIData {
  companyName: string
  email: string
  currentAR: number
  dso: number
  averageInvoiceValue: number
  monthlyInvoices: number
  collectionCosts: number
  badDebtPercentage: number
}

export async function sendROIReport(data: ROIData) {
  try {
    const improvementRate = 0.35
    const potentialSavings = data.currentAR * improvementRate
    const dsoReduction = data.dso * 0.3
    const newDSO = data.dso - dsoReduction

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .metric { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #2563eb; }
          .metric-label { font-weight: bold; color: #1f2937; }
          .metric-value { font-size: 24px; color: #2563eb; margin: 5px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your ROI Analysis Report</h1>
            <p>Prepared for ${data.companyName}</p>
          </div>
          <div class="content">
            <h2>Current Situation</h2>
            <div class="metric">
              <div class="metric-label">Current Accounts Receivable</div>
              <div class="metric-value">$${data.currentAR.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Days Sales Outstanding (DSO)</div>
              <div class="metric-value">${data.dso} days</div>
            </div>
            
            <h2>Projected Improvements with Kuhlekt</h2>
            <div class="metric">
              <div class="metric-label">Potential Annual Savings</div>
              <div class="metric-value">$${potentialSavings.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Projected New DSO</div>
              <div class="metric-value">${Math.round(newDSO)} days</div>
            </div>
            <div class="metric">
              <div class="metric-label">DSO Reduction</div>
              <div class="metric-value">${Math.round(dsoReduction)} days (${Math.round((dsoReduction / data.dso) * 100)}%)</div>
            </div>
          </div>
          <div class="footer">
            <p>This analysis is based on the information you provided and industry benchmarks.</p>
            <p>Ready to see these improvements in action? Contact us for a personalized demo.</p>
            <p>&copy; 2025 Kuhlekt. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
ROI Analysis Report for ${data.companyName}

Current Situation:
- Current AR: $${data.currentAR.toLocaleString()}
- DSO: ${data.dso} days

Projected Improvements:
- Potential Annual Savings: $${potentialSavings.toLocaleString()}
- New DSO: ${Math.round(newDSO)} days
- DSO Reduction: ${Math.round(dsoReduction)} days
    `

    const result = await sendEmail({
      to: data.email,
      subject: `Your ROI Analysis Report - ${data.companyName}`,
      text,
      html,
    })

    return result
  } catch (error) {
    console.error("Error in sendROIReport:", error)
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
      }
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .code-box { background: #f3f4f6; border: 2px dashed #2563eb; padding: 30px; text-align: center; margin: 20px 0; }
          .code { font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 5px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div style="padding: 20px;">
            <p>Your verification code is:</p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Kuhlekt. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
      html,
    })

    return emailResult
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      message: "Failed to generate verification code",
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
      return {
        success: false,
        message: "Invalid verification code",
      }
    }

    if (new Date(data.expires_at) < new Date()) {
      await supabase.from("verification_codes").delete().eq("email", email)
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "Failed to verify code",
    }
  }
}
