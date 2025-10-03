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
          <p style="font-size: 16px; color: #666;">Enter this code to access your ROI report:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #999;">This code will expire in 10 minutes.</p>
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
      .eq("id", data.id)

    return {
      success: true,
      message: "Verification successful",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "Failed to verify code. Please try again.",
    }
  }
}

export async function calculateSimpleROI(data: {
  currentRevenue: number
  invoiceVolume: number
  avgDSO: number
}) {
  const { currentRevenue, invoiceVolume, avgDSO } = data

  const avgInvoiceValue = currentRevenue / invoiceVolume
  const collectionCostPerInvoice = 25
  const totalCurrentCosts = invoiceVolume * collectionCostPerInvoice

  const newDSO = avgDSO * 0.7
  const dsoReduction = avgDSO - newDSO
  const cashFlowImprovement = (currentRevenue / 365) * dsoReduction

  const automationSavings = totalCurrentCosts * 0.6
  const totalAnnualSavings = automationSavings + cashFlowImprovement * 0.05

  const implementationCost = 50000
  const annualSubscription = 30000
  const firstYearTotalCost = implementationCost + annualSubscription

  const firstYearROI = ((totalAnnualSavings - firstYearTotalCost) / firstYearTotalCost) * 100
  const paybackPeriod = firstYearTotalCost / (totalAnnualSavings / 12)

  return {
    currentMetrics: {
      revenue: currentRevenue,
      invoiceVolume,
      avgDSO,
      avgInvoiceValue,
      collectionCosts: totalCurrentCosts,
    },
    projectedMetrics: {
      newDSO,
      dsoReduction,
      cashFlowImprovement,
      automationSavings,
      totalAnnualSavings,
    },
    investment: {
      implementationCost,
      annualSubscription,
      firstYearTotalCost,
    },
    roi: {
      firstYearROI,
      paybackPeriod,
      threeYearROI:
        ((totalAnnualSavings * 3 - implementationCost - annualSubscription * 3) /
          (implementationCost + annualSubscription * 3)) *
        100,
    },
  }
}

export async function calculateDetailedROI(data: {
  currentRevenue: number
  invoiceVolume: number
  avgDSO: number
  arStaffCount: number
  avgStaffSalary: number
  badDebtRate: number
}) {
  const simpleROI = await calculateSimpleROI(data)

  const { arStaffCount, avgStaffSalary, badDebtRate } = data

  const staffCostSavings = arStaffCount * avgStaffSalary * 0.5
  const badDebtReduction = data.currentRevenue * (badDebtRate / 100) * 0.3

  const totalAnnualSavings = simpleROI.projectedMetrics.totalAnnualSavings + staffCostSavings + badDebtReduction

  const firstYearROI =
    ((totalAnnualSavings - simpleROI.investment.firstYearTotalCost) / simpleROI.investment.firstYearTotalCost) * 100
  const paybackPeriod = simpleROI.investment.firstYearTotalCost / (totalAnnualSavings / 12)

  return {
    ...simpleROI,
    detailedMetrics: {
      staffCostSavings,
      badDebtReduction,
      totalAnnualSavings,
    },
    roi: {
      firstYearROI,
      paybackPeriod,
      threeYearROI:
        ((totalAnnualSavings * 3 -
          simpleROI.investment.implementationCost -
          simpleROI.investment.annualSubscription * 3) /
          (simpleROI.investment.implementationCost + simpleROI.investment.annualSubscription * 3)) *
        100,
    },
  }
}

export async function sendROIEmail(email: string, roiData: any): Promise<{ success: boolean; message: string }> {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Results",
      text: `Your ROI calculation results are ready. First Year ROI: ${roiData.roi.firstYearROI.toFixed(2)}%`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Calculator Results</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333;">Key Metrics</h3>
            <p><strong>First Year ROI:</strong> ${roiData.roi.firstYearROI.toFixed(2)}%</p>
            <p><strong>Payback Period:</strong> ${roiData.roi.paybackPeriod.toFixed(1)} months</p>
            <p><strong>Total Annual Savings:</strong> $${roiData.projectedMetrics.totalAnnualSavings.toLocaleString()}</p>
          </div>
        </div>
      `,
    })

    return result
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      message: "Failed to send email. Please try again.",
    }
  }
}

export { generateVerificationCode }
