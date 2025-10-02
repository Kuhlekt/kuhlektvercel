"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"

interface ROIReportPDFProps {
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}

export function ROIReportPDF({ calculatorType, results, inputs }: ROIReportPDFProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const getImageAsBase64 = async (imagePath: string): Promise<string> => {
    try {
      const response = await fetch(imagePath)
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error("Error loading image:", error)
      return ""
    }
  }

  const handleDownloadPDF = async () => {
    setIsGenerating(true)

    try {
      // Convert logo to base64
      const logoBase64 = await getImageAsBase64("/images/kuhlekt-logo-tm.png")

      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        setIsGenerating(false)
        return
      }

      const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>ROI Calculator Report - Kuhlekt</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #1f2937;
              background: white;
              padding: 40px;
            }
            
            .container {
              max-width: 900px;
              margin: 0 auto;
            }
            
            .logo-container {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #0891b2;
            }
            
            .logo {
              max-width: 250px;
              height: auto;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            
            .header h1 {
              color: #0891b2;
              font-size: 32px;
              margin-bottom: 10px;
            }
            
            .header .subtitle {
              color: #6b7280;
              font-size: 18px;
            }
            
            .summary-box {
              background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
              border: 2px solid #0891b2;
              border-radius: 12px;
              padding: 30px;
              margin-bottom: 30px;
              text-align: center;
            }
            
            .summary-box .label {
              color: #0e7490;
              font-size: 14px;
              font-weight: 600;
              text-transform: uppercase;
              margin-bottom: 10px;
            }
            
            .summary-box .value {
              color: #0891b2;
              font-size: 48px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            
            .summary-box .description {
              color: #0e7490;
              font-size: 14px;
            }
            
            .section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            
            .section-header {
              background: #0891b2;
              color: white;
              padding: 12px 20px;
              border-radius: 6px;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
            }
            
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-bottom: 20px;
            }
            
            .metric-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              background: white;
            }
            
            .metric-card .metric-label {
              color: #6b7280;
              font-size: 14px;
              margin-bottom: 8px;
            }
            
            .metric-card .metric-value {
              color: #0891b2;
              font-size: 28px;
              font-weight: bold;
            }
            
            .metric-card .metric-note {
              color: #9ca3af;
              font-size: 12px;
              margin-top: 4px;
            }
            
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            
            .data-table th {
              background: #f3f4f6;
              color: #374151;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              border-bottom: 2px solid #0891b2;
            }
            
            .data-table td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .data-table tr:last-child td {
              border-bottom: none;
            }
            
            .next-steps {
              background: #f9fafb;
              border-left: 4px solid #0891b2;
              padding: 20px;
              margin-top: 30px;
              page-break-inside: avoid;
            }
            
            .next-steps h3 {
              color: #0891b2;
              margin-bottom: 15px;
            }
            
            .next-steps ol {
              margin-left: 20px;
            }
            
            .next-steps li {
              margin-bottom: 8px;
              color: #4b5563;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            
            .footer strong {
              color: #0891b2;
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
          <div class="container">
            ${
              logoBase64
                ? `<div class="logo-container">
              <img src="${logoBase64}" alt="Kuhlekt" class="logo" />
            </div>`
                : '<div class="logo-container"><h2 style="color: #0891b2;">Kuhlekt</h2></div>'
            }
            
            <div class="header">
              <h1>${calculatorType === "simple" ? "Simple ROI Analysis Report" : "Detailed ROI Analysis Report"}</h1>
              <div class="subtitle">Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
            </div>
            
            ${
              calculatorType === "simple"
                ? `
            <div class="summary-box">
              <div class="label">Estimated Annual Savings</div>
              <div class="value">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              <div class="description">Based on ${results.dsoImprovementPercent}% DSO improvement and ${inputs.simpleCostOfCapital}% cost of capital</div>
            </div>
            
            <div class="section">
              <div class="section-header">Key Results Summary</div>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-label">Current Cash Tied Up</div>
                  <div class="metric-value">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Cash Released</div>
                  <div class="metric-value">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div class="metric-note">From faster collections</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Current DSO</div>
                  <div class="metric-value">${inputs.currentDSO} days</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Projected New DSO</div>
                  <div class="metric-value">${results.newDSO?.toFixed(0)} days</div>
                  <div class="metric-note">${results.dsoImprovementPercent}% improvement</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-header">Input Data Used for Calculation</div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Current DSO (Days)</td>
                    <td>${inputs.currentDSO}</td>
                  </tr>
                  <tr>
                    <td>Average Invoice Value</td>
                    <td>$${Number.parseFloat(inputs.averageInvoiceValue).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Monthly Invoices</td>
                    <td>${inputs.monthlyInvoices}</td>
                  </tr>
                  <tr>
                    <td>Expected DSO Improvement</td>
                    <td>${inputs.simpleDSOImprovement}%</td>
                  </tr>
                  <tr>
                    <td>Cost of Capital</td>
                    <td>${inputs.simpleCostOfCapital}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            `
                : `
            <div class="summary-box">
              <div class="label">Total Annual Benefit</div>
              <div class="value">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              <div class="description">ROI: ${results.roi?.toFixed(0)}% | Payback Period: ${results.paybackMonths?.toFixed(1)} months</div>
            </div>
            
            <div class="section">
              <div class="section-header">Financial Benefits Breakdown</div>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-label">Working Capital Released</div>
                  <div class="metric-value">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Interest Savings (Annual)</div>
                  <div class="metric-value">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Labour Cost Savings</div>
                  <div class="metric-value">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div class="metric-note">Through automation</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Bad Debt Reduction</div>
                  <div class="metric-value">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div class="metric-note">40% improvement</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-header">DSO Improvement Analysis</div>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-label">Current DSO</div>
                  <div class="metric-value">${results.currentDSO} days</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Projected New DSO</div>
                  <div class="metric-value">${results.newDSO?.toFixed(0)} days</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Days Reduced</div>
                  <div class="metric-value">${results.dsoReductionDays?.toFixed(0)}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Return on Investment</div>
                  <div class="metric-value">${results.roi?.toFixed(0)}%</div>
                  <div class="metric-note">Payback: ${results.paybackMonths?.toFixed(1)} months</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-header">Cost Structure</div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Cost Item</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Implementation Cost</td>
                    <td>$${Number.parseFloat(inputs.implementationCost).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Monthly Subscription</td>
                    <td>$${Number.parseFloat(inputs.monthlyCost).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Annual Subscription Cost</td>
                    <td>$${(Number.parseFloat(inputs.monthlyCost) * 12).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Total First Year Cost</strong></td>
                    <td><strong>$${results.totalImplementationAndAnnualCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="section">
              <div class="section-header">Financial Metrics</div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Current DSO</td>
                    <td>${inputs.currentDSODays} days</td>
                  </tr>
                  <tr>
                    <td>Debtors Balance</td>
                    <td>$${Number.parseFloat(inputs.debtorsBalance).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Interest Rate</td>
                    <td>${inputs.interestRate}% (${inputs.interestType === "loan" ? "Loan Cost" : "Deposit Income"})</td>
                  </tr>
                  <tr>
                    <td>Annual Direct Labour Costs</td>
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
                </tbody>
              </table>
            </div>
            
            <div class="section">
              <div class="section-header">Improvement Targets</div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Target</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>DSO Improvement Target</td>
                    <td>${inputs.dsoImprovement}%</td>
                  </tr>
                  <tr>
                    <td>Labour Savings Target</td>
                    <td>${inputs.labourSavings}%</td>
                  </tr>
                  <tr>
                    <td>Payment Terms</td>
                    <td>${inputs.averagePaymentTerms.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td>Number of Debtors</td>
                    <td>${inputs.numberOfDebtors}</td>
                  </tr>
                  <tr>
                    <td>Number of Collectors</td>
                    <td>${inputs.numberOfCollectors}</td>
                  </tr>
                  <tr>
                    <td>Projected Customer Growth</td>
                    <td>${inputs.projectedCustomerGrowth}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            `
            }
            
            <div class="next-steps">
              <h3>Recommended Next Steps</h3>
              <ol>
                <li><strong>Schedule a Demo:</strong> See Kuhlekt in action with a personalized demonstration tailored to your business needs.</li>
                <li><strong>Review Case Studies:</strong> Learn how similar companies have achieved these results with our platform.</li>
                <li><strong>Implementation Planning:</strong> Discuss timeline, resources, and integration with our implementation team.</li>
                <li><strong>Pricing Discussion:</strong> Explore pricing options and potential customizations for your organization.</li>
                <li><strong>Contact Us:</strong> Reach out to our team at <strong>enquiries@kuhlekt.com</strong> for any questions.</li>
              </ol>
            </div>
            
            <div class="footer">
              <p><strong>Kuhlekt®</strong> - Transforming Invoice-to-Cash</p>
              <p>Visit us at kuhlekt.com | Email: enquiries@kuhlekt.com</p>
              <p style="margin-top: 10px; font-size: 12px;">This report is generated based on the inputs provided and represents estimated outcomes. Actual results may vary based on implementation and business-specific factors.</p>
            </div>
          </div>
        </body>
      </html>
    `

      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Wait a moment for rendering, then print
      setTimeout(() => {
        printWindow.print()
        setIsGenerating(false)
      }, 500)
    } catch (error) {
      console.error("Error generating PDF:", error)
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex justify-center">
      <Button onClick={handleDownloadPDF} variant="outline" className="gap-2 bg-transparent" disabled={isGenerating}>
        <Download className="h-4 w-4" />
        {isGenerating ? "Generating PDF..." : "Download PDF Report"}
      </Button>
    </div>
  )
}
