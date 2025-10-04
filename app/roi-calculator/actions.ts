"use server"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

interface SimpleROIData {
  currentDSO: string
  averageInvoiceValue: string
  monthlyInvoices: string
  simpleDSOImprovement: string
  simpleCostOfCapital: string
}

interface DetailedROIData {
  implementationCost: string
  monthlyCost: string
  perAnnumDirectLabourCosts: string
  interestType: "loan" | "deposit"
  interestRate: string
  averageBadDebt: string
  currentBadDebts: string
  labourSavings: string
  dsoImprovement: string
  currentDSODays: string
  debtorsBalance: string
  averagePaymentTerms: "net30" | "net60" | "net90"
  numberOfDebtors: string
  numberOfCollectors: string
  projectedCustomerGrowth: string
}

export async function calculateSimpleROI(data: SimpleROIData) {
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
    dsoImprovement: dsoImprovement * 100,
  }
}

export async function calculateDetailedROI(data: DetailedROIData) {
  const implementationCost = Number.parseFloat(data.implementationCost)
  const monthlyCost = Number.parseFloat(data.monthlyCost)
  const annualCost = monthlyCost * 12
  const totalFirstYearCost = implementationCost + annualCost

  const perAnnumDirectLabourCosts = Number.parseFloat(data.perAnnumDirectLabourCosts)
  const labourSavings = Number.parseFloat(data.labourSavings) / 100
  const labourCostSavings = perAnnumDirectLabourCosts * labourSavings

  const currentDSODays = Number.parseFloat(data.currentDSODays)
  const dsoImprovement = Number.parseFloat(data.dsoImprovement) / 100
  const dsoReductionDays = currentDSODays * dsoImprovement
  const newDSODays = currentDSODays - dsoReductionDays

  const debtorsBalance = Number.parseFloat(data.debtorsBalance)
  const annualRevenue = (debtorsBalance / currentDSODays) * 365
  const workingCapitalReleased = (annualRevenue / 365) * dsoReductionDays

  const interestRate = Number.parseFloat(data.interestRate) / 100
  const interestSavings = workingCapitalReleased * interestRate

  const currentBadDebts = Number.parseFloat(data.currentBadDebts)
  const badDebtReduction = currentBadDebts * 0.5

  const totalAnnualBenefit = labourCostSavings + interestSavings + badDebtReduction

  const netAnnualBenefit = totalAnnualBenefit - annualCost
  const roi = (netAnnualBenefit / totalFirstYearCost) * 100
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
    netAnnualBenefit,
    roi,
    paybackMonths,
  }
}

export async function generateVerificationCode(email: string) {
  try {
    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store in Supabase
    const { error: insertError } = await supabase.from("verification_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      return { success: false, error: "Failed to generate code" }
    }

    // For now, just log the code (in production, send via email)
    console.log(`Verification code for ${email}: ${code}`)

    // Store code in response for testing
    return { success: true, code, message: `Code sent to ${email}` }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return { success: false, error: "Failed to generate code" }
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("code", code)
      .eq("used", false)
      .single()

    if (error || !data) {
      return { success: false, error: "Invalid verification code" }
    }

    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
      return { success: false, error: "Verification code has expired" }
    }

    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, error: "Failed to verify code" }
  }
}

export async function sendROIEmail(emailData: {
  name: string
  email: string
  company: string
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}) {
  try {
    // For now, just log the email data (in production, send via email service)
    console.log("ROI Email Data:", emailData)

    return { success: true, message: "ROI results logged to console" }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return { success: false, error: "Failed to send email" }
  }
}
