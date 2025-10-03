"use server"

import { sendEmail } from "@/lib/aws-ses"
import { createClient } from "@/lib/supabase/server"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

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
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Verification Code</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #0070f3; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification email",
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
      await supabase.from("verification_codes").delete().eq("id", data.id)
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    if (data.attempts >= 3) {
      await supabase.from("verification_codes").delete().eq("id", data.id)
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    await supabase.from("verification_codes").delete().eq("id", data.id)

    return {
      success: true,
      message: "Email verified successfully",
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
  annualRevenue: number
  invoiceVolume: number
  avgDaysPaid: number
}): Promise<{
  currentDSO: number
  potentialDSO: number
  cashFlowImprovement: number
  timeRecovered: number
}> {
  const currentDSO = data.avgDaysPaid
  const potentialDSO = Math.max(15, currentDSO * 0.4)
  const dsoReduction = currentDSO - potentialDSO
  const dailyRevenue = data.annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction
  const hoursPerInvoice = 2
  const totalHours = data.invoiceVolume * hoursPerInvoice
  const timeRecovered = totalHours * 0.7

  return {
    currentDSO,
    potentialDSO: Math.round(potentialDSO),
    cashFlowImprovement: Math.round(cashFlowImprovement),
    timeRecovered: Math.round(timeRecovered),
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  invoiceVolume: number
  avgDaysPaid: number
  fteCost: number
  industryType: string
}): Promise<{
  currentDSO: number
  potentialDSO: number
  cashFlowImprovement: number
  timeRecovered: number
  costSavings: number
  fteReduction: number
  roi: number
}> {
  const simple = await calculateSimpleROI(data)
  const hourlyRate = data.fteCost / 2080
  const costSavings = simple.timeRecovered * hourlyRate
  const fteReduction = simple.timeRecovered / 2080
  const implementationCost = 50000
  const roi = ((costSavings + simple.cashFlowImprovement - implementationCost) / implementationCost) * 100

  return {
    ...simple,
    costSavings: Math.round(costSavings),
    fteReduction: Math.round(fteReduction * 10) / 10,
    roi: Math.round(roi),
  }
}

export async function sendROIEmail(email: string, data: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Analysis Report",
      text: `Your ROI analysis is ready. DSO Improvement: ${data.currentDSO - data.potentialDSO} days. Cash Flow Improvement: $${data.cashFlowImprovement.toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your ROI Analysis Report</h2>
          <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Current DSO:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.currentDSO} days</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Potential DSO:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.potentialDSO} days</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Cash Flow Improvement:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${data.cashFlowImprovement.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Time Recovered:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.timeRecovered} hours/year</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">Ready to transform your accounts receivable process? <a href="https://kuhlekt.com/demo">Schedule a demo</a> to learn more.</p>
        </div>
      `,
    })

    return emailResult
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send ROI email",
    }
  }
}

export { generateVerificationCode }
