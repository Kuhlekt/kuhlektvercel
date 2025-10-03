"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIData {
  annualRevenue: number
  averageInvoiceValue: number
  paymentTerms: number
  currentDSO: number
  industryBenchmarkDSO: number
}

export async function sendROIReport(email: string, roiData: ROIData) {
  try {
    const cashFlowImprovement = (roiData.annualRevenue / 365) * (roiData.currentDSO - roiData.industryBenchmarkDSO)
    const interestSavings = cashFlowImprovement * 0.05
    const annualSavings = interestSavings + roiData.annualRevenue * 0.02

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .metric { margin: 15px 0; padding: 15px; background: white; border-radius: 8px; }
            .metric-label { font-size: 14px; color: #6b7280; }
            .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis Report</h1>
            </div>
            <div class="content">
              <p>Thank you for using the Kuhlekt ROI Calculator. Here's your personalized analysis:</p>
              
              <div class="metric">
                <div class="metric-label">Potential Cash Flow Improvement</div>
                <div class="metric-value">$${cashFlowImprovement.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Estimated Annual Savings</div>
                <div class="metric-value">$${annualSavings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Current DSO</div>
                <div class="metric-value">${roiData.currentDSO} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Target DSO</div>
                <div class="metric-value">${roiData.industryBenchmarkDSO} days</div>
              </div>
              
              <p style="margin-top: 30px;">Ready to unlock these savings? <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo">Schedule a demo</a> to see how Kuhlekt can transform your accounts receivable management.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
Your ROI Analysis Report

Potential Cash Flow Improvement: $${cashFlowImprovement.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Estimated Annual Savings: $${annualSavings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Current DSO: ${roiData.currentDSO} days
Target DSO: ${roiData.industryBenchmarkDSO} days

Ready to unlock these savings? Visit ${process.env.NEXT_PUBLIC_SITE_URL}/demo to schedule a demo.
    `

    const result = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Analysis Report",
      text: textContent,
      html: htmlContent,
    })

    return result
  } catch (error) {
    console.error("Error sending ROI report:", error)
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

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .code { font-size: 32px; font-weight: bold; color: #2563eb; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; letter-spacing: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <p>Please use the following code to verify your email address:</p>
              <div class="code">${code}</div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
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
    `

    const emailResult = await sendEmail({
      to: email,
      subject: "Verify Your Email - Kuhlekt ROI Calculator",
      text: textContent,
      html: htmlContent,
    })

    return emailResult
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
      return {
        success: false,
        message: "Invalid verification code",
      }
    }

    if (new Date(data.expires_at) < new Date()) {
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many failed attempts",
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
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
