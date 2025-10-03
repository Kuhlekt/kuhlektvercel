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

    const implementationCost = Number.parseFloat(inputs.implementationCost) || 0
    const monthlyCost = Number.parseFloat(inputs.monthlyCost) || 0
    const annualCost = monthlyCost * 12
    const perAnnumDirectLabourCosts = Number.parseFloat(inputs.perAnnumDirectLabourCosts) || 0
    const interestRate = (Number.parseFloat(inputs.interestRate) || 0) / 100
    const averageBadDebtPercent = (Number.parseFloat(inputs.averageBadDebt) || 0) / 100
    const currentBadDebts = Number.parseFloat(inputs.currentBadDebts) || 0
    const labourSavingsPercent = (Number.parseFloat(inputs.labourSavings) || 0) / 100
    const dsoImprovementPercent = (Number.parseFloat(inputs.dsoImprovement) || 0) / 100
    const daysSales = 365
    const currentDSO = Number.parseFloat(inputs.currentDSODays) || 0
    const debtorsBalance = Number.parseFloat(inputs.debtorsBalance) || 0

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

    if (currentDSO <= 0 || debtorsBalance <= 0) {
      throw new Error("Current DSO and Debtors Balance are required and must be greater than 0")
    }

    // Calculate annual revenue from debtors balance and DSO
    const annualRevenue = (debtorsBalance / currentDSO) * daysSales

    // DSO Improvement
    const dsoReductionDays = currentDSO * dsoImprovementPercent
    const newDSO = Math.max(0, currentDSO - dsoReductionDays)

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
      currentDSO: isNaN(currentDSO) ? 0 : currentDSO,
      newDSO: isNaN(newDSO) ? 0 : newDSO,
      dsoReductionDays: isNaN(dsoReductionDays) ? 0 : dsoReductionDays,
      workingCapitalReleased: isNaN(workingCapitalReleased) ? 0 : workingCapitalReleased,
      labourCostSavings: isNaN(labourCostSavings) ? 0 : labourCostSavings,
      badDebtReduction: isNaN(badDebtReduction) ? 0 : badDebtReduction,
      interestSavings: isNaN(interestSavings) ? 0 : interestSavings,
      totalAnnualBenefit: isNaN(totalAnnualBenefit) ? 0 : totalAnnualBenefit,
      totalImplementationAndAnnualCost: isNaN(totalImplementationAndAnnualCost) ? 0 : totalImplementationAndAnnualCost,
      roi: isNaN(roi) ? 0 : roi,
      paybackMonths: isNaN(paybackMonths) ? 0 : paybackMonths,
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

    let adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; background: white; }
            .container { max-width: 900px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 30px; }
            .lead-info { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 30px; border-radius: 4px; }
            .lead-info h2 { color: #92400e; margin-bottom: 15px; }
            .lead-info .metric { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fde68a; }
            .lead-info .metric:last-child { border-bottom: none; }
            .section { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
            .section-title { color: #0891b2; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #0891b2; padding-bottom: 10px; }
            .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
            .metric-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; background: #f9fafb; }
            .metric-label { color: #6b7280; font-size: 14px; margin-bottom: 5px; }
            .metric-value { color: #0891b2; font-size: 24px; font-weight: bold; }
            .highlight { background: #ecfeff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .highlight-value { font-size: 36px; font-weight: bold; color: #0891b2; }
            .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .data-table th { background: #f3f4f6; padding: 10px; text-align: left; border-bottom: 2px solid #0891b2; }
            .data-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New ROI Calculator Lead</h1>
              <p>${data.calculatorType === "simple" ? "Simple ROI Analysis" : "Detailed ROI Analysis"}</p>
              <p style="font-size: 14px; margin-top: 10px;">${new Date().toLocaleString()}</p>
            </div>

            <div class="lead-info">
              <h2>📧 Lead Contact Information</h2>
              <div class="metric">
                <span style="font-weight: 600;">Name:</span>
                <span style="font-weight: bold;">${data.name}</span>
              </div>
              <div class="metric">
                <span style="font-weight: 600;">Email:</span>
                <span style="font-weight: bold;">${data.email}</span>
              </div>
              ${
                data.company
                  ? `
              <div class="metric">
                <span style="font-weight: 600;">Company:</span>
                <span style="font-weight: bold;">${data.company}</span>
              </div>
              `
                  : ""
              }
              <div class="metric">
                <span style="font-weight: 600;">Calculator Type:</span>
                <span style="font-weight: bold;">${data.calculatorType === "simple" ? "Simple ROI" : "Detailed ROI"}</span>
              </div>
              <div class="metric">
                <span style="font-weight: 600;">Submission Date:</span>
                <span style="font-weight: bold;">${new Date().toLocaleDateString()}</span>
              </div>
            </div>
    `

    if (data.calculatorType === "simple") {
      adminEmailHtml += `
            <div class="highlight">
              <div style="color: #6b7280; margin-bottom: 10px;">Estimated Annual Savings</div>
              <div class="highlight-value">$${data.results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>

            <div class="section">
              <div class="section-title">📊 Key Results Summary</div>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-label">Current Cash Tied Up</div>
                  <div class="metric-value">$${data.results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Cash Released</div>
                  <div class="metric-value">$${data.results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Current DSO</div>
                  <div class="metric-value">${data.inputs.currentDSO} days</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">New DSO</div>
                  <div class="metric-value">${data.results.newDSO?.toFixed(0)} days</div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">📈 Input Data</div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Current DSO (Days)</td><td>${data.inputs.currentDSO}</td></tr>
                  <tr><td>Average Invoice Value</td><td>$${Number.parseFloat(data.inputs.averageInvoiceValue).toLocaleString()}</td></tr>
                  <tr><td>Monthly Invoices</td><td>${data.inputs.monthlyInvoices}</td></tr>
                  <tr><td>Expected DSO Improvement</td><td>${data.inputs.simpleDSOImprovement}%</td></tr>
                  <tr><td>Cost of Capital</td><td>${data.inputs.simpleCostOfCapital}%</td></tr>
                </tbody>
              </table>
            </div>
      `
    } else {
      adminEmailHtml += `
            <div class="section">
              <div class="section-title">💰 Top Metrics</div>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-label">ROI</div>
                  <div class="metric-value">${data.results.roi?.toFixed(1) || 0}%</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Payback Period</div>
                  <div class="metric-value">${data.results.paybackMonths?.toFixed(1) || 0} months</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Total Annual Benefit</div>
                  <div class="metric-value">$${data.results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Working Capital Released</div>
                  <div class="metric-value">$${data.results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">💰 Financial Benefits Breakdown</div>
              <table class="data-table">
                <tbody>
                  <tr>
                    <td><strong>Working Capital Released</strong></td>
                    <td style="text-align: right; color: #0891b2; font-weight: bold;">$${data.results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr>
                    <td><strong>Interest Savings</strong></td>
                    <td style="text-align: right; color: #0891b2; font-weight: bold;">$${data.results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr>
                    <td><strong>Labour Cost Savings</strong></td>
                    <td style="text-align: right; color: #0891b2; font-weight: bold;">$${data.results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr>
                    <td><strong>Bad Debt Reduction</strong></td>
                    <td style="text-align: right; color: #0891b2; font-weight: bold;">$${data.results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr style="background: #f0fdf4;">
                    <td><strong>Total Annual Benefit</strong></td>
                    <td style="text-align: right; color: #10b981; font-weight: bold; font-size: 18px;">$${data.results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="section">
              <div class="section-title">📊 DSO Improvement</div>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-label">Current DSO</div>
                  <div class="metric-value">${data.results.currentDSO} days</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">New DSO</div>
                  <div class="metric-value">${data.results.newDSO?.toFixed(0)} days</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Days Reduced</div>
                  <div class="metric-value">${data.results.dsoReductionDays?.toFixed(0)} days</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">DSO Improvement</div>
                  <div class="metric-value">${data.inputs.dsoImprovement}%</div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">📈 All Input Data</div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Implementation Cost</td><td>$${Number.parseFloat(data.inputs.implementationCost || "0").toLocaleString()}</td></tr>
                  <tr><td>Monthly Cost</td><td>$${Number.parseFloat(data.inputs.monthlyCost || "0").toLocaleString()}</td></tr>
                  <tr><td>Current DSO Days</td><td>${data.inputs.currentDSODays}</td></tr>
                  <tr><td>Debtors Balance</td><td>$${Number.parseFloat(data.inputs.debtorsBalance || "0").toLocaleString()}</td></tr>
                  <tr><td>Interest Type</td><td>${data.inputs.interestType === "loan" ? "Loan Interest" : "Deposit Interest"}</td></tr>
                  <tr><td>Interest Rate</td><td>${data.inputs.interestRate}%</td></tr>
                  <tr><td>Per Annum Direct Labour Costs</td><td>$${Number.parseFloat(data.inputs.perAnnumDirectLabourCosts || "0").toLocaleString()}</td></tr>
                  <tr><td>Current Bad Debts</td><td>$${Number.parseFloat(data.inputs.currentBadDebts || "0").toLocaleString()}</td></tr>
                  <tr><td>Average Bad Debt</td><td>${data.inputs.averageBadDebt}%</td></tr>
                  <tr><td>DSO Improvement</td><td>${data.inputs.dsoImprovement}%</td></tr>
                  <tr><td>Labour Savings</td><td>${data.inputs.labourSavings}%</td></tr>
                  <tr><td>Number of Debtors</td><td>${data.inputs.numberOfDebtors}</td></tr>
                  <tr><td>Number of Collectors</td><td>${data.inputs.numberOfCollectors}</td></tr>
                  <tr><td>Projected Customer Growth</td><td>${data.inputs.projectedCustomerGrowth}%</td></tr>
                  <tr><td>Average Payment Terms</td><td>${data.inputs.averagePaymentTerms === "net30" ? "Net 30" : data.inputs.averagePaymentTerms === "net60" ? "Net 60" : "Net 90"}</td></tr>
                </tbody>
              </table>
            </div>
      `
    }

    adminEmailHtml += `
            <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin-top: 30px; border-radius: 4px;">
              <h3 style="color: #166534; margin-bottom: 10px;">🎯 Follow-Up Actions</h3>
              <ul style="margin-left: 20px; color: #166534;">
                <li>Contact ${data.name} at ${data.email} to discuss their results</li>
                <li>Schedule a personalized demonstration</li>
                <li>Prepare pricing proposal based on their business size</li>
                <li>Discuss implementation timeline and requirements</li>
              </ul>
            </div>

            <div style="text-align: center; padding: 20px; margin-top: 30px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p><strong>Kuhlekt</strong> - Transforming Invoice-to-Cash</p>
              <p>This is an automated notification from the ROI Calculator</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail({
      to: "enquiries@kuhlekt.com",
      subject: data.company ? `New ROI Calculator Lead - ${data.company}` : `New ROI Calculator Lead - ${data.name}`,
      html: adminEmailHtml,
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
