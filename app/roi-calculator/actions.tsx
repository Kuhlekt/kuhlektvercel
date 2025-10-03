"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

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
        message: "Failed to store verification code. Please try again.",
      }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">
            Your verification code for the Kuhlekt ROI Calculator is:
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #666;">
            This code will expire in 10 minutes.
          </p>
          <p style="font-size: 14px; color: #666;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification email. Please try again.",
      }
    }

    return {
      success: true,
      message: "Verification code sent successfully!",
    }
  } catch (error) {
    console.error("Error sending verification code:", error)
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
      .gte("expires_at", new Date().toISOString())
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
        message: "Too many attempts. Please request a new code.",
      }
    }

    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Email verified successfully!",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "Failed to verify code. Please try again.",
    }
  }
}

export async function calculateSimpleROI(data: {
  annualRevenue: number
  dso: number
  collectionCost: number
}): Promise<{
  currentCashTied: number
  potentialCashRelease: number
  annualSavings: number
  roi: number
}> {
  const currentCashTied = (data.annualRevenue / 365) * data.dso
  const targetDSO = Math.max(data.dso * 0.7, 30)
  const potentialCashRelease = currentCashTied - (data.annualRevenue / 365) * targetDSO
  const annualSavings = data.collectionCost * 0.4
  const roi = ((potentialCashRelease + annualSavings) / 50000) * 100

  return {
    currentCashTied,
    potentialCashRelease,
    annualSavings,
    roi,
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  dso: number
  collectionCost: number
  badDebtRate: number
  teamSize: number
}): Promise<{
  currentCashTied: number
  potentialCashRelease: number
  annualSavings: number
  badDebtReduction: number
  timeToPayback: number
  roi: number
  efficiency: number
}> {
  const currentCashTied = (data.annualRevenue / 365) * data.dso
  const targetDSO = Math.max(data.dso * 0.7, 30)
  const potentialCashRelease = currentCashTied - (data.annualRevenue / 365) * targetDSO
  const annualSavings = data.collectionCost * 0.4
  const badDebtReduction = data.annualRevenue * (data.badDebtRate / 100) * 0.3
  const totalBenefit = potentialCashRelease + annualSavings + badDebtReduction
  const implementationCost = 50000
  const timeToPayback = implementationCost / (annualSavings / 12)
  const roi = (totalBenefit / implementationCost) * 100
  const efficiency = (data.annualRevenue / data.teamSize / data.collectionCost) * 100

  return {
    currentCashTied,
    potentialCashRelease,
    annualSavings,
    badDebtReduction,
    timeToPayback,
    roi,
    efficiency,
  }
}

export async function sendROIEmail(
  email: string,
  results: any,
  calculationType: "simple" | "detailed",
): Promise<{ success: boolean; message: string }> {
  try {
    const subject = "Your Kuhlekt ROI Analysis Results"
    const text = `Thank you for using the Kuhlekt ROI Calculator. Your results are attached.`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your ROI Analysis Results</h2>
        <p style="font-size: 16px; color: #666;">
          Thank you for using the Kuhlekt ROI Calculator. Here are your results:
        </p>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
          <h3 style="color: #333;">Key Metrics</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">
              <strong>Potential Cash Release:</strong> $${results.potentialCashRelease?.toLocaleString() || 0}
            </li>
            <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">
              <strong>Annual Savings:</strong> $${results.annualSavings?.toLocaleString() || 0}
            </li>
            <li style="padding: 10px 0;">
              <strong>ROI:</strong> ${results.roi?.toFixed(2) || 0}%
            </li>
          </ul>
        </div>
        <p style="font-size: 14px; color: #666;">
          To learn more about how Kuhlekt can help optimize your receivables management, 
          <a href="https://kuhlekt.com" style="color: #007bff;">visit our website</a> or 
          <a href="https://kuhlekt.com/contact" style="color: #007bff;">contact us</a>.
        </p>
      </div>
    `

    const result = await sendEmail({ to: email, subject, text, html })
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
