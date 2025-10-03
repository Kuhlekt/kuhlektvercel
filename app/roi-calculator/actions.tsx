"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (error) {
      console.error("Error storing verification code:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Exception storing verification code:", error)
    return false
  }
}

export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const code = generateVerificationCode()
    const stored = await storeVerificationCode(email, code)

    if (!stored) {
      return {
        success: false,
        message: "Failed to store verification code",
      }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">Enter this code to access your ROI report:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #999;">This code will expire in 10 minutes.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: emailResult.message,
      }
    }

    return {
      success: true,
      message: "Verification code sent successfully",
    }
  } catch (error) {
    console.error("Error sending verification code:", error)
    return {
      success: false,
      message: "Failed to send verification code",
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
      .eq("code", code)

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

export async function calculateSimpleROI(data: {
  annualRevenue: number
  averageInvoiceValue: number
  dsoReduction: number
}) {
  const { annualRevenue, averageInvoiceValue, dsoReduction } = data

  const currentDSO = 45
  const targetDSO = currentDSO - dsoReduction
  const dsoImprovement = (dsoReduction / currentDSO) * 100

  const dailyRevenue = annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction

  const monthlyInvoices = annualRevenue / averageInvoiceValue / 12
  const timePerInvoice = 15
  const currentMonthlyHours = (monthlyInvoices * timePerInvoice) / 60
  const automationSavings = currentMonthlyHours * 0.7
  const annualTimeSavings = automationSavings * 12

  const hourlyRate = 50
  const annualCostSavings = annualTimeSavings * hourlyRate

  const badDebtRate = 0.02
  const reductionFactor = 0.3
  const badDebtReduction = annualRevenue * badDebtRate * reductionFactor

  const totalAnnualBenefit = cashFlowImprovement + annualCostSavings + badDebtReduction
  const monthlyBenefit = totalAnnualBenefit / 12

  const implementationCost = 15000
  const annualSubscription = annualRevenue < 5000000 ? 12000 : 24000
  const totalFirstYearCost = implementationCost + annualSubscription

  const roi = ((totalAnnualBenefit - totalFirstYearCost) / totalFirstYearCost) * 100
  const paybackMonths = totalFirstYearCost / monthlyBenefit

  return {
    currentDSO,
    targetDSO,
    dsoImprovement,
    cashFlowImprovement,
    annualTimeSavings,
    annualCostSavings,
    badDebtReduction,
    totalAnnualBenefit,
    monthlyBenefit,
    implementationCost,
    annualSubscription,
    totalFirstYearCost,
    roi,
    paybackMonths,
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  averageInvoiceValue: number
  monthlyInvoices: number
  currentDSO: number
  currentBadDebtRate: number
  staffHourlyRate: number
}) {
  const { annualRevenue, averageInvoiceValue, monthlyInvoices, currentDSO, currentBadDebtRate, staffHourlyRate } = data

  const dsoReduction = Math.min(currentDSO * 0.3, 20)
  const targetDSO = currentDSO - dsoReduction
  const dsoImprovement = (dsoReduction / currentDSO) * 100

  const dailyRevenue = annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction

  const timePerInvoice = 15
  const currentMonthlyHours = (monthlyInvoices * timePerInvoice) / 60
  const automationSavings = currentMonthlyHours * 0.7
  const annualTimeSavings = automationSavings * 12
  const annualCostSavings = annualTimeSavings * staffHourlyRate

  const reductionFactor = 0.3
  const badDebtReduction = annualRevenue * currentBadDebtRate * reductionFactor

  const totalAnnualBenefit = cashFlowImprovement + annualCostSavings + badDebtReduction
  const monthlyBenefit = totalAnnualBenefit / 12

  const implementationCost = 15000
  const annualSubscription = annualRevenue < 5000000 ? 12000 : 24000
  const totalFirstYearCost = implementationCost + annualSubscription

  const roi = ((totalAnnualBenefit - totalFirstYearCost) / totalFirstYearCost) * 100
  const paybackMonths = totalFirstYearCost / monthlyBenefit

  return {
    currentDSO,
    targetDSO,
    dsoImprovement,
    dsoReduction,
    cashFlowImprovement,
    currentMonthlyHours,
    automationSavings,
    annualTimeSavings,
    annualCostSavings,
    currentBadDebtRate: currentBadDebtRate * 100,
    badDebtReduction,
    totalAnnualBenefit,
    monthlyBenefit,
    implementationCost,
    annualSubscription,
    totalFirstYearCost,
    roi,
    paybackMonths,
  }
}

export async function sendROIEmail(email: string, roiData: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Results",
      text: `Your ROI calculation results are ready. Total Annual Benefit: $${roiData.totalAnnualBenefit.toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Calculator Results</h2>
          <p style="font-size: 16px; color: #666;">Here are your calculated results:</p>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Key Metrics</h3>
            <p><strong>Total Annual Benefit:</strong> $${roiData.totalAnnualBenefit.toLocaleString()}</p>
            <p><strong>ROI:</strong> ${roiData.roi.toFixed(1)}%</p>
            <p><strong>Payback Period:</strong> ${roiData.paybackMonths.toFixed(1)} months</p>
          </div>
        </div>
      `,
    })

    return emailResult
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      message: "Failed to send ROI email",
    }
  }
}

export { generateVerificationCode }
