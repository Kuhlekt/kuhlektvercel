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

    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #999;">This code will expire in 10 minutes.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: emailResult.message || "Failed to send verification email",
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
      message: "An error occurred while sending the verification code",
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
        message: "Too many verification attempts",
      }
    }

    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Verification successful",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "An error occurred during verification",
    }
  }
}

export async function calculateSimpleROI(data: {
  annualRevenue: number
  dso: number
  collections: number
}) {
  const manualCost = data.annualRevenue * 0.03
  const automatedCost = data.annualRevenue * 0.01
  const savings = manualCost - automatedCost
  const dsoReduction = data.dso * 0.2
  const cashFlowImprovement = (data.annualRevenue / 365) * dsoReduction
  const collectionImprovement = data.collections * 0.15
  const totalBenefit = savings + cashFlowImprovement + collectionImprovement

  return {
    annualSavings: savings,
    dsoReduction,
    cashFlowImprovement,
    collectionImprovement,
    totalBenefit,
    roi: (totalBenefit / automatedCost) * 100,
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  dso: number
  collections: number
  employees: number
  avgInvoiceValue: number
}) {
  const simple = await calculateSimpleROI(data)
  const laborSavings = data.employees * 40000 * 0.3
  const errorReduction = data.annualRevenue * 0.02
  const scalabilitySavings = data.annualRevenue * 0.005

  return {
    ...simple,
    laborSavings,
    errorReduction,
    scalabilitySavings,
    totalBenefit: simple.totalBenefit + laborSavings + errorReduction + scalabilitySavings,
  }
}

export async function sendROIEmail(email: string, roiData: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Results",
      text: `Here are your ROI calculation results:\n\nAnnual Savings: $${roiData.annualSavings.toLocaleString()}\nTotal Benefit: $${roiData.totalBenefit.toLocaleString()}\nROI: ${roiData.roi.toFixed(2)}%`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Calculator Results</h2>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <p><strong>Annual Savings:</strong> $${roiData.annualSavings.toLocaleString()}</p>
            <p><strong>DSO Reduction:</strong> ${roiData.dsoReduction.toFixed(1)} days</p>
            <p><strong>Cash Flow Improvement:</strong> $${roiData.cashFlowImprovement.toLocaleString()}</p>
            <p><strong>Collection Improvement:</strong> $${roiData.collectionImprovement.toLocaleString()}</p>
            <p><strong>Total Benefit:</strong> $${roiData.totalBenefit.toLocaleString()}</p>
            <p><strong>ROI:</strong> ${roiData.roi.toFixed(2)}%</p>
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
