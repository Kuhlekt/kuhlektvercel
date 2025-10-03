"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIInputs {
  monthlyInvoices: number
  averageInvoiceValue: number
  currentDSO: number
  industryAverageDSO: number
  monthlyARCost: number
  badDebtRate: number
}

interface ROIResults {
  currentAnnualRevenue: number
  potentialAnnualRevenue: number
  revenueIncrease: number
  cashFlowImprovement: number
  costSavings: number
  badDebtReduction: number
  totalAnnualBenefit: number
  implementationROI: number
  paybackPeriod: number
}

export async function calculateROI(inputs: ROIInputs): Promise<ROIResults> {
  const monthlyRevenue = inputs.monthlyInvoices * inputs.averageInvoiceValue
  const annualRevenue = monthlyRevenue * 12

  const dsoReduction = inputs.currentDSO - inputs.industryAverageDSO
  const dsoImprovementPercent = dsoReduction / inputs.currentDSO

  const cashFlowImprovement = annualRevenue * (dsoImprovementPercent * 0.5)
  const revenueIncrease = annualRevenue * (dsoImprovementPercent * 0.3)
  const costSavings = inputs.monthlyARCost * 12 * 0.6
  const badDebtReduction = annualRevenue * (inputs.badDebtRate / 100) * 0.4

  const totalAnnualBenefit = cashFlowImprovement + revenueIncrease + costSavings + badDebtReduction

  const estimatedImplementationCost = 50000
  const implementationROI = (totalAnnualBenefit / estimatedImplementationCost) * 100
  const paybackPeriod = estimatedImplementationCost / (totalAnnualBenefit / 12)

  return {
    currentAnnualRevenue: annualRevenue,
    potentialAnnualRevenue: annualRevenue + revenueIncrease,
    revenueIncrease,
    cashFlowImprovement,
    costSavings,
    badDebtReduction,
    totalAnnualBenefit,
    implementationROI,
    paybackPeriod,
  }
}

export async function sendROIReport(email: string, inputs: ROIInputs, results: ROIResults) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .metric { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #0066cc; }
          .metric-label { font-weight: bold; color: #666; }
          .metric-value { font-size: 24px; color: #0066cc; margin-top: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your ROI Analysis Report</h1>
          </div>
          <div class="content">
            <h2>Input Parameters</h2>
            <div class="metric">
              <div class="metric-label">Monthly Invoices</div>
              <div class="metric-value">${inputs.monthlyInvoices}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Average Invoice Value</div>
              <div class="metric-value">$${inputs.averageInvoiceValue.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Current DSO</div>
              <div class="metric-value">${inputs.currentDSO} days</div>
            </div>
            
            <h2>Results</h2>
            <div class="metric">
              <div class="metric-label">Total Annual Benefit</div>
              <div class="metric-value">$${results.totalAnnualBenefit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Cash Flow Improvement</div>
              <div class="metric-value">$${results.cashFlowImprovement.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Revenue Increase</div>
              <div class="metric-value">$${results.revenueIncrease.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Implementation ROI</div>
              <div class="metric-value">${results.implementationROI.toFixed(1)}%</div>
            </div>
            <div class="metric">
              <div class="metric-label">Payback Period</div>
              <div class="metric-value">${results.paybackPeriod.toFixed(1)} months</div>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for using Kuhlekt ROI Calculator</p>
            <p>Contact us at info@kuhlekt.com for more information</p>
          </div>
        </div>
      </body>
    </html>
  `

  const emailText = `
Your ROI Analysis Report

Input Parameters:
- Monthly Invoices: ${inputs.monthlyInvoices}
- Average Invoice Value: $${inputs.averageInvoiceValue}
- Current DSO: ${inputs.currentDSO} days

Results:
- Total Annual Benefit: $${results.totalAnnualBenefit.toLocaleString()}
- Cash Flow Improvement: $${results.cashFlowImprovement.toLocaleString()}
- Revenue Increase: $${results.revenueIncrease.toLocaleString()}
- Implementation ROI: ${results.implementationROI.toFixed(1)}%
- Payback Period: ${results.paybackPeriod.toFixed(1)} months
  `

  return await sendEmail({
    to: email,
    subject: "Your Kuhlekt ROI Analysis Report",
    text: emailText,
    html: emailHtml,
  })
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
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
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
      message: "An error occurred while generating verification code",
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
        message: "Too many attempts. Please request a new code.",
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
      message: "An error occurred during verification",
    }
  }
}
