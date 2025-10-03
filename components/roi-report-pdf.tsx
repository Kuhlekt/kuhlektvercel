"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"

interface ROIReportPDFProps {
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
  onDownloadComplete?: () => void
}

export function ROIReportPDF({ calculatorType, results, inputs, onDownloadComplete }: ROIReportPDFProps) {
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

      // Pre-calculate all complex values to avoid template literal issues
      const debtorsBalance = Number.parseFloat(inputs.debtorsBalance || "0")
      const projectedGrowth = Number.parseFloat(inputs.projectedCustomerGrowth || "0")
      const dsoImprovement = Number.parseFloat(inputs.dsoImprovement || "0")
      const numberOfDebtors = Number.parseFloat(inputs.numberOfDebtors || "0")
      const labourSavings = Number.parseFloat(inputs.labourSavings || "0")

      const revenueBoost = Math.round(((debtorsBalance / 365) * 365 * (projectedGrowth / 100)) / 1000)
      const revenuePotential = Math.round(((debtorsBalance / 365) * 365 * (projectedGrowth / 100)) / 1000)
      const additionalCapacity = Math.round((numberOfDebtors * labourSavings) / 100)
      const additionalCustomers = Math.round((numberOfDebtors * projectedGrowth) / 100)

      // Payment terms calculations
      const net90Improved = Math.round(90 * (1 - dsoImprovement / 100))
      const net90Gain = Math.round((debtorsBalance / 365) * 90 * (dsoImprovement / 100))
      const net60Improved = Math.round(60 * (1 - dsoImprovement / 100))
      const net60Gain = Math.round((debtorsBalance / 365) * 60 * (dsoImprovement / 100))
      const net30Improved = Math.round(30 * (1 - dsoImprovement / 100))
      const net30Gain = Math.round((debtorsBalance / 365) * 30 * (dsoImprovement / 100))

      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>ROI Calculator Report - Kuhlekt</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #1f2937; background: white; padding: 40px; }
    .container { max-width: 900px; margin: 0 auto; }
    .logo-container { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #0891b2; }
    .logo { max-width: 250px; height: auto; }
    .header { text-align: center; margin-bottom: 40px; }
    .header h1 { color: #0891b2; font-size: 32px; margin-bottom: 10px; }
    .header .subtitle { color: #6b7280; font-size: 18px; }
    .summary-box { background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); border: 2px solid #0891b2; border-radius: 12px; padding: 30px; margin-bottom: 30px; text-align: center; }
    .summary-box .label { color: #0e7490; font-size: 14px; font-weight: 600; text-transform: uppercase; margin-bottom: 10px; }
    .summary-box .value { color: #0891b2; font-size: 48px; font-weight: bold; margin-bottom: 10px; }
    .summary-box .description { color: #0e7490; font-size: 14px; }
    .section { margin-bottom: 30px; page-break-inside: avoid; }
    .section-header { background: #0891b2; color: white; padding: 12px 20px; border-radius: 6px; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
    .metric-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background: white; }
    .metric-card .metric-label { color: #6b7280; font-size: 14px; margin-bottom: 8px; }
    .metric-card .metric-value { color: #0891b2; font-size: 28px; font-weight: bold; }
    .metric-card .metric-note { color: #9ca3af; font-size: 12px; margin-top: 4px; }
    .metric-card.green .metric-value { color: #10b981; }
    .metric-card.red .metric-value { color: #ef4444; }
    .data-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .data-table th { background: #f3f4f6; color: #374151; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #0891b2; }
    .data-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .data-table tr:last-child td { border-bottom: none; }
    .info-box { background: #f0f9ff; border-left: 4px solid #0891b2; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .info-box p { color: #0e7490; font-size: 14px; line-height: 1.6; }
    .summary-text { background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 15px; }
    .summary-text p { color: #4b5563; font-size: 14px; line-height: 1.8; margin-bottom: 10px; }
    .next-steps { background: #f9fafb; border-left: 4px solid #0891b2; padding: 20px; margin-top: 30px; page-break-inside: avoid; }
    .next-steps h3 { color: #0891b2; margin-bottom: 15px; }
    .next-steps ol { margin-left: 20px; }
    .next-steps li { margin-bottom: 8px; color: #4b5563; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
    .footer strong { color: #0891b2; }
    @media print {
      body { padding: 20px; }
      .summary-box { page-break-inside: avoid; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    ${logoBase64 ? `<div class="logo-container"><img src="${logoBase64}" alt="Kuhlekt" class="logo" /></div>` : '<div class="logo-container"><h2 style="color: #0891b2;">Kuhlekt</h2></div>'}
    
    <div class="header">
      <h1>${calculatorType === "simple" ? "Simple ROI Analysis Report" : "Your Projected ROI"}</h1>
      <div class="subtitle">${calculatorType === "simple" ? `Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}` : "See how Kuhlekt's cash flow improvements can transform your business"}</div>
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
          <tr><td>Current DSO (Days)</td><td>${inputs.currentDSO}</td></tr>
          <tr><td>Average Invoice Value</td><td>$${Number.parseFloat(inputs.averageInvoiceValue).toLocaleString()}</td></tr>
          <tr><td>Monthly Invoices</td><td>${inputs.monthlyInvoices}</td></tr>
          <tr><td>Expected DSO Improvement</td><td>${inputs.simpleDSOImprovement}%</td></tr>
          <tr><td>Cost of Capital</td><td>${inputs.simpleCostOfCapital}%</td></tr>
        </tbody>
      </table>
    </div>
    `
        : `
    <div class="section">
      <div class="section-header">Top Metrics</div>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">ROI</div>
          <div class="metric-value">${results.roi?.toFixed(1) || 0}%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Payback Period</div>
          <div class="metric-value">${results.paybackMonths?.toFixed(1) || 0}</div>
          <div class="metric-note">months</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-header">Cash Flow Gain Timing</div>
      <div class="info-box">
        <p><strong>Cash Flow Gain Timing:</strong> To calculate Monthly Cash Flow improvements, please contact us. Kuhlekt's DSO improvements typically start within 30-60 days of implementation, with full benefits realized within 90 days.</p>
        <p style="margin-top: 10px;"><strong>Example DSO:</strong> For a company with Current DSO of ${inputs.currentDSODays} days and Annual Average of ${inputs.debtorsBalance ? `$${Number.parseFloat(inputs.debtorsBalance).toLocaleString()}` : "$0"}, reducing DSO by ${inputs.dsoImprovement}% will free up cash that can be reinvested or used to reduce debt.</p>
      </div>
    </div>
    
    <div class="section">
      <div class="section-header">Payment Terms Impact Analysis</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Payment Terms</th>
            <th>Current DSO</th>
            <th>Improved DSO</th>
            <th>Estimated Gain</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Net 90</strong></td>
            <td>90 days</td>
            <td>${net90Improved} days</td>
            <td>$${net90Gain.toLocaleString()}</td>
          </tr>
          <tr>
            <td><strong>Net 60</strong></td>
            <td>60 days</td>
            <td>${net60Improved} days</td>
            <td>$${net60Gain.toLocaleString()}</td>
          </tr>
          <tr>
            <td><strong>Net 30</strong></td>
            <td>30 days</td>
            <td>${net30Improved} days</td>
            <td>$${net30Gain.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top: 10px; font-size: 12px; color: #6b7280;">Note: Actual DSO is typically 1.5x-2x the payment terms due to late payments. Gains calculated based on your annual debtors balance.</p>
    </div>
    
    <div class="section">
      <div class="section-header">Business Growth Without Additional Headcount</div>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Current Capacity</div>
          <div class="metric-value">${inputs.numberOfDebtors || 0}</div>
          <div class="metric-note">customers per month</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">New Automation</div>
          <div class="metric-value">${additionalCapacity}</div>
          <div class="metric-note">customers per month</div>
        </div>
      </div>
      <div class="metric-card" style="margin-top: 20px;">
        <div class="metric-label">Additional Capacity (No New Hires)</div>
        <div class="metric-value">+${additionalCapacity}</div>
        <div class="metric-note">customers per month</div>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: #f0fdf4; border-radius: 8px;">
        <p style="font-weight: 600; color: #166534; margin-bottom: 10px;">Growth Scenario: ${inputs.projectedCustomerGrowth || 0}% Customer Increase</p>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Current Customers</div>
            <div class="metric-value">${inputs.numberOfDebtors || 0}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Additional Customers</div>
            <div class="metric-value">${additionalCustomers}</div>
          </div>
        </div>
        <div class="metric-card green" style="margin-top: 15px;">
          <div class="metric-label">Additional Revenue Boost</div>
          <div class="metric-value">$${revenueBoost.toLocaleString()}k</div>
          <div class="metric-note">Without proportional cost increase</div>
        </div>
        <div class="metric-card green">
          <div class="metric-label">Projected Revenue Growth</div>
          <div class="metric-value">${inputs.projectedCustomerGrowth || 0}%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Additional Revenue Potential</div>
          <div class="metric-value">$${revenuePotential.toLocaleString()}k</div>
          <div class="metric-note">Without proportional cost increase</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-header">Savings Assumptions</div>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">DSO Improvement</div>
          <div class="metric-value">${inputs.dsoImprovement || 0}%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Labour Savings</div>
          <div class="metric-value">${inputs.labourSavings || 0}%</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-header">Financial Impact</div>
      <table class="data-table">
        <tbody>
          <tr>
            <td><strong>Annual Recurring Savings</strong></td>
            <td style="text-align: right; color: #10b981; font-weight: bold;">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"}</td>
          </tr>
          <tr>
            <td><strong>One-Time Cash Flow Improvement</strong></td>
            <td style="text-align: right; color: #0891b2; font-weight: bold;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"}</td>
          </tr>
          <tr>
            <td><strong>Monthly Operational Savings</strong></td>
            <td style="text-align: right; color: #10b981; font-weight: bold;">$${Math.round((results.totalAnnualBenefit || 0) / 12).toLocaleString()}</td>
          </tr>
          <tr>
            <td><strong>Total First Year Investment</strong></td>
            <td style="text-align: right; color: #ef4444; font-weight: bold;">$${results.totalImplementationAndAnnualCost?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="section">
      <div class="section-header">DSO Improvement</div>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Current DSO</div>
          <div class="metric-value">${results.currentDSO || 0}</div>
          <div class="metric-note">days</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Improved DSO</div>
          <div class="metric-value">${results.newDSO?.toFixed(0) || 0}</div>
          <div class="metric-note">days</div>
        </div>
        <div class="metric-card green">
          <div class="metric-label">Improvement</div>
          <div class="metric-value">${results.dsoReductionDays?.toFixed(0) || 0}</div>
          <div class="metric-note">days</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-header">Summary</div>
      <div class="summary-text">
        <p>By implementing the Kuhlekt invoice-to-cash platform with ${inputs.dsoImprovement || 0}% DSO improvement, your business will unlock <strong>$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"} in working capital</strong> and achieve <strong>$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"} in annual recurring savings</strong>. You also would improve to <strong>${results.newDSO?.toFixed(0) || 0} days</strong> freeing up ${results.dsoReductionDays?.toFixed(0) || 0} days of cash flow, allowing you to reinvest in growth or reduce debt.</p>
        
        <p>The platform's automation capabilities will save <strong>${inputs.labourSavings || 0}% in labour costs</strong> (approximately <strong>$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"} annually</strong>), freeing your team to focus on strategic activities. Additionally, our tools to launch diverse payment options without additional cost will reduce bad debts by an estimated <strong>$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"} per year</strong>.</p>
        
        <p>With a total first-year investment of <strong>$${results.totalImplementationAndAnnualCost?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"}</strong>, you'll achieve an impressive <strong>${results.roi?.toFixed(0) || 0}% ROI</strong> and reach payback in just <strong>${results.paybackMonths?.toFixed(1) || 0} months</strong>. The combination of improved cash flow, operational efficiency, and reduced risk makes Kuhlekt a strategic investment that pays for itself quickly while delivering long-term value to your business.</p>
      </div>
    </div>
    `
    }
    
    <div class="next-steps">
      <h3>Recommended Next Steps</h3>
      <ol>
        <li><strong>Contact Us:</strong> Reach out to our team at <strong>enquiries@kuhlekt.com</strong> to discuss your results and explore how Kuhlekt can benefit your business.</li>
        <li><strong>Arrange a Demonstration:</strong> See Kuhlekt in action with a personalized demonstration tailored to your business needs.</li>
        <li><strong>Pricing Discussion:</strong> Explore pricing options and potential customizations for your organization.</li>
        <li><strong>Implementation Plan:</strong> Discuss timeline, resources, and integration with our implementation team.</li>
      </ol>
    </div>
    
    <div class="footer">
      <p><strong>Kuhlekt®</strong> - Transforming Invoice-to-Cash</p>
      <p>Visit us at kuhlekt.com | Email: enquiries@kuhlekt.com</p>
      <p style="margin-top: 10px; font-size: 12px;">This report is generated based on the inputs provided and represents estimated outcomes. Actual results may vary based on implementation and business-specific factors.</p>
    </div>
  </div>
</body>
</html>`

      printWindow.document.write(htmlContent)
      printWindow.document.close()

      setTimeout(() => {
        printWindow.print()
        setIsGenerating(false)

        if (onDownloadComplete) {
          // Give a small delay to ensure print dialog has appeared
          setTimeout(() => {
            onDownloadComplete()
          }, 1000)
        }
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
