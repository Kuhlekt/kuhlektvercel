"use server"

import { sendEmail } from "@/lib/aws-ses"

export interface ROICalculatorInputs {
  companyName: string
  email: string
  annualRevenue: number
  averageInvoiceValue: number
  numberOfInvoices: number
  currentDSO: number
  badDebtPercentage: number
}

export interface ROIResults {
  currentMetrics: {
    totalAR: number
    annualBadDebt: number
    staffCosts: number
    totalCurrentCost: number
  }
  projectedMetrics: {
    newDSO: number
    totalAR: number
    annualBadDebt: number
    staffCosts: number
    totalProjectedCost: number
  }
  savings: {
    dsoImprovement: number
    cashFlowImprovement: number
    badDebtReduction: number
    staffCostSavings: number
    totalAnnualSavings: number
    threeYearSavings: number
    roi: number
    paybackMonths: number
  }
}

export async function calculateROI(inputs: ROICalculatorInputs): Promise<ROIResults> {
  const { annualRevenue, averageInvoiceValue, numberOfInvoices, currentDSO, badDebtPercentage } = inputs

  // Current state calculations
  const currentTotalAR = (annualRevenue / 365) * currentDSO
  const currentBadDebt = annualRevenue * (badDebtPercentage / 100)
  const currentStaffCosts = numberOfInvoices * 15 * 12 // $15 per invoice per month

  // Projected improvements with Kuhlekt
  const dsoReduction = Math.min(currentDSO * 0.35, 25) // 35% reduction, max 25 days
  const newDSO = currentDSO - dsoReduction
  const projectedTotalAR = (annualRevenue / 365) * newDSO
  const projectedBadDebt = currentBadDebt * 0.5 // 50% reduction
  const projectedStaffCosts = currentStaffCosts * 0.4 // 60% staff time reduction

  // Savings calculations
  const cashFlowImprovement = currentTotalAR - projectedTotalAR
  const badDebtReduction = currentBadDebt - projectedBadDebt
  const staffCostSavings = currentStaffCosts - projectedStaffCosts
  const totalAnnualSavings = cashFlowImprovement + badDebtReduction + staffCostSavings

  const estimatedCost = 24000 // Annual Kuhlekt subscription
  const roi = ((totalAnnualSavings - estimatedCost) / estimatedCost) * 100
  const paybackMonths = (estimatedCost / totalAnnualSavings) * 12

  return {
    currentMetrics: {
      totalAR: currentTotalAR,
      annualBadDebt: currentBadDebt,
      staffCosts: currentStaffCosts,
      totalCurrentCost: currentBadDebt + currentStaffCosts,
    },
    projectedMetrics: {
      newDSO,
      totalAR: projectedTotalAR,
      annualBadDebt: projectedBadDebt,
      staffCosts: projectedStaffCosts,
      totalProjectedCost: projectedBadDebt + projectedStaffCosts + estimatedCost,
    },
    savings: {
      dsoImprovement: dsoReduction,
      cashFlowImprovement,
      badDebtReduction,
      staffCostSavings,
      totalAnnualSavings,
      threeYearSavings: totalAnnualSavings * 3,
      roi,
      paybackMonths,
    },
  }
}

export async function sendROIReport(
  inputs: ROICalculatorInputs,
  results: ROIResults,
): Promise<{ success: boolean; message: string }> {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .metric { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
            .metric-label { font-weight: bold; color: #667eea; }
            .metric-value { font-size: 24px; color: #333; margin: 5px 0; }
            .savings { background: #e8f5e9; border-left-color: #4caf50; }
            .footer { text-align: center; padding: 20px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Custom ROI Analysis</h1>
              <p>From Kuhlekt</p>
            </div>
            <div class="content">
              <p>Dear ${inputs.companyName},</p>
              <p>Thank you for using our ROI Calculator. Based on your inputs, here's your personalized analysis:</p>
              
              <h2>Current State</h2>
              <div class="metric">
                <div class="metric-label">Days Sales Outstanding (DSO)</div>
                <div class="metric-value">${inputs.currentDSO} days</div>
              </div>
              <div class="metric">
                <div class="metric-label">Total Accounts Receivable</div>
                <div class="metric-value">$${results.currentMetrics.totalAR.toLocaleString()}</div>
              </div>
              <div class="metric">
                <div class="metric-label">Annual Bad Debt</div>
                <div class="metric-value">$${results.currentMetrics.annualBadDebt.toLocaleString()}</div>
              </div>
              
              <h2>Projected with Kuhlekt</h2>
              <div class="metric savings">
                <div class="metric-label">New DSO</div>
                <div class="metric-value">${results.projectedMetrics.newDSO.toFixed(1)} days</div>
              </div>
              <div class="metric savings">
                <div class="metric-label">DSO Improvement</div>
                <div class="metric-value">${results.savings.dsoImprovement.toFixed(1)} days faster</div>
              </div>
              
              <h2>Your Potential Savings</h2>
              <div class="metric savings">
                <div class="metric-label">Cash Flow Improvement</div>
                <div class="metric-value">$${results.savings.cashFlowImprovement.toLocaleString()}</div>
              </div>
              <div class="metric savings">
                <div class="metric-label">Bad Debt Reduction</div>
                <div class="metric-value">$${results.savings.badDebtReduction.toLocaleString()}/year</div>
              </div>
              <div class="metric savings">
                <div class="metric-label">Staff Cost Savings</div>
                <div class="metric-value">$${results.savings.staffCostSavings.toLocaleString()}/year</div>
              </div>
              <div class="metric savings">
                <div class="metric-label">Total Annual Savings</div>
                <div class="metric-value">$${results.savings.totalAnnualSavings.toLocaleString()}</div>
              </div>
              <div class="metric savings">
                <div class="metric-label">3-Year Total Savings</div>
                <div class="metric-value">$${results.savings.threeYearSavings.toLocaleString()}</div>
              </div>
              <div class="metric savings">
                <div class="metric-label">Return on Investment</div>
                <div class="metric-value">${results.savings.roi.toFixed(0)}%</div>
              </div>
              <div class="metric savings">
                <div class="metric-label">Payback Period</div>
                <div class="metric-value">${results.savings.paybackMonths.toFixed(1)} months</div>
              </div>
              
              <p style="margin-top: 30px;">Ready to unlock these savings? Our team would love to discuss how Kuhlekt can transform your accounts receivable process.</p>
              <p style="text-align: center; margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://kuhlekt.com"}/demo" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Schedule a Demo</a>
              </p>
            </div>
            <div class="footer">
              <p>Questions? Contact us at sales@kuhlekt.com</p>
              <p>© 2025 Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
Your Custom ROI Analysis from Kuhlekt

Dear ${inputs.companyName},

Thank you for using our ROI Calculator. Based on your inputs, here's your personalized analysis:

CURRENT STATE
Days Sales Outstanding: ${inputs.currentDSO} days
Total Accounts Receivable: $${results.currentMetrics.totalAR.toLocaleString()}
Annual Bad Debt: $${results.currentMetrics.annualBadDebt.toLocaleString()}

PROJECTED WITH KUHLEKT
New DSO: ${results.projectedMetrics.newDSO.toFixed(1)} days
DSO Improvement: ${results.savings.dsoImprovement.toFixed(1)} days faster

YOUR POTENTIAL SAVINGS
Cash Flow Improvement: $${results.savings.cashFlowImprovement.toLocaleString()}
Bad Debt Reduction: $${results.savings.badDebtReduction.toLocaleString()}/year
Staff Cost Savings: $${results.savings.staffCostSavings.toLocaleString()}/year
Total Annual Savings: $${results.savings.totalAnnualSavings.toLocaleString()}
3-Year Total Savings: $${results.savings.threeYearSavings.toLocaleString()}
Return on Investment: ${results.savings.roi.toFixed(0)}%
Payback Period: ${results.savings.paybackMonths.toFixed(1)} months

Ready to unlock these savings? Schedule a demo at ${process.env.NEXT_PUBLIC_SITE_URL || "https://kuhlekt.com"}/demo

Questions? Contact us at sales@kuhlekt.com

© 2025 Kuhlekt. All rights reserved.
    `

    const result = await sendEmail({
      to: inputs.email,
      subject: `Your Custom ROI Analysis - ${inputs.companyName}`,
      text: emailText,
      html: emailHtml,
    })

    return result
  } catch (error) {
    console.error("Error in sendROIReport:", error)
    return {
      success: false,
      message: "Failed to send ROI report",
    }
  }
}
