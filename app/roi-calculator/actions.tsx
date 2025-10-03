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
    console.error("Error in storeVerificationCode:", error)
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

    const result = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Verification Code</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    return result
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

    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
      await supabase.from("verification_codes").delete().eq("id", data.id)
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

    await supabase.from("verification_codes").delete().eq("id", data.id)

    return {
      success: true,
      message: "Verification successful",
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
  avgInvoiceValue: number
  invoicesPerMonth: number
  currentDSO: number
}): Promise<{
  success: boolean
  data?: {
    currentDSO: number
    projectedDSO: number
    dsoReduction: number
    annualSavings: number
    monthlyTimeSaved: number
  }
}> {
  try {
    const projectedDSO = Math.round(data.currentDSO * 0.6)
    const dsoReduction = data.currentDSO - projectedDSO
    const dailyCost = data.annualRevenue / 365
    const annualSavings = Math.round(dailyCost * dsoReduction)
    const monthlyTimeSaved = Math.round(data.invoicesPerMonth * 2)

    return {
      success: true,
      data: {
        currentDSO: data.currentDSO,
        projectedDSO,
        dsoReduction,
        annualSavings,
        monthlyTimeSaved,
      },
    }
  } catch (error) {
    console.error("Error calculating simple ROI:", error)
    return {
      success: false,
    }
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  avgInvoiceValue: number
  invoicesPerMonth: number
  currentDSO: number
  collectionStaff: number
  avgStaffCost: number
}): Promise<{
  success: boolean
  data?: {
    currentDSO: number
    projectedDSO: number
    dsoReduction: number
    annualSavings: number
    monthlyTimeSaved: number
    staffCostSavings: number
    totalAnnualBenefit: number
    roi: number
    paybackPeriod: number
  }
}> {
  try {
    const projectedDSO = Math.round(data.currentDSO * 0.6)
    const dsoReduction = data.currentDSO - projectedDSO
    const dailyCost = data.annualRevenue / 365
    const annualSavings = Math.round(dailyCost * dsoReduction)
    const monthlyTimeSaved = Math.round(data.invoicesPerMonth * 2)
    const staffCostSavings = Math.round(data.collectionStaff * data.avgStaffCost * 0.3)
    const totalAnnualBenefit = annualSavings + staffCostSavings
    const estimatedAnnualCost = 12000
    const roi = Math.round(((totalAnnualBenefit - estimatedAnnualCost) / estimatedAnnualCost) * 100)
    const paybackPeriod = Number((estimatedAnnualCost / (totalAnnualBenefit / 12)).toFixed(1))

    return {
      success: true,
      data: {
        currentDSO: data.currentDSO,
        projectedDSO,
        dsoReduction,
        annualSavings,
        monthlyTimeSaved,
        staffCostSavings,
        totalAnnualBenefit,
        roi,
        paybackPeriod,
      },
    }
  } catch (error) {
    console.error("Error calculating detailed ROI:", error)
    return {
      success: false,
    }
  }
}

export async function sendROIEmail(
  email: string,
  roiData: {
    currentDSO: number
    projectedDSO: number
    dsoReduction: number
    annualSavings: number
    monthlyTimeSaved: number
    staffCostSavings?: number
    totalAnnualBenefit?: number
    roi?: number
    paybackPeriod?: number
  },
): Promise<{ success: boolean; message: string }> {
  try {
    const isDetailed = roiData.staffCostSavings !== undefined

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your ROI Calculator Results</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Key Metrics</h3>
          <p><strong>Current DSO:</strong> ${roiData.currentDSO} days</p>
          <p><strong>Projected DSO:</strong> ${roiData.projectedDSO} days</p>
          <p><strong>DSO Reduction:</strong> ${roiData.dsoReduction} days</p>
          <p><strong>Annual Savings:</strong> $${roiData.annualSavings.toLocaleString()}</p>
          <p><strong>Monthly Time Saved:</strong> ${roiData.monthlyTimeSaved} hours</p>
          ${
            isDetailed
              ? `
            <p><strong>Staff Cost Savings:</strong> $${roiData.staffCostSavings?.toLocaleString()}</p>
            <p><strong>Total Annual Benefit:</strong> $${roiData.totalAnnualBenefit?.toLocaleString()}</p>
            <p><strong>ROI:</strong> ${roiData.roi}%</p>
            <p><strong>Payback Period:</strong> ${roiData.paybackPeriod} months</p>
          `
              : ""
          }
        </div>
        <p>Thank you for using our ROI Calculator!</p>
        <p>To learn more about how Kuhlekt can help your business, visit our website.</p>
      </div>
    `

    const textContent = `
Your ROI Calculator Results

Key Metrics:
- Current DSO: ${roiData.currentDSO} days
- Projected DSO: ${roiData.projectedDSO} days
- DSO Reduction: ${roiData.dsoReduction} days
- Annual Savings: $${roiData.annualSavings.toLocaleString()}
- Monthly Time Saved: ${roiData.monthlyTimeSaved} hours
${
  isDetailed
    ? `
- Staff Cost Savings: $${roiData.staffCostSavings?.toLocaleString()}
- Total Annual Benefit: $${roiData.totalAnnualBenefit?.toLocaleString()}
- ROI: ${roiData.roi}%
- Payback Period: ${roiData.paybackPeriod} months
`
    : ""
}

Thank you for using our ROI Calculator!
To learn more about how Kuhlekt can help your business, visit our website.
    `

    const result = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Results",
      text: textContent,
      html: htmlContent,
    })

    return result
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      message: "Failed to send ROI email",
    }
  }
}

export { generateVerificationCode }
