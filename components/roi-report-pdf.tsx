"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ROIReportPDFProps {
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}

export function ROIReportPDF({ calculatorType, results, inputs }: ROIReportPDFProps) {
  const generatePDF = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const logoUrl = `${window.location.origin}/images/kuhlekt-logo-tm.png`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Kuhlekt ROI Analysis Report</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #1f2937;
              padding: 40px;
              max-width: 1000px;
              margin: 0 auto;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 30px;
              border-bottom: 3px solid #0891b2;
            }
            
            .logo-container {
              margin-bottom: 20px;
            }
            
            .logo {
              max-width: 300px;
              height: auto;
            }
            
            .report-title {
              font-size: 28px;
              font-weight: bold;
              color: #111827;
              margin-bottom: 10px;
            }
            
            .report-subtitle {
              font-size: 16px;
              color: #6b7280;
              margin-bottom: 5px;
            }
            
            .report-date {
              font-size: 14px;
              color: #9ca3af;
            }
            
            .summary-box {
              background: linear-gradient(135deg, #ecfeff 0%, #e0f2fe 100%);
              border: 2px solid #0891b2;
              border-radius: 12px;
              padding: 30px;
              margin: 30px 0;
              text-align: center;
            }
            
            .summary-label {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .summary-value {
              font-size: 48px;
              font-weight: bold;
              color: #0891b2;
              margin-bottom: 10px;
            }
            
            .summary-detail {
              font-size: 14px;
              color: #4b5563;
            }
            
            .section {
              margin: 30px 0;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #0891b2;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-bottom: 20px;
            }
            
            .metric-card {
              background: white;
              border: 1px solid #e5e7eb;
              border-left: 4px solid #0891b2;
              border-radius: 8px;
              padding: 20px;
            }
            
            .metric-label {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 8px;
            }
            
            .metric-value {
              font-size: 24px;
              font-weight: bold;
              color: #111827;
            }
            
            .metric-subtext {
              font-size: 12px;
              color: #059669;
              margin-top: 5px;
            }
            
            .input-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            
            .input-table th,
            .input-table td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .input-table th {
              background: #f9fafb;
              font-weight: 600;
              color: #374151;
            }
            
            .input-table td:last-child {
              text-align: right;
              font-weight: 600;
              color: #0891b2;
            }
            
            .callout {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            
            .callout-title {
              font-weight: bold;
              color: #92400e;
              margin-bottom: 10px;
            }
            
            .callout-text {
              color: #78350f;
              font-size: 14px;
            }
            
            .footer {
              margin-top: 50px;
              padding-top: 30px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
            
            .footer-contact {
              margin-top: 15px;
              font-size: 14px;
              color: #4b5563;
            }
            
            .footer-contact a {
              color: #0891b2;
              text-decoration: none;
            }
            
            @media print {
              body {
                padding: 20px;
              }
              
              .summary-box {
                page-break-inside: avoid;
              }
              
              .section {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-container">
              <img src="${logoUrl}" alt="Kuhlekt Logo" class="logo" />
            </div>
            <h1 class="report-title">ROI Analysis Report</h1>
            <p class="report-subtitle">${calculatorType === "simple" ? "Simple ROI Calculator" : "Comprehensive Invoice-to-Cash Analysis"}</p>
            <p class="report-date">Generated on ${currentDate}</p>
          </div>

          ${
            calculatorType === "simple"
              ? `
             Simple Calculator Report 
            <div class="summary-box">
              <div class="summary-label">Estimated Annual Savings</div>
              <div class="summary-value">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              <div class="summary-detail">
                Based on ${results.dsoImprovementPercent}% DSO improvement and ${inputs.simpleCostOfCapital}% cost of capital
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Key Results</h2>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-label">Current Cash Tied Up</div>
                  <div class="metric-value">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-label">Cash Released</div>
                  <div class="metric-value">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div class="metric-subtext">From faster collections</div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-label">Current DSO</div>
                  <div class="metric-value">${inputs.currentDSO} days</div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-label">New DSO (Projected)</div>
                  <div class="metric-value">${results.newDSO?.toFixed(0)} days</div>
                  <div class="metric-subtext">${results.dsoImprovementPercent}% improvement</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Your Input Data</h2>
              <table class="input-table">
                <tr>
                  <td>Expected DSO Improvement</td>
                  <td>${inputs.simpleDSOImprovement}%</td>
                </tr>
                <tr>
                  <td>Cost of Capital</td>
                  <td>${inputs.simpleCostOfCapital}%</td>
                </tr>
                <tr>
                  <td>Current DSO</td>
                  <td>${inputs.currentDSO} days</td>
                </tr>
                <tr>
                  <td>Average Invoice Value</td>
                  <td>$${Number.parseFloat(inputs.averageInvoiceValue).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Monthly Invoices</td>
                  <td>${Number.parseFloat(inputs.monthlyInvoices).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>Annual Revenue</strong></td>
                  <td><strong>$${(Number.parseFloat(inputs.averageInvoiceValue) * Number.parseFloat(inputs.monthlyInvoices) * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong></td>
                </tr>
              </table>
            </div>

            <div class="callout">
              <div class="callout-title">💡 What This Means for Your Business</div>
              <div class="callout-text">
                By reducing your Days Sales Outstanding from ${inputs.currentDSO} to ${results.newDSO?.toFixed(0)} days, 
                you'll release $${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })} in working capital. 
                This freed capital saves you $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })} annually 
                in interest costs or generates additional returns through strategic investments.
              </div>
            </div>
          `
              : `
             Detailed Calculator Report 
            <div class="summary-box">
              <div class="summary-label">Total Annual Benefit</div>
              <div class="summary-value">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              <div class="summary-detail">
                ROI: ${results.roi?.toFixed(0)}% | Payback Period: ${results.paybackMonths?.toFixed(1)} months
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Key Results</h2>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-label">DSO Improvement</div>
                  <div class="metric-value">${results.dsoReductionDays?.toFixed(0)} days</div>
                  <div class="metric-subtext">From ${results.currentDSO} to ${results.newDSO?.toFixed(0)} days</div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-label">Working Capital Released</div>
                  <div class="metric-value">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-label">Interest Savings</div>
                  <div class="metric-value">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div class="metric-subtext">Annual</div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-label">Labour Cost Savings</div>
                  <div class="metric-value">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div class="metric-subtext">Through automation</div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-label">Bad Debt Reduction</div>
                  <div class="metric-value">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div class="metric-subtext">40% improvement</div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-label">Return on Investment</div>
                  <div class="metric-value">${results.roi?.toFixed(0)}%</div>
                  <div class="metric-subtext">Payback: ${results.paybackMonths?.toFixed(1)} months</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Cost Structure</h2>
              <table class="input-table">
                <tr>
                  <td>Implementation Cost</td>
                  <td>$${Number.parseFloat(inputs.implementationCost).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Monthly Subscription Cost</td>
                  <td>$${Number.parseFloat(inputs.monthlyCost).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Annual Subscription Cost</td>
                  <td>$${(Number.parseFloat(inputs.monthlyCost) * 12).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>Total First Year Investment</strong></td>
                  <td><strong>$${results.totalImplementationAndAnnualCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong></td>
                </tr>
              </table>
            </div>

            <div class="section">
              <h2 class="section-title">Financial Metrics</h2>
              <table class="input-table">
                <tr>
                  <td>Current DSO</td>
                  <td>${inputs.currentDSODays} days</td>
                </tr>
                <tr>
                  <td>Debtors Balance</td>
                  <td>$${Number.parseFloat(inputs.debtorsBalance).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Interest Rate (${inputs.interestType === "loan" ? "Loan Cost" : "Deposit Income"})</td>
                  <td>${inputs.interestRate}%</td>
                </tr>
                <tr>
                  <td>Per Annum Direct Labour Costs</td>
                  <td>$${Number.parseFloat(inputs.perAnnumDirectLabourCosts).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Current Bad Debts (Annual)</td>
                  <td>$${Number.parseFloat(inputs.currentBadDebts).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Average Bad Debt Rate</td>
                  <td>${inputs.averageBadDebt}%</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <h2 class="section-title">Expected Improvements</h2>
              <table class="input-table">
                <tr>
                  <td>DSO Improvement Target</td>
                  <td>${inputs.dsoImprovement}%</td>
                </tr>
                <tr>
                  <td>Labour Savings Target</td>
                  <td>${inputs.labourSavings}%</td>
                </tr>
                <tr>
                  <td>Number of Debtors</td>
                  <td>${Number.parseFloat(inputs.numberOfDebtors).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Number of Collectors</td>
                  <td>${inputs.numberOfCollectors}</td>
                </tr>
                <tr>
                  <td>Projected Customer Growth</td>
                  <td>${inputs.projectedCustomerGrowth}%</td>
                </tr>
                <tr>
                  <td>Average Payment Terms</td>
                  <td>${inputs.averagePaymentTerms.toUpperCase()}</td>
                </tr>
              </table>
            </div>

            <div class="callout">
              <div class="callout-title">📊 Investment Summary</div>
              <div class="callout-text">
                With a total investment of $${results.totalImplementationAndAnnualCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}, 
                you can expect annual benefits of $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}, 
                resulting in an ROI of ${results.roi?.toFixed(0)}%. Your payback period is just ${results.paybackMonths?.toFixed(1)} months, 
                meaning you'll recover your full investment in under ${Math.ceil(results.paybackMonths / 12)} ${Math.ceil(results.paybackMonths / 12) === 1 ? "year" : "years"}.
              </div>
            </div>
          `
          }

          <div class="section">
            <h2 class="section-title">Next Steps</h2>
            <table class="input-table">
              <thead>
                <tr>
                  <th style="width: 60%">Recommended Action</th>
                  <th>Timeline</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Schedule a personalized demo with our team</td>
                  <td>This week</td>
                </tr>
                <tr>
                  <td>Review detailed implementation plan</td>
                  <td>Week 1-2</td>
                </tr>
                <tr>
                  <td>Conduct technical assessment and integration planning</td>
                  <td>Week 2-3</td>
                </tr>
                <tr>
                  <td>Begin implementation and staff training</td>
                  <td>Week 4+</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p><strong>This ROI analysis is based on industry benchmarks and your provided data.</strong></p>
            <p>Actual results may vary based on your specific business context, customer behavior, and implementation approach.</p>
            <div class="footer-contact">
              <p><strong>Ready to get started?</strong></p>
              <p>Contact us at <a href="mailto:enquiries@kuhlekt.com">enquiries@kuhlekt.com</a></p>
              <p>Visit <a href="https://kuhlekt.com">www.kuhlekt.com</a> to learn more</p>
            </div>
            <p style="margin-top: 20px; font-size: 11px;">
              © ${new Date().getFullYear()} Kuhlekt. All rights reserved. | Confidential Business Analysis
            </p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  return (
    <Button onClick={generatePDF} variant="outline" className="w-full bg-transparent">
      <Download className="mr-2 h-4 w-4" />
      Download PDF Report
    </Button>
  )
}
