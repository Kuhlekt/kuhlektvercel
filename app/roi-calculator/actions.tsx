"use server"

interface SimpleROIInput {
  currentDSO: string
  averageInvoiceValue: string
  monthlyInvoices: string
  simpleDSOImprovement: string
  simpleCostOfCapital: string
}

interface SimpleROIResult {
  annualSavings: number
  cashReleased: number
  currentCashTied: number
  newDSO: number
  dsoImprovementPercent: number
}

interface DetailedROIInput {
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

interface DetailedROIResult {
  roi: number
  paybackMonths: number
  workingCapitalReleased: number
  interestSavings: number
  labourCostSavings: number
  badDebtReduction: number
  totalAnnualBenefit: number
  currentDSO: number
  newDSO: number
  dsoReductionDays: number
  totalImplementationAndAnnualCost: number
}

interface SendROIEmailInput {
  name: string
  email: string
  company: string
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}

export async function calculateSimpleROI(data: SimpleROIInput): Promise<SimpleROIResult> {
  console.log("[v0] Starting simple ROI calculation with inputs:", data)

  try {
    const currentDSO = Number.parseFloat(data.currentDSO)
    const averageInvoiceValue = Number.parseFloat(data.averageInvoiceValue)
    const monthlyInvoices = Number.parseFloat(data.monthlyInvoices)
    const dsoImprovementPercent = Number.parseFloat(data.simpleDSOImprovement)
    const costOfCapital = Number.parseFloat(data.simpleCostOfCapital) / 100

    console.log("[v0] Parsed values:", {
      currentDSO,
      averageInvoiceValue,
      monthlyInvoices,
      dsoImprovementPercent,
      costOfCapital,
    })

    // Calculate annual revenue
    const annualRevenue = averageInvoiceValue * monthlyInvoices * 12

    // Calculate current cash tied up
    const currentCashTied = (annualRevenue / 365) * currentDSO

    // Calculate new DSO after improvement
    const newDSO = currentDSO * (1 - dsoImprovementPercent / 100)

    // Calculate cash released
    const cashReleased = (annualRevenue / 365) * (currentDSO - newDSO)

    // Calculate annual savings from cost of capital
    const annualSavings = cashReleased * costOfCapital

    const result = {
      annualSavings,
      cashReleased,
      currentCashTied,
      newDSO,
      dsoImprovementPercent,
    }

    console.log("[v0] Simple ROI calculation result:", result)
    return result
  } catch (error) {
    console.error("[v0] Error in calculateSimpleROI:", error)
    throw error
  }
}

export async function calculateDetailedROI(data: DetailedROIInput): Promise<DetailedROIResult> {
  console.log("[v0] Starting detailed ROI calculation with inputs:", data)

  try {
    const implementationCost = Number.parseFloat(data.implementationCost)
    const monthlyCost = Number.parseFloat(data.monthlyCost)
    const annualCost = monthlyCost * 12
    const labourCosts = Number.parseFloat(data.perAnnumDirectLabourCosts)
    const interestRate = Number.parseFloat(data.interestRate) / 100
    const averageBadDebt = Number.parseFloat(data.averageBadDebt) / 100
    const currentBadDebts = Number.parseFloat(data.currentBadDebts)
    const labourSavingsPercent = Number.parseFloat(data.labourSavings) / 100
    const dsoImprovementPercent = Number.parseFloat(data.dsoImprovement) / 100
    const currentDSODays = Number.parseFloat(data.currentDSODays)
    const debtorsBalance = Number.parseFloat(data.debtorsBalance)

    console.log("[v0] Parsed detailed values:", {
      implementationCost,
      monthlyCost,
      annualCost,
      labourCosts,
      interestRate,
      currentDSODays,
      debtorsBalance,
    })

    // Calculate new DSO
    const newDSO = currentDSODays * (1 - dsoImprovementPercent)
    const dsoReductionDays = currentDSODays - newDSO

    // Calculate working capital released
    const dailyRevenue = debtorsBalance / currentDSODays
    const workingCapitalReleased = dailyRevenue * dsoReductionDays

    // Calculate interest savings
    const interestSavings = workingCapitalReleased * interestRate

    // Calculate labour cost savings
    const labourCostSavings = labourCosts * labourSavingsPercent

    // Calculate bad debt reduction
    const badDebtReduction = currentBadDebts * (dsoImprovementPercent * 0.5) // Conservative estimate

    // Calculate total annual benefit
    const totalAnnualBenefit = interestSavings + labourCostSavings + badDebtReduction

    // Calculate total cost (first year)
    const totalImplementationAndAnnualCost = implementationCost + annualCost

    // Calculate ROI
    const netBenefit = totalAnnualBenefit - annualCost
    const roi = (netBenefit / implementationCost) * 100

    // Calculate payback period in months
    const paybackMonths = (implementationCost / (totalAnnualBenefit - annualCost)) * 12

    const result = {
      roi,
      paybackMonths,
      workingCapitalReleased,
      interestSavings,
      labourCostSavings,
      badDebtReduction,
      totalAnnualBenefit,
      currentDSO: currentDSODays,
      newDSO,
      dsoReductionDays,
      totalImplementationAndAnnualCost,
    }

    console.log("[v0] Detailed ROI calculation result:", result)
    return result
  } catch (error) {
    console.error("[v0] Error in calculateDetailedROI:", error)
    throw error
  }
}

export async function sendROIEmail(data: SendROIEmailInput) {
  console.log("[v0] Starting sendROIEmail with data:", {
    name: data.name,
    email: data.email,
    company: data.company,
    calculatorType: data.calculatorType,
  })

  try {
    // Import sendEmail from AWS SES
    const { sendEmail } = await import("@/lib/aws-ses")

    const emailSubject = `ROI Calculator Results - ${data.calculatorType === "simple" ? "Simple" : "Detailed"} Analysis`

    const emailBody = `
      <h2>ROI Calculator Results</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
      <p><strong>Calculator Type:</strong> ${data.calculatorType === "simple" ? "Simple" : "Detailed"}</p>
      
      <h3>Results:</h3>
      <pre>${JSON.stringify(data.results, null, 2)}</pre>
      
      <h3>Inputs:</h3>
      <pre>${JSON.stringify(data.inputs, null, 2)}</pre>
    `

    const emailText = `
ROI Calculator Results

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || "Not provided"}
Calculator Type: ${data.calculatorType === "simple" ? "Simple" : "Detailed"}

Results:
${JSON.stringify(data.results, null, 2)}

Inputs:
${JSON.stringify(data.inputs, null, 2)}
    `

    console.log("[v0] Sending email to:", process.env.ADMIN_EMAIL)

    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      html: emailBody,
      text: emailText,
    })

    console.log("[v0] Email sent successfully:", emailResult)
    return emailResult
  } catch (error) {
    console.error("[v0] Error in sendROIEmail:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}
