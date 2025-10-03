"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIData {
  companyName: string
  email: string
  annualRevenue: number
  currentDSO: number
  targetDSO: number
  badDebtRate: number
}

export async function sendROIReport(data: ROIData) {
  try {
    const savingsPercentage = ((data.currentDSO - data.targetDSO) / data.currentDSO) * 100
    const cashFlowImprovement = (data.annualRevenue / 365) * (data.currentDSO - data.targetDSO)
    const badDebtReduction = data.annualRevenue * (data.badDebtRate / 100) * 0.5

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .metric { margin: 15px 0; padding: 15px; background-color: white; border-left: 4px solid #4F46E5; }
            .metric-label { font-weight: bold; color: #4F46E5; }
            .metric-value { font-size: 24px; color: #1a1a1a; margin-top: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis</h1>
              <p>${data.companyName}</p>
            </div>
            <div class="content">
              <h2>Potential Savings Analysis</h2>
              <div class="metric">
                <div class="metric-label">DSO Reduction</div>
                <div class="metric-value">${savingsPercentage.toFixed(1)}%</div>
                <p>From ${data.currentDSO} to ${data.targetDSO} days</p>
              </div>
              <div class="metric">
                <div class="metric-label">Cash Flow Improvement</div>
                <div class="metric-value">$${cashFlowImprovement.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
                <p>Annual improvement in working capital</p>
              </div>
              <div class="metric">
                <div class="metric-label">Bad Debt Reduction</div>
                <div class="metric-value">$${badDebtReduction.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
                <p>Estimated 50% reduction in bad debt</p>
              </div>
            </div>
            <div class="footer">
              <p>Ready to achieve these results?</p>
              <p>Contact us to schedule a personalized demo.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
Your ROI Analysis - ${data.companyName}

Potential Savings Analysis:

DSO Reduction: ${savingsPercentage.toFixed(1)}%
From ${data.currentDSO} to ${data.targetDSO} days

Cash Flow Improvement: $${cashFlowImprovement.toLocaleString("en-US", { maximumFractionDigits: 0 })}
Annual improvement in working capital

Bad Debt Reduction: $${badDebtReduction.toLocaleString("en-US", { maximumFractionDigits: 0 })}
Estimated 50% reduction in bad debt

Ready to achieve these results?
Contact us to schedule a personalized demo.
    `

    const result = await sendEmail({
      to: data.email,
      subject: `Your ROI Analysis - ${data.companyName}`,
      text: textContent,
      html: htmlContent,
    })

    if (!result.success) {
      throw new Error(result.error || "Failed to send email")
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI report:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send report",
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
      throw insertError
    }

    const result = await sendEmail({
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}

This code will expire in 10 minutes.`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .code { font-size: 32px; font-weight: bold; color: #4F46E5; text-align: center; padding: 20px; background-color: #f3f4f6; border-radius: 8px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Your Verification Code</h2>
              <div class="code">${code}</div>
              <p>This code will expire in 10 minutes.</p>
            </div>
          </body>
        </html>
      `,
    })

    if (!result.success) {
      throw new Error(result.error || "Failed to send verification email")
    }

    return { success: true }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate code",
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
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !data) {
      return { success: false, error: "Invalid or expired code" }
    }

    if (data.attempts >= 3) {
      return { success: false, error: "Too many attempts" }
    }

    await supabase
      .from("verification_codes")
      .update({ attempts: data.attempts + 1 })
      .eq("id", data.id)

    if (data.code === code) {
      await supabase.from("verification_codes").delete().eq("id", data.id)
      return { success: true }
    }

    return { success: false, error: "Invalid code" }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Verification failed",
    }
  }
}
