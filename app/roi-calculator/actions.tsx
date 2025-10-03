"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<boolean> {
  try {
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
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Verification Code</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
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
      const { data: attemptData } = await supabase
        .from("verification_codes")
        .select("attempts")
        .eq("email", email)
        .eq("code", code)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (attemptData) {
        await supabase
          .from("verification_codes")
          .update({ attempts: attemptData.attempts + 1 })
          .eq("email", email)
          .eq("code", code)
      }

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
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "Failed to verify code. Please try again.",
    }
  }
}

export async function calculateSimpleROI(data: {
  annualRevenue: number
  averageInvoiceValue: number
  daysToCollect: number
}): Promise<any> {
  const { annualRevenue, averageInvoiceValue, daysToCollect } = data

  const currentDSO = daysToCollect
  const targetDSO = Math.max(currentDSO * 0.7, 30)
  const dsoReduction = currentDSO - targetDSO

  const dailyRevenue = annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction

  const timeSpentPerInvoice = 2
  const invoicesPerYear = annualRevenue / averageInvoiceValue
  const currentTimeSpent = (invoicesPerYear * timeSpentPerInvoice) / 60
  const automatedTimeSpent = currentTimeSpent * 0.3
  const timeSaved = currentTimeSpent - automatedTimeSpent

  const badDebtRate = 0.02
  const currentBadDebt = annualRevenue * badDebtRate
  const reducedBadDebt = currentBadDebt * 0.5
  const badDebtSavings = currentBadDebt - reducedBadDebt

  const totalBenefit = cashFlowImprovement + badDebtSavings

  return {
    currentDSO,
    targetDSO,
    dsoReduction,
    cashFlowImprovement,
    timeSaved,
    badDebtSavings,
    totalBenefit,
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  averageInvoiceValue: number
  daysToCollect: number
  numberOfEmployees: number
  badDebtPercentage: number
}): Promise<any> {
  const { annualRevenue, averageInvoiceValue, daysToCollect, numberOfEmployees, badDebtPercentage } = data

  const currentDSO = daysToCollect
  const targetDSO = Math.max(currentDSO * 0.7, 30)
  const dsoReduction = currentDSO - targetDSO

  const dailyRevenue = annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction

  const timeSpentPerInvoice = 2
  const invoicesPerYear = annualRevenue / averageInvoiceValue
  const currentTimeSpent = (invoicesPerYear * timeSpentPerInvoice) / 60
  const automatedTimeSpent = currentTimeSpent * 0.3
  const timeSaved = currentTimeSpent - automatedTimeSpent

  const laborCostPerHour = 50
  const laborSavings = timeSaved * laborCostPerHour

  const currentBadDebt = annualRevenue * (badDebtPercentage / 100)
  const reducedBadDebt = currentBadDebt * 0.5
  const badDebtSavings = currentBadDebt - reducedBadDebt

  const estimatedSoftwareCost = Math.min(numberOfEmployees * 100 * 12, 50000)

  const totalBenefit = cashFlowImprovement + laborSavings + badDebtSavings
  const netBenefit = totalBenefit - estimatedSoftwareCost
  const roi = (netBenefit / estimatedSoftwareCost) * 100
  const paybackPeriod = estimatedSoftwareCost / (totalBenefit / 12)

  return {
    currentDSO,
    targetDSO,
    dsoReduction,
    cashFlowImprovement,
    timeSaved,
    laborSavings,
    badDebtSavings,
    totalBenefit,
    estimatedSoftwareCost,
    netBenefit,
    roi,
    paybackPeriod,
  }
}

export async function sendROIEmail(
  email: string,
  results: any,
  companyName?: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

    const emailResult = await sendEmail({
      to: email,
      subject: `Your ROI Calculator Results${companyName ? ` - ${companyName}` : ""}`,
      text: `
Your ROI Calculator Results
${companyName ? `Company: ${companyName}` : ""}

DSO Reduction: ${results.dsoReduction.toFixed(1)} days
Cash Flow Improvement: ${formatter.format(results.cashFlowImprovement)}
Time Saved: ${results.timeSaved.toFixed(0)} hours/year
${results.laborSavings ? `Labor Savings: ${formatter.format(results.laborSavings)}` : ""}
Bad Debt Savings: ${formatter.format(results.badDebtSavings)}
Total Annual Benefit: ${formatter.format(results.totalBenefit)}
${results.roi ? `ROI: ${results.roi.toFixed(0)}%` : ""}
${results.paybackPeriod ? `Payback Period: ${results.paybackPeriod.toFixed(1)} months` : ""}

Thank you for using our ROI Calculator!
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your ROI Calculator Results</h2>
          ${companyName ? `<p><strong>Company:</strong> ${companyName}</p>` : ""}
          
          <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3>Key Metrics</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">
                <strong>DSO Reduction:</strong> ${results.dsoReduction.toFixed(1)} days
              </li>
              <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">
                <strong>Cash Flow Improvement:</strong> ${formatter.format(results.cashFlowImprovement)}
              </li>
              <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">
                <strong>Time Saved:</strong> ${results.timeSaved.toFixed(0)} hours/year
              </li>
              ${
                results.laborSavings
                  ? `<li style="padding: 10px 0; border-bottom: 1px solid #ddd;">
                <strong>Labor Savings:</strong> ${formatter.format(results.laborSavings)}
              </li>`
                  : ""
              }
              <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">
                <strong>Bad Debt Savings:</strong> ${formatter.format(results.badDebtSavings)}
              </li>
              <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">
                <strong>Total Annual Benefit:</strong> ${formatter.format(results.totalBenefit)}
              </li>
              ${
                results.roi
                  ? `<li style="padding: 10px 0; border-bottom: 1px solid #ddd;">
                <strong>ROI:</strong> ${results.roi.toFixed(0)}%
              </li>`
                  : ""
              }
              ${
                results.paybackPeriod
                  ? `<li style="padding: 10px 0;">
                <strong>Payback Period:</strong> ${results.paybackPeriod.toFixed(1)} months
              </li>`
                  : ""
              }
            </ul>
          </div>
          
          <p>Thank you for using our ROI Calculator!</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send ROI results. Please try again.",
      }
    }

    return {
      success: true,
      message: "ROI results sent successfully!",
    }
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send ROI results. Please try again.",
    }
  }
}

export { generateVerificationCode }
