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

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Kuhlekt ROI Analysis Report</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .page {
              page-break-after: always;
              padding: 20px;
            }
            .page:last-child {
              page-break-after: auto;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #0891b2;
            }
            .logo {
              width: 150px;
              height: auto;
            }
            .report-title {
              text-align: right;
            }
            .report-title h1 {
              margin: 0;
              font-size: 24px;
              color: #0891b2;
            }
            .report-title p {
              margin: 5px 0 0 0;
              font-size: 14px;
              color: #666;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #0891b2;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e5e7eb;
            }
            .highlight-box {
              background: linear-gradient(to bottom right, #ecfeff, #dbeafe);
              border: 2px solid #0891b2;
              border-radius: 10px;
              padding: 20px;
              text-align: center;
              margin-bottom: 20px;
            }
            .highlight-box h2 {
              font-size: 14px;
              color: #666;
              margin: 0 0 10px 0;
            }
            .highlight-box .value {
              font-size: 42px;
              font-weight: bold;
              color: #0891b2;
              margin: 0;
            }
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            .metric-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
            }
            .metric-label {
              font-size: 12px;
              color: #666;
              margin-bottom: 8px;
            }
            .metric-value {
              font-size: 24px;
              font-weight: bold;
              color: #0891b2;
            }
            .metric-value.positive {
              color: #16a34a;
            }
            .inputs-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            .inputs-table th,
            .inputs-table td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            .inputs-table th {
              background-color: #f9fafb;
              font-weight: bold;
              color: #0891b2;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
           Page 1 
          <div class="page">
            <div class="header">
              <img src="/images/kuhlekt-logo-tm.png" alt="Kuhlekt Logo" class="logo" />
              <div class="report-title">
                <h1>ROI Analysis Report</h1>
                <p>${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            </div>

            <div class="section">
              ${
                calculatorType === "simple"
                  ? `
                <div class="highlight-box">
                  <h2>Estimated Annual Savings</h2>
                  <p class="value">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>

                <div class="metrics-grid">
                  <div class="metric-card">
                    <div class="metric-label">Current Cash Tied Up</div>
                    <div class="metric-value">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">Cash Released</div>
                    <div class="metric-value positive">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">Current DSO</div>
                    <div class="metric-value">${inputs.currentDSO} days</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">New DSO</div>
                    <div class="metric-value positive">${results.newDSO?.toFixed(0)} days</div>
                  </div>
                </div>
              `
                  : `
                <div class="highlight-box">
                  <h2>Total Annual Benefit</h2>
                  <p class="value">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p style="font-size: 14px; color: #666; margin-top: 10px;">
                    ROI: ${results.roi?.toFixed(0)}% • Payback: ${results.paybackMonths?.toFixed(1)} months
                  </p>
                </div>

                <div class="metrics-grid">
                  <div class="metric-card">
                    <div class="metric-label">DSO Improvement</div>
                    <div class="metric-value">${results.dsoReductionDays?.toFixed(0)} days</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">Working Capital Released</div>
                    <div class="metric-value positive">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">Interest Savings</div>
                    <div class="metric-value positive">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">Labour Savings</div>
                    <div class="metric-value positive">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">Bad Debt Reduction</div>
                    <div class="metric-value positive">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">Return on Investment</div>
                    <div class="metric-value positive">${results.roi?.toFixed(0)}%</div>
                  </div>
                </div>
              `
              }
            </div>

            <div class="footer">
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              <p>This report was generated using the Kuhlekt ROI Calculator</p>
            </div>
          </div>

           Page 2: Input Summary 
          <div class="page">
            <div class="header">
              <img src="/images/kuhlekt-logo-tm.png" alt="Kuhlekt Logo" class="logo" />
              <div class="report-title">
                <h1>Input Summary</h1>
                <p>${calculatorType === "simple" ? "Simple Calculator" : "Detailed Calculator"}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Your Inputs</div>
              <table class="inputs-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    calculatorType === "simple"
                      ? `
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
                      <td>Expected DSO Improvement</td>
                      <td>${inputs.simpleDSOImprovement}%</td>
                    </tr>
                    <tr>
                      <td>Cost of Capital</td>
                      <td>${inputs.simpleCostOfCapital}%</td>
                    </tr>
                  `
                      : `
                    <tr>
                      <td>Implementation Cost</td>
                      <td>$${Number.parseFloat(inputs.implementationCost).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Monthly Cost</td>
                      <td>$${Number.parseFloat(inputs.monthlyCost).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Per Annum Direct Labour Costs</td>
                      <td>$${Number.parseFloat(inputs.perAnnumDirectLabourCosts).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Interest Type</td>
                      <td>${inputs.interestType === "loan" ? "Loan Interest" : "Deposit Interest"}</td>
                    </tr>
                    <tr>
                      <td>Interest Rate</td>
                      <td>${inputs.interestRate}%</td>
                    </tr>
                    <tr>
                      <td>Average Bad Debt</td>
                      <td>${inputs.averageBadDebt}%</td>
                    </tr>
                    <tr>
                      <td>Current Bad Debts</td>
                      <td>$${Number.parseFloat(inputs.currentBadDebts).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Labour Savings</td>
                      <td>${inputs.labourSavings}%</td>
                    </tr>
                    <tr>
                      <td>DSO Improvement</td>
                      <td>${inputs.dsoImprovement}%</td>
                    </tr>
                    <tr>
                      <td>Current DSO Days</td>
                      <td>${inputs.currentDSODays} days</td>
                    </tr>
                    <tr>
                      <td>Debtors Balance</td>
                      <td>$${Number.parseFloat(inputs.debtorsBalance).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Average Payment Terms</td>
                      <td>${inputs.averagePaymentTerms.replace("net", "Net ")}</td>
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
                  `
                  }
                </tbody>
              </table>
            </div>

            <div class="section">
              <div class="section-title">About This Analysis</div>
              <p>
                This ROI analysis is based on the inputs you provided and industry benchmarks. 
                The calculations demonstrate the potential financial benefits of implementing 
                Kuhlekt's accounts receivable automation platform.
              </p>
              <p style="margin-top: 15px;">
                <strong>Next Steps:</strong> Schedule a personalized demo to see how Kuhlekt 
                can help you achieve these results and transform your AR process.
              </p>
            </div>

            <div class="footer">
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              <p>Contact us at support@kuhlekt.com or visit www.kuhlekt.com</p>
            </div>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  return (
    <Button onClick={generatePDF} className="w-full bg-cyan-600 hover:bg-cyan-700">
      <Download className="mr-2 h-4 w-4" />
      Download PDF Report
    </Button>
  )
}
