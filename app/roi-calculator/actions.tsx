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

  // Validate inputs
  if (isNaN(currentDSO) || currentDSO <= 0) {
    throw new Error("Current DSO must be a positive number")
  }
  if (isNaN(averageInvoiceValue) || averageInvoiceValue <= 0) {
    throw new Error("Average invoice value must be a positive number")
  }
  if (isNaN(monthlyInvoices) || monthlyInvoices <= 0) {
    throw new Error("Monthly invoices must be a positive number")
  }
  if (isNaN(dsoImprovement) || dsoImprovement < 0 || dsoImprovement > 1) {
    throw new Error("DSO improvement must be between 0 and 100%")
  }
  if (isNaN(costOfCapital) || costOfCapital < 0) {
    throw new Error("Cost of capital must be a positive number")
  }

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
    costOfCapital: costOfCapital * 100,
  }
}

export async function calculateDetailedROI(data: DetailedROIData) {
  const implementationCost = Number.parseFloat(data.implementationCost)
  const monthlyCost = Number.parseFloat(data.monthlyCost)
  const labourCosts = Number.parseFloat(data.perAnnumDirectLabourCosts)
  const labourSavingsPercent = Number.parseFloat(data.labourSavings) / 100
  const interestRate = Number.parseFloat(data.interestRate) / 100
  const currentDSO = Number.parseFloat(data.currentDSODays)
  const dsoImprovementPercent = Number.parseFloat(data.dsoImprovement) / 100
  const debtorsBalance = Number.parseFloat(data.debtorsBalance)
  const currentBadDebts = Number.parseFloat(data.currentBadDebts)

  // Validate inputs
  if (isNaN(implementationCost) || implementationCost < 0) {
    throw new Error("Implementation cost must be a positive number")
  }
  if (isNaN(monthlyCost) || monthlyCost < 0) {
    throw new Error("Monthly cost must be a positive number")
  }
  if (isNaN(labourCosts) || labourCosts < 0) {
    throw new Error("Labour costs must be a positive number")
  }
  if (isNaN(currentDSO) || currentDSO <= 0) {
    throw new Error("Current DSO must be a positive number")
  }
  if (isNaN(debtorsBalance) || debtorsBalance < 0) {
    throw new Error("Debtors balance must be a positive number")
  }
  if (isNaN(dsoImprovementPercent) || dsoImprovementPercent < 0 || dsoImprovementPercent > 1) {
    throw new Error("DSO improvement must be between 0 and 100%")
  }

  const annualCost = monthlyCost * 12
  const totalFirstYearCost = implementationCost + annualCost

  const labourCostSavings = labourCosts * labourSavingsPercent

  const dsoReductionDays = currentDSO * dsoImprovementPercent
  const newDSO = currentDSO - dsoReductionDays
  const workingCapitalReleased = (debtorsBalance / currentDSO) * dsoReductionDays
  const interestSavings = workingCapitalReleased * interestRate

  const badDebtReduction = currentBadDebts * 0.5

  const totalAnnualBenefit = labourCostSavings + interestSavings + badDebtReduction
  const netBenefit = totalAnnualBenefit - totalFirstYearCost
  const roi = (netBenefit / totalFirstYearCost) * 100
  const paybackMonths = totalFirstYearCost / (totalAnnualBenefit / 12)

  return {
    implementationCost,
    annualCost,
    totalFirstYearCost,
    totalFirstYearInvestment: totalFirstYearCost,
    labourCostSavings,
    interestSavings,
    badDebtReduction,
    workingCapitalReleased,
    dsoReductionDays,
    currentDSO,
    newDSO,
    totalAnnualBenefit,
    netBenefit,
    roi,
    paybackMonths,
  }
}
