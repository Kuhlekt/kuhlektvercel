"use server"

import { sendEmail } from "@/lib/aws-ses"

interface ROICalculatorData {
  // Simple calculator fields
  simpleDSOImprovement?: number
  simpleCostOfCapital?: number
  currentDSO?: number
  averageInvoiceValue?: number
  monthlyInvoices?: number

  // Detailed calculator fields (matching the image)
  implementationCost?: number
  monthlyCost?: number
  perAnnumDirectLabourCosts?: number
  interestType?: string
  interestRate?: number
  averageBadDebt?: number
  currentBadDebts?: number
  labourSavings?: number
  dsoImprovement?: number
  daysSales?: number
  currentDSODays?: number
  debtorsBalance?: number
  averagePaymentTerms?: string
  numberOfDebtors?: number
  numberOfCollectors?: number
  projectedCustomerGrowth?: number

  // Contact info
  email: string
  phone: string
  calculatorType: "simple" | "detailed"
}

interface ROIResults {
  // Simple results
  currentCashTied?: number
  newDSO?: number
  cashReleased?: number
  annualSavings?: number
  dsoImprovementPercent?: number

  // Detailed results
  currentDSO?: number
  dsoReductionDays?: number
  workingCapitalReleased?: number
  labourCostSavings?: number
  badDebtReduction?: number
  interestSavings?: number
  totalAnnualBenefit?: number
  totalImplementationAndAnnualCost?: number
  roi?: number
  paybackMonths?: number
}

export async function submitROICalculator(data: ROICalculatorData): Promise<{
  success: boolean
  results?: ROIResults
  error?: string
}> {
  try {
    let results: ROIResults = {}

    if (data.calculatorType === "simple") {
      // Simple ROI Calculations
      const currentDSO = data.currentDSO || 0
      const avgInvoiceValue = data.averageInvoiceValue || 0
      const monthlyInvoices = data.monthlyInvoices || 0
      const dsoImprovementPercent = (data.simpleDSOImprovement || 30) / 100
      const costOfCapitalPercent = (data.simpleCostOfCapital || 5) / 100

      const currentCashTied = (currentDSO / 30) * avgInvoiceValue * monthlyInvoices
      const newDSO = currentDSO * (1 - dsoImprovementPercent)
      const newCashTied = (newDSO / 30) * avgInvoiceValue * monthlyInvoices
      const cashReleased = currentCashTied - newCashTied
      const annualSavings = cashReleased * 12 * costOfCapitalPercent

      results = {
        currentCashTied,
        newDSO,
        cashReleased,
        annualSavings,
        dsoImprovementPercent: data.simpleDSOImprovement || 30,
      }
    } else {
      // Detailed ROI Calculations (matching the comprehensive calculator)
      const implementationCost = data.implementationCost || 0
      const monthlyCost = data.monthlyCost || 0
      const annualCost = monthlyCost * 12
      const perAnnumDirectLabourCosts = data.perAnnumDirectLabourCosts || 0
      const interestRate = (data.interestRate || 0) / 100
      const averageBadDebtPercent = data.averageBadDebt || 0
      const currentBadDebts = data.currentBadDebts || 0
      const labourSavingsPercent = (data.labourSavings || 0) / 100
      const dsoImprovementPercent = (data.dsoImprovement || 0) / 100
      const daysSales = data.daysSales || 365
      const currentDSO = data.currentDSODays || 0
      const debtorsBalance = data.debtorsBalance || 0

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

      results = {
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
    }

    // Send email notification
    const emailSubject = `New ROI Calculator Submission - ${data.calculatorType === "simple" ? "Simple" : "Detailed"}`

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
            .highlight { background: #ecfeff; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .highlight-value { font-size: 32px; font-weight: bold; color: #0891b2; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New ROI Calculator Lead</h1>
              <p>Calculator Type: ${data.calculatorType === "simple" ? "Simple ROI" : "Detailed Analysis"}</p>
            </div>
            <div class="content">
              <div class="section">
                <div class="section-title">📧 Contact Information</div>
                <div class="metric">
                  <span class="label">Email:</span>
                  <span class="value">${data.email}</span>
                </div>
                <div class="metric">
                  <span class="label">Phone:</span>
                  <span class="value">${data.phone}</span>
                </div>
                <div class="metric">
                  <span class="label">Calculator Type:</span>
                  <span class="value">${data.calculatorType === "simple" ? "Simple" : "Detailed"}</span>
                </div>
                <div class="metric">
                  <span class="label">Submission Date:</span>
                  <span class="value">${new Date().toLocaleString()}</span>
                </div>
              </div>
    `

    if (data.calculatorType === "simple") {
      emailHtml += `
              <div class="section">
                <div class="section-title">📊 Input Data</div>
                <div class="metric">
                  <span class="label">Expected DSO Improvement:</span>
                  <span class="value">${data.simpleDSOImprovement}%</span>
                </div>
                <div class="metric">
                  <span class="label">Cost of Capital:</span>
                  <span class="value">${data.simpleCostOfCapital}%</span>
                </div>
                <div class="metric">
                  <span class="label">Current DSO:</span>
                  <span class="value">${data.currentDSO} days</span>
                </div>
                <div class="metric">
                  <span class="label">Average Invoice Value:</span>
                  <span class="value">$${data.averageInvoiceValue?.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="label">Monthly Invoices:</span>
                  <span class="value">${data.monthlyInvoices?.toLocaleString()}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">💰 Calculated Results</div>
                <div class="highlight">
                  <div style="text-align: center;">
                    <div style="color: #6b7280; margin-bottom: 10px;">Annual Savings</div>
                    <div class="highlight-value">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
                <div class="metric">
                  <span class="label">Current Cash Tied Up:</span>
                  <span class="value">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">New DSO (${data.simpleDSOImprovement}% reduction):</span>
                  <span class="value">${results.newDSO?.toFixed(0)} days</span>
                </div>
                <div class="metric">
                  <span class="label">Cash Released:</span>
                  <span class="value">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
      `
    } else {
      emailHtml += `
              <div class="section">
                <div class="section-title">💰 Cost Structure</div>
                <div class="metric">
                  <span class="label">Implementation Cost:</span>
                  <span class="value">$${data.implementationCost?.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="label">Monthly Cost:</span>
                  <span class="value">$${data.monthlyCost?.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="label">Per Annum Direct Labour Costs:</span>
                  <span class="value">$${data.perAnnumDirectLabourCosts?.toLocaleString()}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">📊 Financial Metrics</div>
                <div class="metric">
                  <span class="label">Interest Type:</span>
                  <span class="value">${data.interestType === "loan" ? "Loan Interest (Cost)" : "Deposit Interest (Income)"}</span>
                </div>
                <div class="metric">
                  <span class="label">Interest Rate:</span>
                  <span class="value">${data.interestRate}%</span>
                </div>
                <div class="metric">
                  <span class="label">Average Bad Debt:</span>
                  <span class="value">${data.averageBadDebt}%</span>
                </div>
                <div class="metric">
                  <span class="label">Current Bad Debts:</span>
                  <span class="value">$${data.currentBadDebts?.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="label">Labour Savings:</span>
                  <span class="value">${data.labourSavings}%</span>
                </div>
                <div class="metric">
                  <span class="label">DSO Improvement:</span>
                  <span class="value">${data.dsoImprovement}%</span>
                </div>
                <div class="metric">
                  <span class="label">Days Sales:</span>
                  <span class="value">${data.daysSales}</span>
                </div>
                <div class="metric">
                  <span class="label">Current DSO:</span>
                  <span class="value">${data.currentDSODays} days</span>
                </div>
                <div class="metric">
                  <span class="label">Debtors Balance:</span>
                  <span class="value">$${data.debtorsBalance?.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="label">Average Payment Terms:</span>
                  <span class="value">${data.averagePaymentTerms?.toUpperCase()}</span>
                </div>
                <div class="metric">
                  <span class="label">Number of Debtors:</span>
                  <span class="value">${data.numberOfDebtors}</span>
                </div>
                <div class="metric">
                  <span class="label">Number of Collectors:</span>
                  <span class="value">${data.numberOfCollectors}</span>
                </div>
                <div class="metric">
                  <span class="label">Projected Customer Growth:</span>
                  <span class="value">${data.projectedCustomerGrowth}%</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">💰 Calculated Results</div>
                <div class="highlight">
                  <div style="text-align: center;">
                    <div style="color: #6b7280; margin-bottom: 10px;">Total Annual Benefit</div>
                    <div class="highlight-value">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    <div style="color: #6b7280; margin-top: 10px; font-size: 14px;">ROI: ${results.roi?.toFixed(0)}% | Payback: ${results.paybackMonths?.toFixed(1)} months</div>
                  </div>
                </div>
                <div class="metric">
                  <span class="label">DSO Improvement:</span>
                  <span class="value">${results.dsoReductionDays?.toFixed(0)} days (${results.currentDSO} → ${results.newDSO?.toFixed(0)})</span>
                </div>
                <div class="metric">
                  <span class="label">Working Capital Released:</span>
                  <span class="value">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Interest Savings:</span>
                  <span class="value">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Labour Cost Savings:</span>
                  <span class="value">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Bad Debt Reduction:</span>
                  <span class="value">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Total Implementation & Annual Cost:</span>
                  <span class="value">$${results.totalImplementationAndAnnualCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
      `
    }

    emailHtml += `
              <div class="section">
                <div class="section-title">🎯 Recommended Next Steps</div>
                <p style="margin: 10px 0;">1. Follow up within 24 hours via email or phone</p>
                <p style="margin: 10px 0;">2. Schedule a personalized demo to show how Kuhlekt can achieve these results</p>
                <p style="margin: 10px 0;">3. Prepare case studies from similar companies in their industry</p>
                <p style="margin: 10px 0;">4. Discuss implementation timeline and pricing options</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail({
      to: "enquiries@kuhlekt.com",
      subject: emailSubject,
      html: emailHtml,
      text: `New ROI Calculator submission from ${data.email} (${data.phone})`,
    })

    return { success: true, results }
  } catch (error) {
    console.error("Error processing ROI calculator:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process your request. Please try again.",
    }
  }
}
