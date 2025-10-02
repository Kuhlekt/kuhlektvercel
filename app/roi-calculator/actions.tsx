"use server"

import { sendEmail } from "@/lib/aws-ses"

interface ROICalculatorData {
  // Simple calculator fields
  currentDSO?: number
  averageInvoiceValue?: number
  monthlyInvoices?: number

  // Detailed calculator fields
  annualRevenue?: number
  invoicesPerMonth?: number
  averagePaymentDays?: number
  arTeamSize?: number
  avgHourlyRate?: number
  hoursPerWeekOnAR?: number
  badDebtPercentage?: number

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

  // Detailed results
  dsoReduction?: number
  dsoReductionDays?: number
  cashFlowImprovement?: number
  timeSavingsHours?: number
  timeSavingsDollars?: number
  badDebtReduction?: number
  totalAnnualBenefit?: number
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

      const currentCashTied = (currentDSO / 30) * avgInvoiceValue * monthlyInvoices
      const dsoReduction = 0.3 // 30% reduction
      const newDSO = currentDSO * (1 - dsoReduction)
      const newCashTied = (newDSO / 30) * avgInvoiceValue * monthlyInvoices
      const cashReleased = currentCashTied - newCashTied
      const annualSavings = cashReleased * 12 * 0.05 // Assuming 5% cost of capital

      results = {
        currentCashTied,
        newDSO,
        cashReleased,
        annualSavings,
      }
    } else {
      // Detailed ROI Calculations
      const annualRevenue = data.annualRevenue || 0
      const invoicesPerMonth = data.invoicesPerMonth || 0
      const avgPaymentDays = data.averagePaymentDays || 0
      const arTeamSize = data.arTeamSize || 0
      const avgHourlyRate = data.avgHourlyRate || 0
      const hoursPerWeek = data.hoursPerWeekOnAR || 0
      const badDebtPercentage = data.badDebtPercentage || 0

      // DSO Reduction (30% improvement)
      const dsoReduction = 0.3
      const dsoReductionDays = avgPaymentDays * dsoReduction
      const newDSO = avgPaymentDays - dsoReductionDays

      // Cash Flow Improvement
      const dailyRevenue = annualRevenue / 365
      const cashFlowImprovement = dailyRevenue * dsoReductionDays

      // Time Savings (80% reduction in manual work)
      const timeSavingsPercent = 0.8
      const annualHours = hoursPerWeek * 52 * arTeamSize
      const timeSavingsHours = annualHours * timeSavingsPercent
      const timeSavingsDollars = timeSavingsHours * avgHourlyRate

      // Bad Debt Reduction (25% improvement)
      const badDebtReduction = annualRevenue * (badDebtPercentage / 100) * 0.25

      // Total Annual Benefit
      const totalAnnualBenefit = cashFlowImprovement * 0.05 + timeSavingsDollars + badDebtReduction

      // ROI Calculation (assuming $50k annual cost)
      const estimatedAnnualCost = 50000
      const roi = (totalAnnualBenefit / estimatedAnnualCost) * 100
      const paybackMonths = (estimatedAnnualCost / totalAnnualBenefit) * 12

      results = {
        dsoReduction: dsoReduction * 100,
        dsoReductionDays,
        cashFlowImprovement,
        timeSavingsHours,
        timeSavingsDollars,
        badDebtReduction,
        totalAnnualBenefit,
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
                  <span class="label">New DSO (30% reduction):</span>
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
                <div class="section-title">📊 Input Data</div>
                <div class="metric">
                  <span class="label">Annual Revenue:</span>
                  <span class="value">$${data.annualRevenue?.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="label">Invoices Per Month:</span>
                  <span class="value">${data.invoicesPerMonth?.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="label">Average Payment Days (DSO):</span>
                  <span class="value">${data.averagePaymentDays} days</span>
                </div>
                <div class="metric">
                  <span class="label">AR Team Size:</span>
                  <span class="value">${data.arTeamSize} people</span>
                </div>
                <div class="metric">
                  <span class="label">Average Hourly Rate:</span>
                  <span class="value">$${data.avgHourlyRate?.toFixed(2)}</span>
                </div>
                <div class="metric">
                  <span class="label">Hours/Week on AR:</span>
                  <span class="value">${data.hoursPerWeekOnAR} hours</span>
                </div>
                <div class="metric">
                  <span class="label">Bad Debt %:</span>
                  <span class="value">${data.badDebtPercentage}%</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">💰 Calculated Results</div>
                <div class="highlight">
                  <div style="text-align: center;">
                    <div style="color: #6b7280; margin-bottom: 10px;">Projected ROI</div>
                    <div class="highlight-value">${results.roi?.toFixed(0)}%</div>
                  </div>
                </div>
                <div class="metric">
                  <span class="label">DSO Reduction:</span>
                  <span class="value">${results.dsoReductionDays?.toFixed(0)} days (${results.dsoReduction?.toFixed(0)}%)</span>
                </div>
                <div class="metric">
                  <span class="label">Cash Flow Improvement:</span>
                  <span class="value">$${results.cashFlowImprovement?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Time Savings:</span>
                  <span class="value">${results.timeSavingsHours?.toLocaleString(undefined, { maximumFractionDigits: 0 })} hours/year</span>
                </div>
                <div class="metric">
                  <span class="label">Labor Cost Savings:</span>
                  <span class="value">$${results.timeSavingsDollars?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Bad Debt Reduction:</span>
                  <span class="value">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Total Annual Benefit:</span>
                  <span class="value">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Payback Period:</span>
                  <span class="value">${results.paybackMonths?.toFixed(1)} months</span>
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
      error: "Failed to process your request. Please try again.",
    }
  }
}
