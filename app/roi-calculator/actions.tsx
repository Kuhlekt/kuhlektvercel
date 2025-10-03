"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIInputs {
  monthlyInvoices: number
  averageInvoiceValue: number
  averagePaymentDays: number
  staffHoursPerMonth: number
  hourlyRate: number
}

interface ROIResults {
  annualRevenue: number
  currentDSO: number
  projectedDSO: number
  dsoImprovement: number
  cashFlowImprovement: number
  timesSavings: number
  costSavings: number
  totalAnnualBenefit: number
  roi: number
  paybackPeriod: number
}

export async function sendROIReport(email: string, inputs: ROIInputs, results: ROIResults) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .metric { margin: 15px 0; padding: 15px; background-color: white; border-radius: 5px; }
            .metric-label { font-weight: bold; color: #666; }
            .metric-value { font-size: 24px; color: #0066cc; margin-top: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Calculator Results</h1>
            </div>
            <div class="content">
              <h2>Your Inputs</h2>
              <div class="metric">
                <div class="metric-label">Monthly Invoices</div>
                <div class="metric-value">${inputs.monthlyInvoices.toLocaleString()}</div>
              </div>
              <div class="metric">
                <div class="metric-label">Average Invoice Value</div>
                <div class="metric-value">$${inputs.averageInvoiceValue.toLocaleString()}</div>
              </div>
              <div class="metric">
                <div class="metric-label">Current Payment Days</div>
                <div class="metric-value">${inputs.averagePaymentDays} days</div>
              </div>
              
              <h2>Your Results</h2>
              <div class="metric">
                <div class="metric-label">DSO Improvement</div>
                <div class="metric-value">${results.dsoImprovement.toFixed(1)} days</div>
              </div>
              <div class="metric">
                <div class="metric-label">Cash Flow Improvement</div>
                <div class="metric-value">$${results.cashFlowImprovement.toLocaleString()}</div>
              </div>
              <div class="metric">
                <div class="metric-label">Annual Time Savings</div>
                <div class="metric-value">${results.timesSavings.toLocaleString()} hours</div>
              </div>
              <div class="metric">
                <div class="metric-label">Total Annual Benefit</div>
                <div class="metric-value">$${results.totalAnnualBenefit.toLocaleString()}</div>
              </div>
              <div class="metric">
                <div class="metric-label">ROI</div>
                <div class="metric-value">${results.roi.toFixed(0)}%</div>
              </div>
              <div class="metric">
                <div class="metric-label">Payback Period</div>
                <div class="metric-value">${results.paybackPeriod.toFixed(1)} months</div>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for using the Kuhlekt ROI Calculator</p>
              <p>Contact us to learn more about how we can help improve your receivables management</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
Your ROI Calculator Results

Your Inputs:
- Monthly Invoices: ${inputs.monthlyInvoices.toLocaleString()}
- Average Invoice Value: $${inputs.averageInvoiceValue.toLocaleString()}
- Current Payment Days: ${inputs.averagePaymentDays} days

Your Results:
- DSO Improvement: ${results.dsoImprovement.toFixed(1)} days
- Cash Flow Improvement: $${results.cashFlowImprovement.toLocaleString()}
- Annual Time Savings: ${results.timesSavings.toLocaleString()} hours
- Total Annual Benefit: $${results.totalAnnualBenefit.toLocaleString()}
- ROI: ${results.roi.toFixed(0)}%
- Payback Period: ${results.paybackPeriod.toFixed(1)} months

Thank you for using the Kuhlekt ROI Calculator
    `

    const result = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Results - Kuhlekt",
      text: textContent,
      html: htmlContent,
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

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Verification Code - Kuhlekt ROI Calculator",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto;">
              <h2>Your Verification Code</h2>
              <p>Please use the following code to verify your email:</p>
              <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                ${code}
              </div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
          </body>
        </html>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification email",
      }
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
    }
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
      const { error: updateError } = await supabase
        .from("verification_codes")
        .update({ attempts: supabase.rpc("increment_attempts") })
        .eq("email", email)

      if (updateError) {
        console.error("Error updating attempts:", updateError)
      }

      return {
        success: false,
        message: "Invalid verification code",
      }
    }

    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many attempts. Please request a new code",
      }
    }

    const { error: deleteError } = await supabase.from("verification_codes").delete().eq("email", email)

    if (deleteError) {
      console.error("Error deleting verification code:", deleteError)
    }

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "Failed to verify code",
    }
  }
}
