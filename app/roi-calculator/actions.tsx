"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIData {
  companyName: string
  email: string
  annualRevenue: number
  invoiceVolume: number
  currentDSO: number
  targetDSO: number
  collectionCosts: number
}

export async function sendROIReport(data: ROIData) {
  try {
    const calculations = {
      dsoReduction: data.currentDSO - data.targetDSO,
      cashFlowImprovement: (data.annualRevenue / 365) * (data.currentDSO - data.targetDSO),
      costSavings: data.collectionCosts * 0.3,
      totalBenefit: 0,
    }

    calculations.totalBenefit = calculations.cashFlowImprovement + calculations.costSavings

    const htmlContent = `
      <html>
        <body>
          <h1>Your ROI Analysis Report</h1>
          <p>Thank you for your interest in Kuhlekt!</p>
          <h2>Your Results:</h2>
          <ul>
            <li>DSO Reduction: ${calculations.dsoReduction} days</li>
            <li>Cash Flow Improvement: $${calculations.cashFlowImprovement.toLocaleString()}</li>
            <li>Cost Savings: $${calculations.costSavings.toLocaleString()}</li>
            <li>Total Annual Benefit: $${calculations.totalBenefit.toLocaleString()}</li>
          </ul>
        </body>
      </html>
    `

    const textContent = `
      Your ROI Analysis Report
      
      Thank you for your interest in Kuhlekt!
      
      Your Results:
      - DSO Reduction: ${calculations.dsoReduction} days
      - Cash Flow Improvement: $${calculations.cashFlowImprovement.toLocaleString()}
      - Cost Savings: $${calculations.costSavings.toLocaleString()}
      - Total Annual Benefit: $${calculations.totalBenefit.toLocaleString()}
    `

    const result = await sendEmail({
      to: data.email,
      subject: "Your Kuhlekt ROI Analysis Report",
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

export async function generateVerificationCode(email: string) {
  try {
    const supabase = await createClient()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: deleteError } = await supabase.from("verification_codes").delete().eq("email", email)

    if (deleteError) {
      console.error("Error deleting old codes:", deleteError)
    }

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt,
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
      subject: "Your Kuhlekt Verification Code",
      text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
      html: `<p>Your verification code is: <strong>${code}</strong></p><p>This code will expire in 10 minutes.</p>`,
    })

    if (!emailResult.success) {
      return emailResult
    }

    return {
      success: true,
      message: "Verification code sent",
    }
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

    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ attempts: data.attempts + 1 })
      .eq("email", email)
      .eq("code", code)

    if (updateError) {
      console.error("Error updating attempts:", updateError)
    }

    return {
      success: true,
      message: "Code verified successfully",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "Failed to verify code",
    }
  }
}
