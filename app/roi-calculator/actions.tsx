"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    const { error } = await supabase.from("verification_codes").insert({
      email: email.toLowerCase(),
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
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const code = generateVerificationCode()

    const storeResult = await storeVerificationCode(email, code)
    if (!storeResult.success) {
      return {
        success: false,
        message: "Failed to store verification code. Please try again.",
      }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">
            Your verification code is:
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #666;">
            This code will expire in 10 minutes.
          </p>
          <p style="font-size: 14px; color: #999;">
            If you didn't request this code, please ignore this email.
          </p>
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
      .eq("email", email.toLowerCase())
      .eq("code", code)
      .single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid verification code. Please try again.",
      }
    }

    if (new Date(data.expires_at) < new Date()) {
      await supabase.from("verification_codes").delete().eq("email", email.toLowerCase()).eq("code", code)

      return {
        success: false,
        message: "Verification code has expired. Please request a new one.",
      }
    }

    await supabase.from("verification_codes").delete().eq("email", email.toLowerCase()).eq("code", code)

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
  monthlyInvoices: number
  avgInvoiceValue: number
  currentDSO: number
  paymentCycle: number
}): Promise<{
  annualRevenue: number
  targetDSO: number
  cashFlowImprovement: number
  timeToROI: number
}> {
  const annualRevenue = data.monthlyInvoices * data.avgInvoiceValue * 12
  const targetDSO = Math.max(15, data.currentDSO * 0.6)
  const dsoReduction = data.currentDSO - targetDSO
  const cashFlowImprovement = (annualRevenue / 365) * dsoReduction
  const implementationCost = 50000
  const timeToROI = implementationCost / (cashFlowImprovement / 12)

  return {
    annualRevenue,
    targetDSO: Math.round(targetDSO),
    cashFlowImprovement: Math.round(cashFlowImprovement),
    timeToROI: Math.round(timeToROI * 10) / 10,
  }
}

export async function calculateDetailedROI(data: {
  companyName: string
  industry: string
  monthlyInvoices: number
  avgInvoiceValue: number
  currentDSO: number
  paymentCycle: number
  staffCount: number
  avgStaffCost: number
  collectionRate: number
  disputeRate: number
}): Promise<{
  annualRevenue: number
  targetDSO: number
  cashFlowImprovement: number
  staffSavings: number
  collectionImprovement: number
  disputeReduction: number
  totalAnnualBenefit: number
  implementationCost: number
  annualSubscription: number
  totalFirstYearCost: number
  netBenefit: number
  roi: number
  timeToROI: number
}> {
  const annualRevenue = data.monthlyInvoices * data.avgInvoiceValue * 12
  const targetDSO = Math.max(15, data.currentDSO * 0.6)
  const dsoReduction = data.currentDSO - targetDSO
  const cashFlowImprovement = (annualRevenue / 365) * dsoReduction
  const staffSavings = data.staffCount * data.avgStaffCost * 12 * 0.4
  const collectionImprovement = annualRevenue * (0.98 - data.collectionRate / 100)
  const disputeReduction = annualRevenue * (data.disputeRate / 100) * 0.7
  const totalAnnualBenefit = cashFlowImprovement + staffSavings + collectionImprovement + disputeReduction
  const implementationCost = 50000
  const annualSubscription = 36000
  const totalFirstYearCost = implementationCost + annualSubscription
  const netBenefit = totalAnnualBenefit - totalFirstYearCost
  const roi = (netBenefit / totalFirstYearCost) * 100
  const timeToROI = totalFirstYearCost / (totalAnnualBenefit / 12)

  return {
    annualRevenue: Math.round(annualRevenue),
    targetDSO: Math.round(targetDSO),
    cashFlowImprovement: Math.round(cashFlowImprovement),
    staffSavings: Math.round(staffSavings),
    collectionImprovement: Math.round(collectionImprovement),
    disputeReduction: Math.round(disputeReduction),
    totalAnnualBenefit: Math.round(totalAnnualBenefit),
    implementationCost,
    annualSubscription,
    totalFirstYearCost,
    netBenefit: Math.round(netBenefit),
    roi: Math.round(roi * 10) / 10,
    timeToROI: Math.round(timeToROI * 10) / 10,
  }
}

export async function sendROIEmail(email: string, reportData: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Report",
      text: `Your ROI Calculator Report

Company: ${reportData.companyName}
Industry: ${reportData.industry}

Key Metrics:
- Annual Revenue: $${reportData.results.annualRevenue.toLocaleString()}
- Current DSO: ${reportData.inputs.currentDSO} days
- Target DSO: ${reportData.results.targetDSO} days
- Cash Flow Improvement: $${reportData.results.cashFlowImprovement.toLocaleString()}
- Total Annual Benefit: $${reportData.results.totalAnnualBenefit.toLocaleString()}
- ROI: ${reportData.results.roi}%
- Time to ROI: ${reportData.results.timeToROI} months

Thank you for using our ROI Calculator!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Calculator Report</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Company Information</h3>
            <p><strong>Company:</strong> ${reportData.companyName}</p>
            <p><strong>Industry:</strong> ${reportData.industry}</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Key Metrics</h3>
            <p><strong>Annual Revenue:</strong> $${reportData.results.annualRevenue.toLocaleString()}</p>
            <p><strong>Current DSO:</strong> ${reportData.inputs.currentDSO} days</p>
            <p><strong>Target DSO:</strong> ${reportData.results.targetDSO} days</p>
            <p><strong>Cash Flow Improvement:</strong> $${reportData.results.cashFlowImprovement.toLocaleString()}</p>
            <p><strong>Total Annual Benefit:</strong> $${reportData.results.totalAnnualBenefit.toLocaleString()}</p>
            <p><strong>ROI:</strong> ${reportData.results.roi}%</p>
            <p><strong>Time to ROI:</strong> ${reportData.results.timeToROI} months</p>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            Thank you for using our ROI Calculator!
          </p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send report. Please try again.",
      }
    }

    return {
      success: true,
      message: "Report sent successfully!",
    }
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send report. Please try again.",
    }
  }
}

export { generateVerificationCode }
