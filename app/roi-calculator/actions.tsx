"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const { error: deleteError } = await supabase.from("verification_codes").delete().eq("email", email)

    if (deleteError) {
      console.error("Error deleting old codes:", deleteError)
    }

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      return { success: false, error: insertError.message }
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
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">
            Your verification code is:
          </p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #999;">
            This code will expire in 10 minutes.
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
      .single()

    if (error || !data) {
      const { error: updateError } = await supabase
        .from("verification_codes")
        .update({ attempts: supabase.rpc("increment_attempts") })
        .eq("email", email)

      return {
        success: false,
        message: "Invalid verification code. Please try again.",
      }
    }

    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
      await supabase.from("verification_codes").delete().eq("email", email)

      return {
        success: false,
        message: "Verification code has expired. Please request a new one.",
      }
    }

    if (data.attempts >= 3) {
      await supabase.from("verification_codes").delete().eq("email", email)

      return {
        success: false,
        message: "Too many failed attempts. Please request a new code.",
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

interface SimpleROIInput {
  currentRevenue: number
  collectionRate: number
}

interface SimpleROIResult {
  currentDSO: number
  projectedDSO: number
  annualSavings: number
  threeYearROI: number
}

export async function calculateSimpleROI(input: SimpleROIInput): Promise<SimpleROIResult> {
  const { currentRevenue, collectionRate } = input

  const currentDSO = (365 * (1 - collectionRate / 100)) / 12
  const projectedDSO = currentDSO * 0.7
  const dsoReduction = currentDSO - projectedDSO
  const annualSavings = (currentRevenue * dsoReduction) / 365
  const threeYearROI = annualSavings * 3

  return {
    currentDSO: Math.round(currentDSO),
    projectedDSO: Math.round(projectedDSO),
    annualSavings: Math.round(annualSavings),
    threeYearROI: Math.round(threeYearROI),
  }
}

interface DetailedROIInput {
  annualRevenue: number
  averageInvoiceValue: number
  currentDSO: number
  collectionRate: number
  writeOffRate: number
  fteCost: number
  numberOfFTEs: number
}

interface DetailedROIResult {
  currentMetrics: {
    dso: number
    collectionRate: number
    writeOffRate: number
    annualFTECost: number
  }
  projectedMetrics: {
    dso: number
    collectionRate: number
    writeOffRate: number
    annualFTECost: number
  }
  improvements: {
    dsoReduction: number
    collectionRateIncrease: number
    writeOffReduction: number
    fteReduction: number
  }
  financialImpact: {
    cashFlowImprovement: number
    writeOffSavings: number
    laborSavings: number
    totalAnnualSavings: number
    threeYearROI: number
    fiveYearROI: number
  }
}

export async function calculateDetailedROI(input: DetailedROIInput): Promise<DetailedROIResult> {
  const { annualRevenue, currentDSO, collectionRate, writeOffRate, fteCost, numberOfFTEs } = input

  const projectedDSO = currentDSO * 0.7
  const projectedCollectionRate = Math.min(collectionRate * 1.15, 98)
  const projectedWriteOffRate = writeOffRate * 0.5
  const projectedFTEs = Math.max(numberOfFTEs * 0.6, 1)

  const dsoReduction = currentDSO - projectedDSO
  const cashFlowImprovement = (annualRevenue * dsoReduction) / 365
  const collectionRateIncrease = projectedCollectionRate - collectionRate
  const writeOffReduction = writeOffRate - projectedWriteOffRate
  const writeOffSavings = (annualRevenue * writeOffReduction) / 100
  const fteReduction = numberOfFTEs - projectedFTEs
  const laborSavings = fteReduction * fteCost

  const totalAnnualSavings = cashFlowImprovement + writeOffSavings + laborSavings
  const threeYearROI = totalAnnualSavings * 3
  const fiveYearROI = totalAnnualSavings * 5

  return {
    currentMetrics: {
      dso: Math.round(currentDSO),
      collectionRate: Math.round(collectionRate * 10) / 10,
      writeOffRate: Math.round(writeOffRate * 10) / 10,
      annualFTECost: Math.round(numberOfFTEs * fteCost),
    },
    projectedMetrics: {
      dso: Math.round(projectedDSO),
      collectionRate: Math.round(projectedCollectionRate * 10) / 10,
      writeOffRate: Math.round(projectedWriteOffRate * 10) / 10,
      annualFTECost: Math.round(projectedFTEs * fteCost),
    },
    improvements: {
      dsoReduction: Math.round(dsoReduction),
      collectionRateIncrease: Math.round(collectionRateIncrease * 10) / 10,
      writeOffReduction: Math.round(writeOffReduction * 10) / 10,
      fteReduction: Math.round(fteReduction * 10) / 10,
    },
    financialImpact: {
      cashFlowImprovement: Math.round(cashFlowImprovement),
      writeOffSavings: Math.round(writeOffSavings),
      laborSavings: Math.round(laborSavings),
      totalAnnualSavings: Math.round(totalAnnualSavings),
      threeYearROI: Math.round(threeYearROI),
      fiveYearROI: Math.round(fiveYearROI),
    },
  }
}

export async function sendROIEmail(
  email: string,
  results: SimpleROIResult | DetailedROIResult,
): Promise<{ success: boolean; message: string }> {
  try {
    const isDetailed = "financialImpact" in results

    let htmlContent = ""
    let textContent = ""

    if (isDetailed) {
      const detailedResults = results as DetailedROIResult
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Detailed ROI Analysis</h2>
          
          <h3 style="color: #666;">Current Metrics</h3>
          <ul>
            <li>DSO: ${detailedResults.currentMetrics.dso} days</li>
            <li>Collection Rate: ${detailedResults.currentMetrics.collectionRate}%</li>
            <li>Write-off Rate: ${detailedResults.currentMetrics.writeOffRate}%</li>
            <li>Annual FTE Cost: $${detailedResults.currentMetrics.annualFTECost.toLocaleString()}</li>
          </ul>

          <h3 style="color: #666;">Projected Metrics</h3>
          <ul>
            <li>DSO: ${detailedResults.projectedMetrics.dso} days</li>
            <li>Collection Rate: ${detailedResults.projectedMetrics.collectionRate}%</li>
            <li>Write-off Rate: ${detailedResults.projectedMetrics.writeOffRate}%</li>
            <li>Annual FTE Cost: $${detailedResults.projectedMetrics.annualFTECost.toLocaleString()}</li>
          </ul>

          <h3 style="color: #666;">Financial Impact</h3>
          <ul>
            <li>Cash Flow Improvement: $${detailedResults.financialImpact.cashFlowImprovement.toLocaleString()}</li>
            <li>Write-off Savings: $${detailedResults.financialImpact.writeOffSavings.toLocaleString()}</li>
            <li>Labor Savings: $${detailedResults.financialImpact.laborSavings.toLocaleString()}</li>
            <li><strong>Total Annual Savings: $${detailedResults.financialImpact.totalAnnualSavings.toLocaleString()}</strong></li>
            <li><strong>3-Year ROI: $${detailedResults.financialImpact.threeYearROI.toLocaleString()}</strong></li>
            <li><strong>5-Year ROI: $${detailedResults.financialImpact.fiveYearROI.toLocaleString()}</strong></li>
          </ul>
        </div>
      `

      textContent = `Your Detailed ROI Analysis\n\nCurrent Metrics:\n- DSO: ${detailedResults.currentMetrics.dso} days\n- Collection Rate: ${detailedResults.currentMetrics.collectionRate}%\n- Write-off Rate: ${detailedResults.currentMetrics.writeOffRate}%\n- Annual FTE Cost: $${detailedResults.currentMetrics.annualFTECost.toLocaleString()}\n\nProjected Metrics:\n- DSO: ${detailedResults.projectedMetrics.dso} days\n- Collection Rate: ${detailedResults.projectedMetrics.collectionRate}%\n- Write-off Rate: ${detailedResults.projectedMetrics.writeOffRate}%\n- Annual FTE Cost: $${detailedResults.projectedMetrics.annualFTECost.toLocaleString()}\n\nFinancial Impact:\n- Cash Flow Improvement: $${detailedResults.financialImpact.cashFlowImprovement.toLocaleString()}\n- Write-off Savings: $${detailedResults.financialImpact.writeOffSavings.toLocaleString()}\n- Labor Savings: $${detailedResults.financialImpact.laborSavings.toLocaleString()}\n- Total Annual Savings: $${detailedResults.financialImpact.totalAnnualSavings.toLocaleString()}\n- 3-Year ROI: $${detailedResults.financialImpact.threeYearROI.toLocaleString()}\n- 5-Year ROI: $${detailedResults.financialImpact.fiveYearROI.toLocaleString()}`
    } else {
      const simpleResults = results as SimpleROIResult
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Analysis</h2>
          <ul>
            <li>Current DSO: ${simpleResults.currentDSO} days</li>
            <li>Projected DSO: ${simpleResults.projectedDSO} days</li>
            <li>Annual Savings: $${simpleResults.annualSavings.toLocaleString()}</li>
            <li><strong>3-Year ROI: $${simpleResults.threeYearROI.toLocaleString()}</strong></li>
          </ul>
        </div>
      `

      textContent = `Your ROI Analysis\n\n- Current DSO: ${simpleResults.currentDSO} days\n- Projected DSO: ${simpleResults.projectedDSO} days\n- Annual Savings: $${simpleResults.annualSavings.toLocaleString()}\n- 3-Year ROI: $${simpleResults.threeYearROI.toLocaleString()}`
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Analysis Results",
      text: textContent,
      html: htmlContent,
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
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      message: "Failed to send ROI report. Please try again.",
    }
  }
}

export { generateVerificationCode }
