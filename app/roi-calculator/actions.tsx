"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIFormData {
  email: string
  annualRevenue: number
  invoiceVolume: number
  averageInvoiceValue: number
  currentDSO: number
  averageCollectionCosts: number
}

export async function sendROIReport(formData: ROIFormData) {
  try {
    const calculations = calculateROI(formData)

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .metric { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .metric-label { font-size: 14px; color: #666; margin-bottom: 5px; }
            .metric-value { font-size: 28px; font-weight: bold; color: #667eea; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis Report</h1>
              <p>Powered by Kuhlekt</p>
            </div>
            <div class="content">
              <h2>Your Results</h2>
              <div class="metric">
                <div class="metric-label">Annual Savings</div>
                <div class="metric-value">$${calculations.annualSavings.toLocaleString()}</div>
              </div>
              <div class="metric">
                <div class="metric-label">DSO Improvement</div>
                <div class="metric-value">${calculations.dsoImprovement} days</div>
              </div>
              <div class="metric">
                <div class="metric-label">ROI Percentage</div>
                <div class="metric-value">${calculations.roiPercentage}%</div>
              </div>
              <div class="metric">
                <div class="metric-label">Payback Period</div>
                <div class="metric-value">${calculations.paybackPeriod} months</div>
              </div>
              <p style="margin-top: 30px;">
                Ready to transform your accounts receivable process? 
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="color: #667eea; text-decoration: none; font-weight: bold;">Schedule a demo</a> 
                to see Kuhlekt in action.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
Your ROI Analysis Report

Annual Savings: $${calculations.annualSavings.toLocaleString()}
DSO Improvement: ${calculations.dsoImprovement} days
ROI Percentage: ${calculations.roiPercentage}%
Payback Period: ${calculations.paybackPeriod} months

Ready to transform your accounts receivable process? Visit ${process.env.NEXT_PUBLIC_SITE_URL}/demo to schedule a demo.
    `

    const result = await sendEmail({
      to: formData.email,
      subject: "Your Kuhlekt ROI Analysis Report",
      text: emailText,
      html: emailHtml,
    })

    if (!result.success) {
      throw new Error(result.error || "Failed to send email")
    }

    return {
      success: true,
      message: "ROI report sent successfully",
      calculations,
    }
  } catch (error) {
    console.error("Error sending ROI report:", error)
    return {
      success: false,
      message: "Failed to send ROI report",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

function calculateROI(data: ROIFormData) {
  const targetDSO = Math.max(data.currentDSO * 0.6, 25)
  const dsoImprovement = Math.round(data.currentDSO - targetDSO)

  const currentCashCycle = (data.annualRevenue / 365) * data.currentDSO
  const improvedCashCycle = (data.annualRevenue / 365) * targetDSO
  const cashFlowImprovement = Math.round(currentCashCycle - improvedCashCycle)

  const collectionCostReduction = Math.round(data.averageCollectionCosts * 0.7)
  const annualSavings = Math.round(collectionCostReduction * 12)

  const estimatedAnnualCost = Math.round(data.annualRevenue * 0.015)
  const roiPercentage = Math.round(((annualSavings - estimatedAnnualCost) / estimatedAnnualCost) * 100)
  const paybackPeriod = Math.max(Math.round((estimatedAnnualCost / annualSavings) * 12), 1)

  return {
    dsoImprovement,
    cashFlowImprovement,
    annualSavings,
    roiPercentage,
    paybackPeriod,
    estimatedAnnualCost,
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
      throw new Error(`Database error: ${insertError.message}`)
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code { background: white; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .code-value { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verification Code</h1>
              <p>Your Kuhlekt ROI Calculator</p>
            </div>
            <div class="content">
              <p>Your verification code is:</p>
              <div class="code">
                <div class="code-value">${code}</div>
              </div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
Your Kuhlekt verification code is: ${code}

This code will expire in 10 minutes.

If you didn't request this code, you can safely ignore this email.
    `

    const result = await sendEmail({
      to: email,
      subject: "Your Kuhlekt Verification Code",
      text: emailText,
      html: emailHtml,
    })

    if (!result.success) {
      throw new Error(result.error || "Failed to send verification email")
    }

    return {
      success: true,
      message: "Verification code sent",
    }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      message: "Failed to send verification code",
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
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    await supabase
      .from("verification_codes")
      .update({ attempts: data.attempts + 1 })
      .eq("email", email)

    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "Verification failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
