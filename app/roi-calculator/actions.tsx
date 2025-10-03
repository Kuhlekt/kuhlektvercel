"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROICalculation {
  companyName: string
  email: string
  annualRevenue: number
  averageInvoiceValue: number
  invoicesPerMonth: number
  currentDSO: number
  desiredDSO: number
  employeesInAR: number
  hoursPerWeek: number
  hourlyRate: number
  badDebtPercentage: number
  cashFlowImprovement: number
  laborCostSavings: number
  badDebtReduction: number
  totalAnnualSavings: number
  roi: number
  paybackPeriod: number
}

export async function sendROIReport(calculation: ROICalculation) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .metric { background-color: #f3f4f6; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .metric-label { font-weight: bold; color: #1e40af; }
            .metric-value { font-size: 1.2em; color: #059669; }
            .footer { background-color: #f3f4f6; padding: 20px; text-align: center; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Your ROI Analysis Report</h1>
            <p>${calculation.companyName}</p>
          </div>
          <div class="content">
            <h2>Key Findings</h2>
            <div class="metric">
              <div class="metric-label">Total Annual Savings</div>
              <div class="metric-value">$${calculation.totalAnnualSavings.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Return on Investment</div>
              <div class="metric-value">${calculation.roi.toFixed(0)}%</div>
            </div>
            <div class="metric">
              <div class="metric-label">Payback Period</div>
              <div class="metric-value">${calculation.paybackPeriod.toFixed(1)} months</div>
            </div>
            <h3>Detailed Breakdown</h3>
            <div class="metric">
              <div class="metric-label">Cash Flow Improvement</div>
              <div class="metric-value">$${calculation.cashFlowImprovement.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Labor Cost Savings</div>
              <div class="metric-value">$${calculation.laborCostSavings.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Bad Debt Reduction</div>
              <div class="metric-value">$${calculation.badDebtReduction.toLocaleString()}</div>
            </div>
          </div>
          <div class="footer">
            <p>Ready to achieve these results? Contact us to learn more about Kuhlekt.</p>
            <p><a href="https://kuhlekt.com">Visit our website</a></p>
          </div>
        </body>
      </html>
    `

    const textContent = `
Your ROI Analysis Report - ${calculation.companyName}

Key Findings:
- Total Annual Savings: $${calculation.totalAnnualSavings.toLocaleString()}
- Return on Investment: ${calculation.roi.toFixed(0)}%
- Payback Period: ${calculation.paybackPeriod.toFixed(1)} months

Detailed Breakdown:
- Cash Flow Improvement: $${calculation.cashFlowImprovement.toLocaleString()}
- Labor Cost Savings: $${calculation.laborCostSavings.toLocaleString()}
- Bad Debt Reduction: $${calculation.badDebtReduction.toLocaleString()}

Ready to achieve these results? Contact us to learn more about Kuhlekt.
Visit our website: https://kuhlekt.com
    `

    const result = await sendEmail({
      to: calculation.email,
      subject: `Your ROI Analysis Report - ${calculation.companyName}`,
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

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
            .code { font-size: 32px; font-weight: bold; color: #1e40af; text-align: center; padding: 20px; background-color: white; border-radius: 5px; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verification Code</h1>
            </div>
            <div class="content">
              <p>Your verification code for accessing your ROI report is:</p>
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
Your verification code for accessing your ROI report is: ${code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

© 2025 Kuhlekt. All rights reserved.
    `

    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Report Verification Code",
      text: textContent,
      html: htmlContent,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification code",
        error: emailResult.error,
      }
    }

    return {
      success: true,
      message: "Verification code sent successfully",
    }
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
      await supabase.from("verification_codes").delete().eq("email", email)
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    if (data.attempts >= 3) {
      await supabase.from("verification_codes").delete().eq("email", email)
      return {
        success: false,
        message: "Too many failed attempts",
      }
    }

    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Verification successful",
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
