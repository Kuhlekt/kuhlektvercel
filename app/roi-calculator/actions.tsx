"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

// Generate a random 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store verification code in database
async function storeVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

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
    console.error("Error storing verification code:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Send verification code via email
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
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Kuhlekt ROI Calculator</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #0066cc; letter-spacing: 5px; font-size: 32px;">${code}</h1>
          <p style="color: #666;">This code will expire in 15 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
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
      message: "Verification code sent successfully",
    }
  } catch (error) {
    console.error("Error sending verification code:", error)
    return {
      success: false,
      message: "Failed to send verification code. Please try again.",
    }
  }
}

// Verify the code entered by the user
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
      await supabase
        .from("verification_codes")
        .update({ attempts: supabase.rpc("increment", { row_id: data?.id }) })
        .eq("email", email)
        .eq("code", code)

      return {
        success: false,
        message: "Invalid or expired verification code",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many failed attempts. Please request a new code.",
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
      message: "Verification failed. Please try again.",
    }
  }
}

// Calculate simple ROI
export async function calculateSimpleROI(data: {
  currentAR: number
  employeeCount: number
  avgInvoiceValue: number
  dsoReduction: number
}) {
  const monthlyCost = data.currentAR * 0.02
  const timeSaved = data.employeeCount * 20 * 50
  const cashFlowImprovement = (data.avgInvoiceValue * data.dsoReduction * 365) / 30
  const totalSavings = monthlyCost + timeSaved + cashFlowImprovement

  return {
    monthlyCost,
    timeSaved,
    cashFlowImprovement,
    totalSavings,
    roi: (totalSavings / monthlyCost) * 100,
  }
}

// Calculate detailed ROI
export async function calculateDetailedROI(data: any) {
  const result = await calculateSimpleROI(data)
  return {
    ...result,
    detailedBreakdown: {
      laborCostSavings: data.employeeCount * 20 * 50,
      errorReduction: data.currentAR * 0.01,
      customerSatisfaction: data.avgInvoiceValue * 0.05,
    },
  }
}

// Send ROI report via email
export async function sendROIEmail(email: string, roiData: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Report",
      text: `Your ROI calculation results are ready.\n\nTotal Savings: $${roiData.totalSavings.toLocaleString()}\nROI: ${roiData.roi.toFixed(2)}%`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Kuhlekt ROI Report</h2>
          <p>Here are your calculated results:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h3>Total Annual Savings: $${roiData.totalSavings.toLocaleString()}</h3>
            <p><strong>ROI:</strong> ${roiData.roi.toFixed(2)}%</p>
            <p><strong>Monthly Cost Savings:</strong> $${roiData.monthlyCost.toLocaleString()}</p>
            <p><strong>Time Saved:</strong> $${roiData.timeSaved.toLocaleString()}</p>
            <p><strong>Cash Flow Improvement:</strong> $${roiData.cashFlowImprovement.toLocaleString()}</p>
          </div>
          <p style="margin-top: 20px;">Contact us to learn more about how Kuhlekt can help your business.</p>
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
      message: "ROI report sent successfully",
    }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      message: "Failed to send ROI report. Please try again.",
    }
  }
}
