"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

// Generate a random 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store verification code in database
async function storeVerificationCode(email: string, code: string) {
  const supabase = await createClient()

  // Set expiration to 15 minutes from now
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  const { error } = await supabase.from("verification_codes").insert({
    email,
    code,
    expires_at: expiresAt,
    attempts: 0,
  })

  if (error) {
    console.error("Error storing verification code:", error)
    throw new Error("Failed to store verification code")
  }
}

// Send verification code via email
export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Generate code
    const code = generateVerificationCode()

    // Store in database
    await storeVerificationCode(email, code)

    // Send email
    const result = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">ROI Calculator Verification</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666;">This code will expire in 15 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    if (!result.success) {
      console.error("Failed to send email:", result.error)
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
    console.error("Error in sendVerificationCode:", error)
    return {
      success: false,
      message: "Failed to send verification code. Please try again.",
    }
  }
}

// Verify the code entered by user
export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    // Get the verification code from database
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
      // Increment attempts if record exists
      await supabase
        .from("verification_codes")
        .update({ attempts: supabase.rpc("increment", { x: 1 }) })
        .eq("email", email)
        .eq("code", code)

      return {
        success: false,
        message: "Invalid or expired verification code",
      }
    }

    // Check if max attempts exceeded
    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Maximum verification attempts exceeded. Please request a new code.",
      }
    }

    // Delete the used code
    await supabase.from("verification_codes").delete().eq("id", data.id)

    return {
      success: true,
      message: "Verification successful",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "Verification failed. Please try again.",
    }
  }
}

// Calculate simple ROI
export async function calculateSimpleROI(data: {
  annualRevenue: number
  averageInvoiceValue: number
  averageDSO: number
}): Promise<{
  currentCashFlow: number
  potentialCashFlow: number
  cashFlowImprovement: number
  roi: number
}> {
  const { annualRevenue, averageInvoiceValue, averageDSO } = data

  // Current cash flow calculation
  const currentCashFlow = annualRevenue / averageDSO

  // With Kuhlekt, assume 30% reduction in DSO
  const improvedDSO = averageDSO * 0.7
  const potentialCashFlow = annualRevenue / improvedDSO

  const cashFlowImprovement = potentialCashFlow - currentCashFlow
  const roi = (cashFlowImprovement / annualRevenue) * 100

  return {
    currentCashFlow,
    potentialCashFlow,
    cashFlowImprovement,
    roi,
  }
}

// Calculate detailed ROI
export async function calculateDetailedROI(data: {
  annualRevenue: number
  averageInvoiceValue: number
  averageDSO: number
  numberOfInvoices: number
  arStaffCount: number
  avgStaffCost: number
}): Promise<{
  currentMetrics: {
    dso: number
    cashFlow: number
    arCost: number
    collectionEfficiency: number
  }
  projectedMetrics: {
    dso: number
    cashFlow: number
    arCost: number
    collectionEfficiency: number
  }
  improvements: {
    dsoReduction: number
    cashFlowIncrease: number
    costSavings: number
    efficiencyGain: number
    annualSavings: number
  }
  roi: {
    monthly: number
    annual: number
    paybackPeriod: number
  }
}> {
  const { annualRevenue, averageInvoiceValue, averageDSO, numberOfInvoices, arStaffCount, avgStaffCost } = data

  // Current metrics
  const currentDSO = averageDSO
  const currentCashFlow = annualRevenue / currentDSO
  const currentARCost = arStaffCount * avgStaffCost * 12
  const currentEfficiency = (annualRevenue / currentARCost) * 100

  // Projected metrics (with Kuhlekt)
  const projectedDSO = currentDSO * 0.7 // 30% reduction
  const projectedCashFlow = annualRevenue / projectedDSO
  const projectedStaffReduction = arStaffCount * 0.4 // 40% staff reduction
  const projectedARCost = (arStaffCount - projectedStaffReduction) * avgStaffCost * 12
  const projectedEfficiency = (annualRevenue / projectedARCost) * 100

  // Improvements
  const dsoReduction = currentDSO - projectedDSO
  const cashFlowIncrease = projectedCashFlow - currentCashFlow
  const costSavings = currentARCost - projectedARCost
  const efficiencyGain = projectedEfficiency - currentEfficiency
  const annualSavings = cashFlowIncrease + costSavings

  // ROI calculation
  const estimatedImplementationCost = annualRevenue * 0.02 // 2% of annual revenue
  const monthlyROI = (annualSavings / 12 / estimatedImplementationCost) * 100
  const annualROI = (annualSavings / estimatedImplementationCost) * 100
  const paybackPeriod = estimatedImplementationCost / (annualSavings / 12)

  return {
    currentMetrics: {
      dso: currentDSO,
      cashFlow: currentCashFlow,
      arCost: currentARCost,
      collectionEfficiency: currentEfficiency,
    },
    projectedMetrics: {
      dso: projectedDSO,
      cashFlow: projectedCashFlow,
      arCost: projectedARCost,
      collectionEfficiency: projectedEfficiency,
    },
    improvements: {
      dsoReduction,
      cashFlowIncrease,
      costSavings,
      efficiencyGain,
      annualSavings,
    },
    roi: {
      monthly: monthlyROI,
      annual: annualROI,
      paybackPeriod,
    },
  }
}

// Send ROI report via email
export async function sendROIEmail(email: string, results: any): Promise<{ success: boolean; message: string }> {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Results",
      text: `Your ROI calculation results are ready.\n\nThank you for using Kuhlekt's ROI Calculator.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your ROI Calculator Results</h2>
          <p>Thank you for using Kuhlekt's ROI Calculator. Your detailed results are attached.</p>
          <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0;">
            <h3>Key Findings:</h3>
            <ul>
              <li>Potential Cash Flow Improvement: ${results.cashFlowImprovement ? `$${results.cashFlowImprovement.toLocaleString()}` : "N/A"}</li>
              <li>ROI: ${results.roi ? `${results.roi.toFixed(2)}%` : "N/A"}</li>
            </ul>
          </div>
          <p style="color: #666;">To learn more about how Kuhlekt can help your business, schedule a demo today.</p>
        </div>
      `,
    })

    if (!result.success) {
      console.error("Failed to send email:", result.error)
      return {
        success: false,
        message: "Failed to send email. Please try again.",
      }
    }

    return {
      success: true,
      message: "Email sent successfully",
    }
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send email. Please try again.",
    }
  }
}

export { generateVerificationCode }
