"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (error) {
      console.error("Error storing verification code:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in storeVerificationCode:", error)
    return { success: false, error: "Failed to store verification code" }
  }
}

export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const code = generateVerificationCode()
    const storeResult = await storeVerificationCode(email, code)

    if (!storeResult.success) {
      return {
        success: false,
        message: "Failed to generate verification code. Please try again.",
      }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Kuhlekt ROI Calculator</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666;">This code will expire in 15 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification code. Please try again.",
      }
    }

    return {
      success: true,
      message: "Verification code sent successfully!",
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
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid or expired verification code.",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Maximum verification attempts exceeded. Please request a new code.",
      }
    }

    await supabase
      .from("verification_codes")
      .update({ attempts: data.attempts + 1 })
      .eq("id", data.id)

    return {
      success: true,
      message: "Email verified successfully!",
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
  monthlyRevenue: number
  collectionTime: number
  badDebtRate: number
}): Promise<{
  currentAR: number
  reducedAR: number
  savings: number
  roi: number
}> {
  const { monthlyRevenue, collectionTime, badDebtRate } = data

  const currentAR = (monthlyRevenue * collectionTime) / 30
  const reducedCollectionTime = collectionTime * 0.7
  const reducedAR = (monthlyRevenue * reducedCollectionTime) / 30
  const cashFlowImprovement = currentAR - reducedAR
  const badDebtReduction = monthlyRevenue * (badDebtRate / 100) * 0.5
  const annualSavings = (cashFlowImprovement + badDebtReduction) * 12
  const implementationCost = monthlyRevenue * 0.02
  const roi = ((annualSavings - implementationCost) / implementationCost) * 100

  return {
    currentAR,
    reducedAR,
    savings: annualSavings,
    roi,
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  currentDSO: number
  badDebtPercentage: number
  arStaffCount: number
  avgStaffSalary: number
}): Promise<{
  currentMetrics: {
    dso: number
    arBalance: number
    badDebt: number
    staffCost: number
  }
  projectedMetrics: {
    dso: number
    arBalance: number
    badDebt: number
    staffCost: number
  }
  savings: {
    cashFlow: number
    badDebt: number
    staffing: number
    total: number
  }
  roi: {
    percentage: number
    paybackMonths: number
  }
}> {
  const { annualRevenue, currentDSO, badDebtPercentage, arStaffCount, avgStaffSalary } = data

  const dailyRevenue = annualRevenue / 365
  const currentARBalance = dailyRevenue * currentDSO
  const currentBadDebt = annualRevenue * (badDebtPercentage / 100)
  const currentStaffCost = arStaffCount * avgStaffSalary

  const projectedDSO = currentDSO * 0.65
  const projectedARBalance = dailyRevenue * projectedDSO
  const projectedBadDebt = currentBadDebt * 0.5
  const projectedStaffCost = currentStaffCost * 0.7

  const cashFlowSavings = currentARBalance - projectedARBalance
  const badDebtSavings = currentBadDebt - projectedBadDebt
  const staffingSavings = currentStaffCost - projectedStaffCost
  const totalSavings = cashFlowSavings + badDebtSavings + staffingSavings

  const implementationCost = annualRevenue * 0.03
  const roiPercentage = ((totalSavings - implementationCost) / implementationCost) * 100
  const paybackMonths = implementationCost / (totalSavings / 12)

  return {
    currentMetrics: {
      dso: currentDSO,
      arBalance: currentARBalance,
      badDebt: currentBadDebt,
      staffCost: currentStaffCost,
    },
    projectedMetrics: {
      dso: projectedDSO,
      arBalance: projectedARBalance,
      badDebt: projectedBadDebt,
      staffCost: projectedStaffCost,
    },
    savings: {
      cashFlow: cashFlowSavings,
      badDebt: badDebtSavings,
      staffing: staffingSavings,
      total: totalSavings,
    },
    roi: {
      percentage: roiPercentage,
      paybackMonths: paybackMonths,
    },
  }
}

export async function sendROIEmail(email: string, roiData: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Analysis Report",
      text: `Thank you for using the Kuhlekt ROI Calculator. Please find your detailed analysis attached.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Analysis Report</h2>
          <p>Thank you for using the Kuhlekt ROI Calculator.</p>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3>Key Findings:</h3>
            <ul>
              <li>Projected Annual Savings: $${roiData.savings?.total?.toLocaleString() || "N/A"}</li>
              <li>ROI: ${roiData.roi?.percentage?.toFixed(2) || "N/A"}%</li>
              <li>Payback Period: ${roiData.roi?.paybackMonths?.toFixed(1) || "N/A"} months</li>
            </ul>
          </div>
          <p>Want to learn more about how Kuhlekt can transform your accounts receivable process?</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://kuhlekt.com"}/demo" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Schedule a Demo</a>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send ROI report. Please try again.",
      }
    }

    return {
      success: true,
      message: "ROI report sent successfully!",
    }
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send ROI report. Please try again.",
    }
  }
}

export { generateVerificationCode }
