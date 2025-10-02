"use server"

import { sendEmail } from "@/lib/email-service"

interface SimpleROIData {
  simpleDSOImprovement: number
  simpleCostOfCapital: number
  currentDSO: number
  averageInvoiceValue: number
  monthlyInvoices: number
  email: string
  phone: string
  calculatorType: "simple"
}

interface DetailedROIData {
  implementationCost: number
  monthlyCost: number
  perAnnumDirectLabourCosts: number
  interestType: string
  interestRate: number
  averageBadDebt: number
  currentBadDebts: number
  labourSavings: number
  dsoImprovement: number
  daysSales: number
  currentDSODays: number
  debtorsBalance: number
  averagePaymentTerms: string
  numberOfDebtors: number
  numberOfCollectors: number
  projectedCustomerGrowth: number
  email: string
  phone: string
  calculatorType: "detailed"
}

type ROIData = SimpleROIData | DetailedROIData

function calculateSimpleROI(data: SimpleROIData) {
  const { simpleDSOImprovement, simpleCostOfCapital, currentDSO, averageInvoiceValue, monthlyInvoices } = data

  // Calculate annual revenue
  const annualRevenue = averageInvoiceValue * monthlyInvoices * 12

  // Calculate new DSO after improvement
  const dsoReductionPercent = simpleDSOImprovement / 100
  const newDSO = currentDSO * (1 - dsoReductionPercent)
  const dsoReductionDays = currentDSO - newDSO

  // Calculate cash released from DSO improvement
  const dailyRevenue = annualRevenue / 365
  const cashReleased = dailyRevenue * dsoReductionDays

  // Calculate annual savings from cost of capital
  const annualSavings = cashReleased * (simpleCostOfCapital / 100)

  return {
    annualSavings,
    cashReleased,
    newDSO,
    dsoImprovementPercent: simpleDSOImprovement,
    currentDSO,
  }
}

function calculateDetailedROI(data: DetailedROIData) {
  const {
    implementationCost,
    monthlyCost,
    perAnnumDirectLabourCosts,
    interestRate,
    averageBadDebt,
    currentBadDebts,
    labourSavings,
    dsoImprovement,
    currentDSODays,
    debtorsBalance,
  } = data

  // Calculate annual cost
  const annualSoftwareCost = monthlyCost * 12

  // Calculate DSO improvement
  const dsoReductionPercent = dsoImprovement / 100
  const newDSO = currentDSODays * (1 - dsoReductionPercent)
  const dsoReductionDays = currentDSODays - newDSO

  // Calculate working capital released
  const dailyRevenue = debtorsBalance / currentDSODays
  const workingCapitalReleased = dailyRevenue * dsoReductionDays

  // Calculate interest savings
  const interestSavings = workingCapitalReleased * (interestRate / 100)

  // Calculate labour cost savings
  const labourSavingsPercent = labourSavings / 100
  const labourCostSavings = perAnnumDirectLabourCosts * labourSavingsPercent

  // Calculate bad debt reduction (assume 40% reduction)
  const badDebtReductionPercent = 0.4
  const badDebtReduction = currentBadDebts * badDebtReductionPercent

  // Calculate total annual benefit
  const totalAnnualBenefit = interestSavings + labourCostSavings + badDebtReduction

  // Calculate total annual cost
  const totalAnnualCost = annualSoftwareCost + implementationCost / 3 // Amortize implementation over 3 years

  // Calculate net annual benefit
  const netAnnualBenefit = totalAnnualBenefit - totalAnnualCost

  // Calculate ROI
  const roi = (netAnnualBenefit / (implementationCost + annualSoftwareCost)) * 100

  // Calculate payback period
  const paybackMonths = implementationCost / (totalAnnualBenefit / 12)

  return {
    totalAnnualBenefit,
    roi,
    paybackMonths,
    dsoReductionDays,
    workingCapitalReleased,
    labourCostSavings,
    badDebtReduction,
    currentDSO: currentDSODays,
    newDSO,
    interestSavings,
  }
}

export async function submitROICalculator(data: ROIData) {
  try {
    // Calculate results based on calculator type
    const results = data.calculatorType === "simple" ? calculateSimpleROI(data) : calculateDetailedROI(data)

    // Format email content
    const emailSubject = `ROI Calculator Submission - ${data.calculatorType === "simple" ? "Simple" : "Detailed"} Analysis`

    let emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .section-title { color: #06b6d4; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #06b6d4; padding-bottom: 10px; }
            .data-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .data-label { font-weight: 600; color: #4b5563; }
            .data-value { color: #111827; }
            .highlight { background: #ecfeff; padding: 20px; border-radius: 8px; border-left: 4px solid #06b6d4; }
            .result-box { background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .result-value { font-size: 32px; font-weight: bold; color: #0891b2; margin: 10px 0; }
            .result-label { font-size: 14px; color: #4b5563; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧮 ROI Calculator Results</h1>
              <p style="margin: 0; opacity: 0.9;">${data.calculatorType === "simple" ? "Simple ROI" : "Detailed Invoice-to-Cash"} Analysis</p>
            </div>
            <div class="content">
    `

    if (data.calculatorType === "simple") {
      const simpleResults = results as ReturnType<typeof calculateSimpleROI>
      emailHtml += `
              <div class="section">
                <div class="section-title">📊 Contact Information</div>
                <div class="data-row">
                  <span class="data-label">Email:</span>
                  <span class="data-value">${data.email}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Phone:</span>
                  <span class="data-value">${data.phone}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">📝 Input Data</div>
                <div class="data-row">
                  <span class="data-label">Expected DSO Improvement:</span>
                  <span class="data-value">${data.simpleDSOImprovement}%</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Cost of Capital:</span>
                  <span class="data-value">${data.simpleCostOfCapital}%</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Current DSO:</span>
                  <span class="data-value">${data.currentDSO} days</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Average Invoice Value:</span>
                  <span class="data-value">$${data.averageInvoiceValue.toLocaleString()}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Monthly Invoices:</span>
                  <span class="data-value">${data.monthlyInvoices}</span>
                </div>
              </div>

              <div class="result-box">
                <div class="result-label">Estimated Annual Savings</div>
                <div class="result-value">$${simpleResults.annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>

              <div class="section">
                <div class="section-title">💰 Detailed Results</div>
                <div class="data-row">
                  <span class="data-label">Cash Released:</span>
                  <span class="data-value">$${simpleResults.cashReleased.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Current DSO:</span>
                  <span class="data-value">${simpleResults.currentDSO} days</span>
                </div>
                <div class="data-row">
                  <span class="data-label">New DSO:</span>
                  <span class="data-value">${simpleResults.newDSO.toFixed(0)} days (${simpleResults.dsoImprovementPercent}% improvement)</span>
                </div>
              </div>
      `
    } else {
      const detailedResults = results as ReturnType<typeof calculateDetailedROI>
      emailHtml += `
              <div class="section">
                <div class="section-title">📊 Contact Information</div>
                <div class="data-row">
                  <span class="data-label">Email:</span>
                  <span class="data-value">${data.email}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Phone:</span>
                  <span class="data-value">${data.phone}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">💰 Cost Structure</div>
                <div class="data-row">
                  <span class="data-label">Implementation Cost:</span>
                  <span class="data-value">$${data.implementationCost.toLocaleString()}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Monthly Cost:</span>
                  <span class="data-value">$${data.monthlyCost.toLocaleString()}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Annual Labour Costs:</span>
                  <span class="data-value">$${data.perAnnumDirectLabourCosts.toLocaleString()}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">🏦 Financial Metrics</div>
                <div class="data-row">
                  <span class="data-label">Interest Type:</span>
                  <span class="data-value">${data.interestType === "loan" ? "Loan Interest" : "Deposit Interest"}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Interest Rate:</span>
                  <span class="data-value">${data.interestRate}%</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Current DSO:</span>
                  <span class="data-value">${data.currentDSODays} days</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Debtors Balance:</span>
                  <span class="data-value">$${data.debtorsBalance.toLocaleString()}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Average Bad Debt:</span>
                  <span class="data-value">${data.averageBadDebt}%</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Current Bad Debts:</span>
                  <span class="data-value">$${data.currentBadDebts.toLocaleString()}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">📈 Expected Improvements</div>
                <div class="data-row">
                  <span class="data-label">Labour Savings:</span>
                  <span class="data-value">${data.labourSavings}%</span>
                </div>
                <div class="data-row">
                  <span class="data-label">DSO Improvement:</span>
                  <span class="data-value">${data.dsoImprovement}%</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">👥 Team Structure</div>
                <div class="data-row">
                  <span class="data-label">Number of Debtors:</span>
                  <span class="data-value">${data.numberOfDebtors}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Number of Collectors:</span>
                  <span class="data-value">${data.numberOfCollectors}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Projected Growth:</span>
                  <span class="data-value">${data.projectedCustomerGrowth}%</span>
                </div>
              </div>

              <div class="result-box">
                <div class="result-label">Total Annual Benefit</div>
                <div class="result-value">$${detailedResults.totalAnnualBenefit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <p style="margin: 10px 0 0 0; color: #4b5563;">ROI: ${detailedResults.roi.toFixed(0)}% | Payback: ${detailedResults.paybackMonths.toFixed(1)} months</p>
              </div>

              <div class="section">
                <div class="section-title">💰 Detailed Results</div>
                <div class="data-row">
                  <span class="data-label">DSO Reduction:</span>
                  <span class="data-value">${detailedResults.dsoReductionDays.toFixed(0)} days (from ${detailedResults.currentDSO} to ${detailedResults.newDSO.toFixed(0)} days)</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Working Capital Released:</span>
                  <span class="data-value">$${detailedResults.workingCapitalReleased.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Interest Savings:</span>
                  <span class="data-value">$${detailedResults.interestSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Labour Cost Savings:</span>
                  <span class="data-value">$${detailedResults.labourCostSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Bad Debt Reduction:</span>
                  <span class="data-value">$${detailedResults.badDebtReduction.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
      `
    }

    emailHtml += `
              <div class="highlight">
                <p style="margin: 0;"><strong>⚡ Next Steps:</strong></p>
                <p style="margin: 10px 0 0 0;">Follow up with this lead to discuss their specific requirements and schedule a product demo.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email
    await sendEmail({
      to: "enquiries@kuhlekt.com",
      subject: emailSubject,
      html: emailHtml,
    })

    return {
      success: true,
      results,
    }
  } catch (error) {
    console.error("ROI Calculator Error:", error)
    return {
      success: false,
      error: "Failed to calculate ROI. Please try again.",
    }
  }
}
