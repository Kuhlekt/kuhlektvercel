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

  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 15) // Code expires in 15 minutes

  const { error } = await supabase.from("verification_codes").insert({
    email: email.toLowerCase(),
    code,
    expires_at: expiresAt.toISOString(),
    attempts: 0,
  })

  if (error) {
    console.error("[Verification] Error storing code:", error)
    throw new Error("Failed to store verification code")
  }
}

// Send verification code via email
export async function sendVerificationCode(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("[Verification] Generating code for:", email)
    const code = generateVerificationCode()

    console.log("[Verification] Storing code in database")
    await storeVerificationCode(email, code)

    console.log("[Verification] Sending email")
    await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2;">Kuhlekt ROI Calculator</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f0f9ff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #0891b2; font-size: 48px; margin: 0; letter-spacing: 8px;">${code}</h1>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    console.log("[Verification] Code sent successfully")
    return { success: true }
  } catch (error) {
    console.error("[Verification] Error:", error)
    return {
      success: false,
      error: "Unable to send verification code. Please try again.",
    }
  }
}

// Verify the code entered by the user
export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("[Verification] Verifying code for:", email)
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("code", code)
      .single()

    if (error || !data) {
      console.error("[Verification] Code not found:", error)
      return { success: false, error: "Invalid verification code" }
    }

    // Check if code has expired
    if (new Date(data.expires_at) < new Date()) {
      console.log("[Verification] Code expired")
      return { success: false, error: "Verification code has expired" }
    }

    // Check if too many attempts
    if (data.attempts >= 5) {
      console.log("[Verification] Too many attempts")
      return { success: false, error: "Too many attempts. Please request a new code." }
    }

    // Increment attempts
    await supabase
      .from("verification_codes")
      .update({ attempts: data.attempts + 1 })
      .eq("id", data.id)

    // Delete the used code
    await supabase.from("verification_codes").delete().eq("id", data.id)

    console.log("[Verification] Code verified successfully")
    return { success: true }
  } catch (error) {
    console.error("[Verification] Error verifying code:", error)
    return {
      success: false,
      error: "Unable to verify code. Please try again.",
    }
  }
}

// Calculate simple ROI
export async function calculateSimpleROI(data: any) {
  const currentDSO = Number.parseFloat(data.currentDSO)
  const averageInvoiceValue = Number.parseFloat(data.averageInvoiceValue)
  const monthlyInvoices = Number.parseFloat(data.monthlyInvoices)
  const dsoImprovement = Number.parseFloat(data.simpleDSOImprovement) / 100
  const costOfCapital = Number.parseFloat(data.simpleCostOfCapital) / 100

  const annualRevenue = averageInvoiceValue * monthlyInvoices * 12
  const currentCashTied = (annualRevenue / 365) * currentDSO
  const newDSO = currentDSO * (1 - dsoImprovement)
  const newCashTied = (annualRevenue / 365) * newDSO
  const cashReleased = currentCashTied - newCashTied
  const annualSavings = cashReleased * costOfCapital

  return {
    currentDSO,
    newDSO,
    currentCashTied,
    cashReleased,
    annualSavings,
    annualRevenue,
  }
}

// Calculate detailed ROI
export async function calculateDetailedROI(data: any) {
  const implementationCost = Number.parseFloat(data.implementationCost)
  const monthlyCost = Number.parseFloat(data.monthlyCost)
  const annualCost = monthlyCost * 12
  const totalFirstYearCost = implementationCost + annualCost

  const perAnnumDirectLabourCosts = Number.parseFloat(data.perAnnumDirectLabourCosts)
  const interestRate = Number.parseFloat(data.interestRate) / 100
  const averageBadDebt = Number.parseFloat(data.averageBadDebt) / 100
  const currentBadDebts = Number.parseFloat(data.currentBadDebts)
  const labourSavings = Number.parseFloat(data.labourSavings) / 100
  const dsoImprovement = Number.parseFloat(data.dsoImprovement) / 100
  const currentDSODays = Number.parseFloat(data.currentDSODays)
  const debtorsBalance = Number.parseFloat(data.debtorsBalance)

  // Calculate savings
  const labourCostSavings = perAnnumDirectLabourCosts * labourSavings
  const dsoReductionDays = currentDSODays * dsoImprovement
  const newDSODays = currentDSODays - dsoReductionDays
  const workingCapitalReleased = (debtorsBalance / currentDSODays) * dsoReductionDays
  const interestSavings = workingCapitalReleased * interestRate
  const badDebtReduction = currentBadDebts * 0.5 // Assume 50% reduction

  const totalAnnualBenefit = labourCostSavings + interestSavings + badDebtReduction
  const netBenefit = totalAnnualBenefit - annualCost
  const roi = (netBenefit / totalFirstYearCost) * 100
  const paybackMonths = totalFirstYearCost / (totalAnnualBenefit / 12)

  return {
    implementationCost,
    annualCost,
    totalFirstYearCost,
    labourCostSavings,
    dsoReductionDays,
    newDSODays,
    workingCapitalReleased,
    interestSavings,
    badDebtReduction,
    totalAnnualBenefit,
    netBenefit,
    roi,
    paybackMonths,
  }
}

// Send ROI results via email
export async function sendROIEmail(data: {
  name: string
  email: string
  company: string
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}) {
  try {
    const { name, email, company, calculatorType, results } = data

    let emailContent = ""

    if (calculatorType === "simple") {
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2;">Your Kuhlekt ROI Analysis Results</h2>
          <p>Dear ${name},</p>
          <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0891b2; margin-top: 0;">Estimated Annual Savings</h3>
            <h1 style="color: #0891b2; font-size: 48px; margin: 10px 0;">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h1>
          </div>

          <div style="margin: 20px 0;">
            <h4>Key Metrics:</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0;">Current DSO:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold;">${results.currentDSO} days</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0;">New DSO:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #0891b2;">${results.newDSO?.toFixed(0)} days</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0;">Current Cash Tied Up:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold;">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">Cash Released:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #10b981;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
            </table>
          </div>

          <p>Want to see how Kuhlekt can help you achieve these results? <a href="https://kuhlekt.com/demo" style="color: #0891b2;">Schedule a demo</a></p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This analysis is based on the information you provided and represents estimated potential savings.
          </p>
        </div>
      `
    } else {
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2;">Your Kuhlekt ROI Analysis Results</h2>
          <p>Dear ${name},</p>
          <p>Thank you for using the Kuhlekt ROI Calculator. Here is your comprehensive analysis:</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0891b2; margin-top: 0;">Total Annual Benefit</h3>
            <h1 style="color: #0891b2; font-size: 48px; margin: 10px 0;">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h1>
            <p style="margin: 10px 0;">ROI: <strong>${results.roi?.toFixed(0)}%</strong> | Payback: <strong>${results.paybackMonths?.toFixed(1)} months</strong></p>
          </div>

          <div style="margin: 20px 0;">
            <h4>Detailed Breakdown:</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0;">DSO Improvement:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold;">${results.dsoReductionDays?.toFixed(0)} days</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0;">Working Capital Released:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #10b981;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0;">Interest Savings:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #10b981;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0;">Labour Savings:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #10b981;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">Bad Debt Reduction:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #10b981;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
            </table>
          </div>

          <p>Want to see how Kuhlekt can help you achieve these results? <a href="https://kuhlekt.com/demo" style="color: #0891b2;">Schedule a demo</a></p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This analysis is based on the information you provided and represents estimated potential savings.
          </p>
        </div>
      `
    }

    await sendEmail({
      to: email,
      subject: `Your Kuhlekt ROI Analysis Results - ${company}`,
      text: `Your ROI analysis results for ${company}`,
      html: emailContent,
    })

    return { success: true }
  } catch (error) {
    console.error("[ROI Email] Error:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export { generateVerificationCode }
