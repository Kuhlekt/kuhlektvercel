"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string) {
  const supabase = await createClient()
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 10)

  const { error } = await supabase.from("verification_codes").insert({
    email,
    code,
    expires_at: expiresAt.toISOString(),
    attempts: 0,
  })

  if (error) {
    console.error("Error storing verification code:", error)
    throw new Error("Failed to store verification code")
  }
}

export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const code = generateVerificationCode()
    await storeVerificationCode(email, code)

    const result = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">
            Your verification code is:
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #999;">
            This code will expire in 10 minutes.
          </p>
        </div>
      `,
    })

    if (!result.success) {
      return {
        success: false,
        message: result.error || "Failed to send verification code",
      }
    }

    return {
      success: true,
      message: "Verification code sent successfully",
    }
  } catch (error) {
    console.error("Error in sendVerificationCode:", error)
    return {
      success: false,
      message: "Failed to send verification code. Please try again.",
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

    const now = new Date()
    const expiresAt = new Date(data.expires_at)

    if (now > expiresAt) {
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
      .eq("id", data.id)

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

export async function calculateSimpleROI(params: {
  monthlyInvoices: number
  averageInvoiceValue: number
  currentDSO: number
}): Promise<{
  annualRevenue: number
  potentialSavings: number
  timeRecovered: number
}> {
  const { monthlyInvoices, averageInvoiceValue, currentDSO } = params
  const annualRevenue = monthlyInvoices * averageInvoiceValue * 12
  const targetDSO = Math.max(currentDSO * 0.7, 30)
  const dsoReduction = currentDSO - targetDSO
  const potentialSavings = (annualRevenue * dsoReduction) / 365
  const timeRecovered = (monthlyInvoices * 12 * dsoReduction) / 365

  return {
    annualRevenue,
    potentialSavings,
    timeRecovered,
  }
}

export async function calculateDetailedROI(params: {
  monthlyInvoices: number
  averageInvoiceValue: number
  currentDSO: number
  teamSize: number
  hoursPerInvoice: number
  hourlyRate: number
}): Promise<{
  annualRevenue: number
  potentialSavings: number
  timeRecovered: number
  laborCostSavings: number
  cashFlowImprovement: number
  totalBenefit: number
}> {
  const { monthlyInvoices, averageInvoiceValue, currentDSO, teamSize, hoursPerInvoice, hourlyRate } = params

  const annualRevenue = monthlyInvoices * averageInvoiceValue * 12
  const targetDSO = Math.max(currentDSO * 0.7, 30)
  const dsoReduction = currentDSO - targetDSO
  const potentialSavings = (annualRevenue * dsoReduction) / 365
  const timeRecovered = (monthlyInvoices * 12 * dsoReduction) / 365

  const annualInvoices = monthlyInvoices * 12
  const currentLaborHours = annualInvoices * hoursPerInvoice
  const automatedLaborHours = currentLaborHours * 0.4
  const laborCostSavings = automatedLaborHours * hourlyRate

  const cashFlowImprovement = potentialSavings * 0.05
  const totalBenefit = potentialSavings + laborCostSavings + cashFlowImprovement

  return {
    annualRevenue,
    potentialSavings,
    timeRecovered,
    laborCostSavings,
    cashFlowImprovement,
    totalBenefit,
  }
}

export async function sendROIEmail(params: {
  email: string
  companyName: string
  results: any
}): Promise<{ success: boolean; message: string }> {
  try {
    const { email, companyName, results } = params

    const result = await sendEmail({
      to: email,
      subject: `ROI Analysis Report for ${companyName}`,
      text: `Your ROI Analysis Report is ready. Annual Revenue: $${results.annualRevenue.toLocaleString()}, Potential Savings: $${results.potentialSavings.toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">ROI Analysis Report for ${companyName}</h2>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3 style="color: #333;">Key Metrics</h3>
            <p><strong>Annual Revenue:</strong> $${results.annualRevenue.toLocaleString()}</p>
            <p><strong>Potential Savings:</strong> $${results.potentialSavings.toLocaleString()}</p>
            <p><strong>Time Recovered:</strong> ${results.timeRecovered.toFixed(2)} hours</p>
            ${results.laborCostSavings ? `<p><strong>Labor Cost Savings:</strong> $${results.laborCostSavings.toLocaleString()}</p>` : ""}
            ${results.totalBenefit ? `<p><strong>Total Annual Benefit:</strong> $${results.totalBenefit.toLocaleString()}</p>` : ""}
          </div>
          <p style="font-size: 14px; color: #666;">
            This analysis is based on the information you provided and industry benchmarks.
          </p>
        </div>
      `,
    })

    if (!result.success) {
      return {
        success: false,
        message: result.error || "Failed to send ROI report",
      }
    }

    return {
      success: true,
      message: "ROI report sent successfully",
    }
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send ROI report",
    }
  }
}

export { generateVerificationCode }
