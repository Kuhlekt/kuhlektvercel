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
      const logoBase64 = await getImageAsBase64("/images/kuhlekt-logo-tm.png")

      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        setIsGenerating(false)
        return
      }

      // Calculate additional metrics for detailed report
      const currentCapacity = results.numberOfDebtors || 0
      const implementationCapacity = Math.round(currentCapacity * 1.5) // 50% increase
      const additionalCapacity = implementationCapacity - currentCapacity
      const growthScenario = Math.round(currentCapacity * 0.5) // 50% customer increase
      const additionalAutomation = Math.round(additionalCapacity * 0.8) // 80% automation

      // Payment terms analysis
      const paymentTermsData = [
        { term: "Net 30", currentDSO: 45, improvedDSO: 32, released: Math.round(results.workingCapitalReleased * 0.3) },
        { term: "Net 60", currentDSO: 75, improvedDSO: 52, released: Math.round(results.workingCapitalReleased * 0.5) },
        {
          term: "Net 90",
          currentDSO: 105,
          improvedDSO: 73,
          released: Math.round(results.workingCapitalReleased * 0.7),
        },
      ]

      // First year investment
      const firstYearInvestment = (Number(inputs.implementationCost) || 0) + (Number(inputs.monthlyCost) || 0) * 12

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
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
              line-height: 1.5;
              color: #1f2937;
              background: #f9fafb;
              padding: 0;
            }
            
            .page {
              background: white;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              page-break-after: always;
            }
            
            .page:last-child {
              page-break-after: auto;
            }
            
            .header-banner {
              background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
              color: white;
              padding: 30px;
              border-radius: 12px;
              margin-bottom: 30px;
            }
            
            .header-banner h1 {
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 8px;
            }
            
            .header-banner .subtitle {
              font-size: 14px;
              opacity: 0.9;
            }
            
            .logo-small {
              width: 120px;
              margin-bottom: 15px;
            }
            
            .metric-cards {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            
            .metric-card {
              border: 2px solid #e5e7eb;
              border-radius: 12px;
              padding: 24px;
              text-align: center;
            }
            
            .metric-card.positive {
              background: linear-gradient(135deg, #ecfccb 0%, #d9f99d 100%);
              border-color: #84cc16;
            }
            
            .metric-card.negative {
              background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
              border-color: #ef4444;
            }
            
            .metric-card .label {
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              margin-bottom: 12px;
              color: #6b7280;
            }
            
            .metric-card .value {
              font-size: 36px;
              font-weight: 700;
              margin-bottom: 8px;
            }
            
            .metric-card.positive .value {
              color: #16a34a;
            }
            
            .metric-card.negative .value {
              color: #dc2626;
            }
            
            .metric-card .note {
              font-size: 11px;
              color: #6b7280;
              background: white;
              padding: 4px 8px;
              border-radius: 4px;
              display: inline-block;
            }
            
            .section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: 700;
              color: #0891b2;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #0891b2;
            }
            
            .info-box {
              background: #f0f9ff;
              border-left: 4px solid #0891b2;
              padding: 16px;
              border-radius: 6px;
              margin-bottom: 20px;
            }
            
            .info-box h4 {
              font-size: 13px;
              font-weight: 600;
              color: #0e7490;
              margin-bottom: 8px;
            }
            
            .info-box p {
              font-size: 12px;
              color: #164e63;
              line-height: 1.6;
            }
            
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              font-size: 13px;
            }
            
            .data-table thead {
              background: #f3f4f6;
            }
            
            .data-table th {
              padding: 12px;
              text-align: left;
              font-weight: 600;
              color: #374151;
              border-bottom: 2px solid #0891b2;
            }
            
            .data-table td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .data-table .highlight {
              background: #ecfeff;
              font-weight: 600;
            }
            
            .capacity-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin: 15px 0;
            }
            
            .capacity-card {
              border: 2px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            
            .capacity-card.current {
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              border-color: #f59e0b;
            }
            
            .capacity-card.implementation {
              background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
              border-color: #8b5cf6;
            }
            
            .capacity-card .label {
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
              color: #6b7280;
              margin-bottom: 10px;
            }
            
            .capacity-card .value {
              font-size: 32px;
              font-weight: 700;
              color: #1f2937;
            }
            
            .mini-metrics {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
              margin: 15px 0;
            }
            
            .mini-metric {
              background: #f0f9ff;
              border: 1px solid #0891b2;
              border-radius: 8px;
              padding: 16px;
              text-align: center;
            }
            
            .mini-metric .label {
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              color: #0e7490;
              margin-bottom: 8px;
            }
            
            .mini-metric .value {
              font-size: 24px;
              font-weight: 700;
              color: #0891b2;
            }
            
            .growth-box {
              background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
              border: 2px solid #10b981;
              border-radius: 8px;
              padding: 20px;
              margin: 15px 0;
            }
            
            .growth-box h4 {
              font-size: 14px;
              font-weight: 600;
              color: #065f46;
              margin-bottom: 12px;
            }
            
            .growth-metrics {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }
            
            .growth-metric {
              background: white;
              padding: 12px;
              border-radius: 6px;
              text-align: center;
            }
            
            .growth-metric .label {
              font-size: 11px;
              color: #6b7280;
              margin-bottom: 6px;
            }
            
            .growth-metric .value {
              font-size: 24px;
              font-weight: 700;
              color: #059669;
            }
            
            .chart-placeholder {
              background: white;
              border: 2px solid #e5e7eb;
              border-radius: 8px;
              padding: 30px;
              margin: 15px 0;
              text-align: center;
              min-height: 200px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .chart-placeholder p {
              color: #9ca3af;
              font-size: 14px;
            }
            
            .savings-cards {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin: 15px 0;
            }
            
            .savings-card {
              border: 2px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            
            .savings-card.dso {
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              border-color: #f59e0b;
            }
            
            .savings-card.bad-debt {
              background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
              border-color: #ef4444;
            }
            
            .savings-card .label {
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
              color: #6b7280;
              margin-bottom: 10px;
            }
            
            .savings-card .value {
              font-size: 36px;
              font-weight: 700;
              color: #1f2937;
            }
            
            .financial-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin: 15px 0;
            }
            
            .financial-item {
              background: white;
              border: 2px solid #e5e7eb;
              border-radius: 8px;
              padding: 16px;
            }
            
            .financial-item .label {
              font-size: 12px;
              font-weight: 600;
              color: #6b7280;
              margin-bottom: 8px;
            }
            
            .financial-item .value {
              font-size: 24px;
              font-weight: 700;
            }
            
            .financial-item.positive .value {
              color: #16a34a;
            }
            
            .financial-item.negative .value {
              color: #dc2626;
            }
            
            .dso-metrics {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
              margin: 15px 0;
            }
            
            .dso-metric {
              border: 2px solid #e5e7eb;
              border-radius: 8px;
              padding: 16px;
              text-align: center;
            }
            
            .dso-metric.current {
              background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
              border-color: #ef4444;
            }
            
            .dso-metric.improved {
              background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
              border-color: #10b981;
            }
            
            .dso-metric.reduction {
              background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
              border-color: #8b5cf6;
            }
            
            .dso-metric .label {
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              color: #6b7280;
              margin-bottom: 8px;
            }
            
            .dso-metric .value {
              font-size: 28px;
              font-weight: 700;
              color: #1f2937;
            }
            
            .summary-box {
              background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
              border: 2px solid #0891b2;
              border-radius: 12px;
              padding: 24px;
              margin: 20px 0;
            }
            
            .summary-box h3 {
              font-size: 16px;
              font-weight: 700;
              color: #0e7490;
              margin-bottom: 15px;
            }
            
            .summary-box p {
              font-size: 13px;
              color: #164e63;
              line-height: 1.8;
              margin-bottom: 10px;
            }
            
            .summary-box strong {
              color: #0891b2;
              font-weight: 700;
            }
            
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              font-size: 11px;
              color: #6b7280;
            }
            
            .footer strong {
              color: #0891b2;
            }
            
            @media print {
              body {
                background: white;
              }
              
              .page {
                padding: 20px;
                max-width: 100%;
              }
              
              .page-break {
                page-break-before: always;
              }
            }
          </style>
        </head>
        <body>
           Page 1: Main Results 
          <div class="page">
            ${logoBase64 ? `<img src="${logoBase64}" alt="Kuhlekt" class="logo-small" />` : '<div style="height: 40px;"></div>'}
            
            <div class="header-banner">
              <h1>Your Projected ROI</h1>
              <div class="subtitle">Analysis Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
            </div>
            
            <div class="metric-cards">
              <div class="metric-card positive">
                <div class="label">ROI</div>
                <div class="value">${results.roi?.toFixed(1) || "0.0"}%</div>
                <div class="note">Return on Investment</div>
              </div>
              <div class="metric-card negative">
                <div class="label">Payback Period</div>
                <div class="value">${results.paybackMonths?.toFixed(1) || "0.0"}</div>
                <div class="note">Months</div>
              </div>
            </div>
            
            <div class="info-box">
              <h4>Cash Flow Cost Savings</h4>
              <p>To calculate Monthly Cash Flow improvements, please see Annual Recurring Savings in the Financial Impact section.</p>
            </div>
            
            <div class="info-box">
              <h4>Current DSO</h4>
              <p>Current DSO is important. Cash and Annual Savings are calculated against this metric along with the cost of capital and cost of debt from the company statement.</p>
            </div>
            
            <div class="section">
              <div class="section-title">Payment Terms Impact Analysis</div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Payment Terms</th>
                    <th>Current DSO</th>
                    <th>Improved DSO</th>
                    <th>Working Capital Released</th>
                  </tr>
                </thead>
                <tbody>
                  ${paymentTermsData
                    .map(
                      (term) => `
                    <tr class="highlight">
                      <td><strong>${term.term}</strong></td>
                      <td>${term.currentDSO} days</td>
                      <td style="color: #16a34a; font-weight: 600;">${term.improvedDSO} days</td>
                      <td style="color: #0891b2; font-weight: 600;">$${term.released.toLocaleString()}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
              <p style="font-size: 11px; color: #6b7280; margin-top: 10px;">
                Note: Actual DSO is typically 50% higher than normal payment terms.
                e.g., 30-day payment terms often results in 45-day DSO.
              </p>
            </div>
          </div>
          
           Page 2: Capacity & Growth Analysis 
          <div class="page page-break">
            ${logoBase64 ? `<img src="${logoBase64}" alt="Kuhlekt" class="logo-small" />` : '<div style="height: 40px;"></div>'}
            
            <div class="section">
              <div class="section-title">Business Growth Without Additional Headcount</div>
              
              <div class="capacity-grid">
                <div class="capacity-card current">
                  <div class="label">Current Capacity</div>
                  <div class="value">${currentCapacity.toLocaleString()}</div>
                </div>
                <div class="capacity-card implementation">
                  <div class="label">With Implementation</div>
                  <div class="value">${implementationCapacity.toLocaleString()}</div>
                </div>
              </div>
              
              <div class="mini-metrics">
                <div class="mini-metric">
                  <div class="label">Additional Capacity (No New Hires)</div>
                  <div class="value">+${additionalCapacity.toLocaleString()}</div>
                </div>
                <div class="mini-metric">
                  <div class="label">Growth Enabled</div>
                  <div class="value">${((additionalCapacity / currentCapacity) * 100).toFixed(0)}%</div>
                </div>
                <div class="mini-metric">
                  <div class="label">Efficiency Gain</div>
                  <div class="value">${inputs.labourSavings || 40}%</div>
                </div>
              </div>
              
              <div class="growth-box">
                <h4>✓ Growth Scenario: 50% Customer Increase</h4>
                <div class="growth-metrics">
                  <div class="growth-metric">
                    <div class="label">New Customers</div>
                    <div class="value">${growthScenario.toLocaleString()}</div>
                  </div>
                  <div class="growth-metric">
                    <div class="label">Handled by Current Team</div>
                    <div class="value">${growthScenario.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div class="info-box">
                <h4>Additional Customer Business Goal</h4>
                <p>Without automation: would need ${Math.ceil(growthScenario / 100)} new collectors. 
                With automation: ${additionalAutomation.toLocaleString()} additional customers handled automatically.</p>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Investment vs Annual Savings</div>
              <div class="chart-placeholder">
                <p>Investment: $${firstYearInvestment.toLocaleString()} | Annual Savings: $${results.totalAnnualBenefit?.toLocaleString() || "0"}</p>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Cumulative Savings Over Time (3 Years)</div>
              <div class="chart-placeholder">
                <p>Year 1: $${results.totalAnnualBenefit?.toLocaleString() || "0"} | 
                Year 2: $${((results.totalAnnualBenefit || 0) * 2).toLocaleString()} | 
                Year 3: $${((results.totalAnnualBenefit || 0) * 3).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
           Page 3: Financial Impact & Summary 
          <div class="page page-break">
            ${logoBase64 ? `<img src="${logoBase64}" alt="Kuhlekt" class="logo-small" />` : '<div style="height: 40px;"></div>'}
            
            <div class="section">
              <div class="section-title">DSO Comparison</div>
              <div class="chart-placeholder">
                <p>Current DSO: ${results.currentDSO?.toFixed(0) || "0"} days | 
                Improved DSO: ${results.newDSO?.toFixed(0) || "0"} days</p>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Savings Assumptions</div>
              <div class="savings-cards">
                <div class="savings-card dso">
                  <div class="label">DSO Improvement</div>
                  <div class="value">${inputs.dsoImprovement || 40}%</div>
                </div>
                <div class="savings-card bad-debt">
                  <div class="label">Bad Debt Reduction</div>
                  <div class="value">30%</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Financial Impact</div>
              
              <div class="financial-grid">
                <div class="financial-item positive">
                  <div class="label">Annual Recurring Savings</div>
                  <div class="value">$${results.totalAnnualBenefit?.toLocaleString() || "0"}</div>
                </div>
                <div class="financial-item positive">
                  <div class="label">One-Time Cash Flow (Better Balance)</div>
                  <div class="value">$${results.workingCapitalReleased?.toLocaleString() || "0"}</div>
                </div>
                <div class="financial-item positive">
                  <div class="label">Monthly Operational Savings</div>
                  <div class="value">$${Math.round((results.totalAnnualBenefit || 0) / 12).toLocaleString()}</div>
                </div>
                <div class="financial-item negative">
                  <div class="label">Total First Year Investment</div>
                  <div class="value">-$${firstYearInvestment.toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">DSO Improvement</div>
              <div class="dso-metrics">
                <div class="dso-metric current">
                  <div class="label">Current</div>
                  <div class="value">${results.currentDSO?.toFixed(0) || "0"}</div>
                </div>
                <div class="dso-metric improved">
                  <div class="label">Improved</div>
                  <div class="value">${results.newDSO?.toFixed(0) || "0"}</div>
                </div>
                <div class="dso-metric reduction">
                  <div class="label">Reduction</div>
                  <div class="value">${results.dsoReductionDays?.toFixed(0) || "0"}</div>
                </div>
              </div>
            </div>
            
            <div class="summary-box">
              <h3>Summary</h3>
              <p>
                By implementing the Kuhlekt invoice-to-cash platform with 
                automated collection workflows and customer self-service, 
                your organization can achieve a <strong>${results.roi?.toFixed(0) || "0"}% ROI</strong> within 
                <strong>${results.paybackMonths?.toFixed(1) || "0"} months</strong>. You should expect to improve 
                DSO by <strong>${inputs.dsoImprovement || 40}%</strong>, freeing up <strong>$${results.workingCapitalReleased?.toLocaleString() || "0"}</strong> 
                in working capital without adding headcount.
              </p>
              <p>
                Additionally, your team can handle <strong>${((additionalCapacity / currentCapacity) * 100).toFixed(0)}%</strong> 
                more customers without hiring, while delivering superior customer 
                experience through 24/7 portal access and automated communications.
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Kuhlekt®</strong> - Transforming Invoice-to-Cash</p>
              <p>Visit us at kuhlekt.com | Email: enquiries@kuhlekt.com</p>
              <p style="margin-top: 10px;">This report is generated based on the inputs provided and represents estimated outcomes. 
              Actual results may vary based on implementation and business-specific factors.</p>
            </div>
          </div>
        </body>
      </html>
    `

      printWindow.document.write(htmlContent)
      printWindow.document.close()

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
