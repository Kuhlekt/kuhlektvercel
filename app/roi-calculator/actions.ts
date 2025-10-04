"use server"

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
  const averageBadDebt = Number.parseFloat(data.averageBadDebt) / 100
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

export async function sendROIEmail(emailData: {
  name: string
  email: string
  company: string
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/roi-calculator/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export async function generateVerificationCode(email: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/verification-code/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error generating verification code:", error)
    return { success: false, error: "Failed to generate code" }
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/verification-code/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, error: "Failed to verify code" }
  }
}
