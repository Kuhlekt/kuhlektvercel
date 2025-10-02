"use server"

import { sendEmail } from "@/lib/aws-ses"

interface SimpleROIInputs {
  currentDSO: string
  averageInvoiceValue: string
  monthlyInvoices: string
  simpleDSOImprovement: string
  simpleCostOfCapital: string
}

interface DetailedROIInputs {
  implementationCost: string
  monthlyCost: string
  currentDSODays: string
  debtorsBalance: string
  interestType: "loan" | "deposit"
  interestRate: string
  perAnnumDirectLabourCosts: string
  currentBadDebts: string
  averageBadDebt: string
  dsoImprovement: string
  labourSavings: string
  numberOfDebtors: string
  numberOfCollectors: string
  projectedCustomerGrowth: string
  averagePaymentTerms: "net30" | "net60" | "net90"
}

interface SimpleROIResults {
  currentCashTied: number
  newDSO: number
  cashReleased: number
  annualSavings: number
  dsoImprovementPercent: number
}

interface DetailedROIResults {
  currentDSO: number
  newDSO: number
  dsoReductionDays: number
  workingCapitalReleased: number
  labourCostSavings: number
  badDebtReduction: number
  interestSavings: number
  totalAnnualBenefit: number
  totalImplementationAndAnnualCost: number
  roi: number
  paybackMonths: number
}

export async function calculateSimpleROI(inputs: SimpleROIInputs): Promise<SimpleROIResults> {
  const currentDSO = Number.parseFloat(inputs.currentDSO)
  const avgInvoiceValue = Number.parseFloat(inputs.averageInvoiceValue)
  const monthlyInvoices = Number.parseFloat(inputs.monthlyInvoices)
  const dsoImprovementPercent = Number.parseFloat(inputs.simpleDSOImprovement) / 100
  const costOfCapitalPercent = Number.parseFloat(inputs.simpleCostOfCapital) / 100

  const currentCashTied = (currentDSO / 30) * avgInvoiceValue * monthlyInvoices
  const newDSO = currentDSO * (1 - dsoImprovementPercent)
  const newCashTied = (newDSO / 30) * avgInvoiceValue * monthlyInvoices
  const cashReleased = currentCashTied - newCashTied
  const annualSavings = cashReleased * 12 * costOfCapitalPercent

  return {
    currentCashTied,
    newDSO,
    cashReleased,
    annualSavings,
    dsoImprovementPercent: Number.parseFloat(inputs.simpleDSOImprovement),
  }
}

export async function calculateDetailedROI(inputs: DetailedROIInputs): Promise<DetailedROIResults> {
  try {
    console.log("[v0] Starting detailed ROI calculation with inputs:", inputs)

    const implementationCost = Number.parseFloat(inputs.implementationCost)
    const monthlyCost = Number.parseFloat(inputs.monthlyCost)
    const annualCost = monthlyCost * 12
    const perAnnumDirectLabourCosts = Number.parseFloat(inputs.perAnnumDirectLabourCosts)
    const interestRate = Number.parseFloat(inputs.interestRate) / 100
    const averageBadDebtPercent = Number.parseFloat(inputs.averageBadDebt) / 100
    const currentBadDebts = Number.parseFloat(inputs.currentBadDebts)
    const labourSavingsPercent = Number.parseFloat(inputs.labourSavings) / 100
    const dsoImprovementPercent = Number.parseFloat(inputs.dsoImprovement) / 100
    const daysSales = 365
    const currentDSO = Number.parseFloat(inputs.currentDSODays)
    const debtorsBalance = Number.parseFloat(inputs.debtorsBalance)

    console.log("[v0] Parsed values:", {
      implementationCost,
      monthlyCost,
      annualCost,
      perAnnumDirectLabourCosts,
      interestRate,
      currentDSO,
      debtorsBalance,
      dsoImprovementPercent,
      labourSavingsPercent,
    })

    if (isNaN(implementationCost) || isNaN(monthlyCost) || isNaN(currentDSO) || isNaN(debtorsBalance)) {
      throw new Error("Invalid input values - please check all required fields are filled correctly")
    }

    // Calculate annual revenue from debtors balance and DSO
    const annualRevenue = (debtorsBalance / currentDSO) * daysSales

    // DSO Improvement
    const dsoReductionDays = currentDSO * dsoImprovementPercent
    const newDSO = currentDSO - dsoReductionDays

    // Working Capital Released
    const dailyRevenue = annualRevenue / daysSales
    const workingCapitalReleased = dailyRevenue * dsoReductionDays

    // Interest Savings (on working capital released)
    const interestSavings = workingCapitalReleased * interestRate

    // Labour Cost Savings
    const labourCostSavings = perAnnumDirectLabourCosts * labourSavingsPercent

    // Bad Debt Reduction (40% improvement on current bad debt)
    const badDebtReduction = currentBadDebts * 0.4

    // Total Annual Benefit
    const totalAnnualBenefit = interestSavings + labourCostSavings + badDebtReduction

    // Total Cost (Implementation + Annual)
    const totalImplementationAndAnnualCost = implementationCost + annualCost

    // ROI Calculation
    const netBenefit = totalAnnualBenefit - annualCost
    const roi = totalImplementationAndAnnualCost > 0 ? (netBenefit / totalImplementationAndAnnualCost) * 100 : 0

    // Payback Period
    const paybackMonths = totalAnnualBenefit > 0 ? (totalImplementationAndAnnualCost / totalAnnualBenefit) * 12 : 0

    const results = {
      currentDSO,
      newDSO,
      dsoReductionDays,
      workingCapitalReleased,
      labourCostSavings,
      badDebtReduction,
      interestSavings,
      totalAnnualBenefit,
      totalImplementationAndAnnualCost,
      roi,
      paybackMonths,
    }

    console.log("[v0] Calculation results:", results)

    return results
  } catch (error) {
    console.error("[v0] Error in calculateDetailedROI:", error)
    throw error
  }
}

export async function sendROIEmail(data: {
  name: string
  email: string
  company: string
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}): Promise<{ success: boolean; error?: string }> {
  try {
    const companyName = data.company || "Not Provided"
    const emailSubject = data.company ? `ROI Calculator Results - ${data.company}` : `ROI Calculator Results`

    let emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #0891b2; }
            .section-title { color: #0891b2; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
            .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .metric:last-child { border-bottom: none; }
            .label { font-weight: 600; color: #4b5563; }
            .value { color: #0891b2; font-weight: bold; }
            .highlight { background: #ecfeff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .highlight-value { font-size: 32px; font-weight: bold; color: #0891b2; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Your ROI Calculator Results</h1>
              <p>${data.calculatorType === "simple" ? "Simple ROI Analysis" : "Detailed ROI Analysis"}</p>
            </div>
            <div class="content">
              <div class="section">
                <div class="section-title">📧 Contact Information</div>
                <div class="metric">
                  <span class="label">Name:</span>
                  <span class="value">${data.name}</span>
                </div>
                <div class="metric">
                  <span class="label">Email:</span>
                  <span class="value">${data.email}</span>
                </div>
                ${
                  data.company
                    ? `
                <div class="metric">
                  <span class="label">Company:</span>
                  <span class="value">${data.company}</span>
                </div>
                `
                    : ""
                }
                <div class="metric">
                  <span class="label">Date:</span>
                  <span class="value">${new Date().toLocaleDateString()}</span>
                </div>
              </div>
    `

    if (data.calculatorType === "simple") {
      emailHtml += `
              <div class="highlight">
                <div style="color: #6b7280; margin-bottom: 10px;">Estimated Annual Savings</div>
                <div class="highlight-value">$${data.results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>

              <div class="section">
                <div class="section-title">📊 Key Results</div>
                <div class="metric">
                  <span class="label">Current Cash Tied Up:</span>
                  <span class="value">$${data.results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Cash Released:</span>
                  <span class="value">$${data.results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">New DSO:</span>
                  <span class="value">${data.results.newDSO?.toFixed(0)} days</span>
                </div>
                <div class="metric">
                  <span class="label">DSO Improvement:</span>
                  <span class="value">${data.results.dsoImprovementPercent}%</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">📈 Your Inputs</div>
                <div class="metric">
                  <span class="label">Current DSO:</span>
                  <span class="value">${data.inputs.currentDSO} days</span>
                </div>
                <div class="metric">
                  <span class="label">Average Invoice Value:</span>
                  <span class="value">$${Number.parseFloat(data.inputs.averageInvoiceValue).toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="label">Monthly Invoices:</span>
                  <span class="value">${data.inputs.monthlyInvoices}</span>
                </div>
                <div class="metric">
                  <span class="label">Expected DSO Improvement:</span>
                  <span class="value">${data.inputs.simpleDSOImprovement}%</span>
                </div>
                <div class="metric">
                  <span class="label">Cost of Capital:</span>
                  <span class="value">${data.inputs.simpleCostOfCapital}%</span>
                </div>
              </div>
      `
    } else {
      emailHtml += `
              <div class="highlight">
                <div style="color: #6b7280; margin-bottom: 10px;">Total Annual Benefit</div>
                <div class="highlight-value">$${data.results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div style="color: #6b7280; margin-top: 10px; font-size: 14px;">ROI: ${data.results.roi?.toFixed(0)}% | Payback: ${data.results.paybackMonths?.toFixed(1)} months</div>
              </div>

              <div class="section">
                <div class="section-title">💰 Financial Benefits</div>
                <div class="metric">
                  <span class="label">Working Capital Released:</span>
                  <span class="value">$${data.results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Interest Savings:</span>
                  <span class="value">$${data.results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Labour Cost Savings:</span>
                  <span class="value">$${data.results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Bad Debt Reduction:</span>
                  <span class="value">$${data.results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">📊 DSO Improvement</div>
                <div class="metric">
                  <span class="label">Current DSO:</span>
                  <span class="value">${data.results.currentDSO} days</span>
                </div>
                <div class="metric">
                  <span class="label">New DSO:</span>
                  <span class="value">${data.results.newDSO?.toFixed(0)} days</span>
                </div>
                <div class="metric">
                  <span class="label">Days Reduced:</span>
                  <span class="value">${data.results.dsoReductionDays?.toFixed(0)} days</span>
                </div>
              </div>
      `
    }

    emailHtml += `
              <div class="section">
                <div class="section-title">🎯 Next Steps</div>
                <p style="margin: 10px 0;">Thank you for using our ROI Calculator! Here's what you can do next:</p>
                <ol style="margin: 10px 0; padding-left: 20px;">
                  <li style="margin: 5px 0;">Schedule a personalized demo to see Kuhlekt in action</li>
                  <li style="margin: 5px 0;">Review detailed case studies from similar companies</li>
                  <li style="margin: 5px 0;">Discuss implementation timeline and pricing</li>
                  <li style="margin: 5px 0;">Contact us at enquiries@kuhlekt.com for any questions</li>
                </ol>
              </div>

              <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
                <p><strong>Kuhlekt</strong> - Transforming Invoice-to-Cash</p>
                <p>Visit us at <a href="https://kuhlekt.com" style="color: #0891b2;">kuhlekt.com</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    // Send to customer
    await sendEmail({
      to: data.email,
      subject: emailSubject,
      html: emailHtml,
      text: `Your ROI Calculator Results from Kuhlekt`,
    })

    // Send notification to Kuhlekt
    const notificationHtml = `
      <h2>New ROI Calculator Lead</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
      <p><strong>Calculator Type:</strong> ${data.calculatorType}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <hr>
      ${emailHtml}
    `

    await sendEmail({
      to: "enquiries@kuhlekt.com",
      subject: data.company ? `New ROI Calculator Lead - ${data.company}` : `New ROI Calculator Lead - ${data.name}`,
      html: notificationHtml,
      text: `New ROI calculator submission from ${data.name} (${data.email})`,
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}
