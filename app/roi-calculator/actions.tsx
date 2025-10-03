"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIData {
  companyName: string
  email: string
  annualRevenue: number
  currentDSO: number
  industryAverage: number
  badDebtPercentage: number
  arStaffCount: number
  avgSalary: number
}

export async function sendROIReport(data: ROIData) {
  try {
    const projectedDSO = Math.max(data.currentDSO * 0.7, 25)
    const dsoReduction = data.currentDSO - projectedDSO
    const cashFlowImprovement = (data.annualRevenue / 365) * dsoReduction
    const badDebtReduction = ((data.annualRevenue * data.badDebtPercentage) / 100) * 0.5
    const staffEfficiency = data.arStaffCount * data.avgSalary * 0.3
    const totalAnnualSavings = cashFlowImprovement + badDebtReduction + staffEfficiency

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .metric { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; }
            .metric-label { font-size: 14px; color: #6b7280; }
            .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis</h1>
            </div>
            <div class="content">
              <h2>Hello ${data.companyName},</h2>
              <p>Thank you for using our ROI Calculator. Here are your results:</p>
              
              <div class="metric">
                <div class="metric-label">Projected DSO Reduction</div>
                <div class="metric-value">${dsoReduction.toFixed(1)} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Cash Flow Improvement</div>
                <div class="metric-value">$${cashFlowImprovement.toLocaleString()}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Bad Debt Reduction</div>
                <div class="metric-value">$${badDebtReduction.toLocaleString()}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Staff Efficiency Gains</div>
                <div class="metric-value">$${staffEfficiency.toLocaleString()}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Total Annual Savings</div>
                <div class="metric-value">$${totalAnnualSavings.toLocaleString()}</div>
              </div>
              
              <p>These projections are based on industry benchmarks and typical results from our platform.</p>
              <p>Ready to achieve these results? Contact us to schedule a demo.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
Your ROI Analysis - ${data.companyName}

Thank you for using our ROI Calculator. Here are your results:

Projected DSO Reduction: ${dsoReduction.toFixed(1)} days
Cash Flow Improvement: $${cashFlowImprovement.toLocaleString()}
Bad Debt Reduction: $${badDebtReduction.toLocaleString()}
Staff Efficiency Gains: $${staffEfficiency.toLocaleString()}
Total Annual Savings: $${totalAnnualSavings.toLocaleString()}

These projections are based on industry benchmarks and typical results from our platform.
Ready to achieve these results? Contact us to schedule a demo.
    `

    const result = await sendEmail({
      to: data.email,
      subject: `Your ROI Analysis - ${data.companyName}`,
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

    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (error) {
      console.error("Error storing verification code:", error)
      return {
        success: false,
        message: "Failed to generate verification code",
        error: error.message,
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
            .code { font-size: 32px; font-weight: bold; color: #2563eb; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; }
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

    const textContent = `
Your verification code is: ${code}

This code will expire in 10 minutes.
If you didn't request this code, please ignore this email.
    `

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Verification Code",
      text: textContent,
      html: htmlContent,
    })

    return emailResult
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
        message: "Too many attempts. Please request a new code.",
      }
    }

    await supabase.from("verification_codes").delete().eq("email", email).eq("code", code)

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
