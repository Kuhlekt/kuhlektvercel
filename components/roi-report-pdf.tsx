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

      // Parse input values
      const numberOfDebtors = Number.parseFloat(inputs.numberOfDebtors) || 0
      const numberOfCollectors = Number.parseFloat(inputs.numberOfCollectors) || 1
      const dsoImprovement = Number.parseFloat(inputs.dsoImprovement) || 25
      const labourSavings = Number.parseFloat(inputs.labourSavings) || 30
      const implementationCost = Number.parseFloat(inputs.implementationCost) || 0
      const monthlyCost = Number.parseFloat(inputs.monthlyCost) || 0
      const currentDSODays = Number.parseFloat(inputs.currentDSODays) || 45
      const debtorsBalance = Number.parseFloat(inputs.debtorsBalance) || 0

      // Calculate capacity metrics
      const currentCapacity = numberOfDebtors / numberOfCollectors
      const additionalCapacityPercent = labourSavings / 100
      const additionalCapacity = Math.round(currentCapacity * additionalCapacityPercent)
      const implementationCapacity = Math.round(currentCapacity + additionalCapacity)

      // Growth scenario - 50% customer increase
      const growthScenarioCustomers = Math.round(numberOfDebtors * 0.5)

      // Payment terms analysis - calculate based on actual data
      const dailyRevenue = debtorsBalance / currentDSODays
      const dsoImprovementPercent = dsoImprovement / 100

      const paymentTermsData = [
        {
          term: "Net 30",
          currentDSO: Math.round(currentDSODays * 1.0), // Assuming current is Net 30
          improvedDSO: Math.round(currentDSODays * (1 - dsoImprovementPercent)),
          get released() {
            return Math.round((this.currentDSO - this.improvedDSO) * dailyRevenue)
          },
        },
        {
          term: "Net 60",
          currentDSO: Math.round(currentDSODays * 1.5), // 50% longer
          improvedDSO: Math.round(currentDSODays * 1.5 * (1 - dsoImprovementPercent)),
          get released() {
            return Math.round((this.currentDSO - this.improvedDSO) * dailyRevenue)
          },
        },
        {
          term: "Net 90",
          currentDSO: Math.round(currentDSODays * 2.0), // Double
          improvedDSO: Math.round(currentDSODays * 2.0 * (1 - dsoImprovementPercent)),
          get released() {
            return Math.round((this.currentDSO - this.improvedDSO) * dailyRevenue)
          },
        },
      ]

      // First year investment
      const annualCost = monthlyCost * 12
      const totalFirstYearCost = implementationCost + annualCost

      // Bad debt reduction assumption (50% improvement)
      const badDebtReductionPercent = 50

      // Calculate chart data
      const investmentAmount = totalFirstYearCost
      const savingsAmount = results.totalAnnualBenefit || 0
      const maxAmount = Math.max(investmentAmount, savingsAmount)

      const year1Net = savingsAmount - implementationCost
      const year2Net = savingsAmount * 2 - totalFirstYearCost
      const year3Net = savingsAmount * 3 - totalFirstYearCost - annualCost * 2

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
            
            .chart-container {
              background: white;
              border: 2px solid #e5e7eb;
              border-radius: 8px;
              padding: 30px;
              margin: 15px 0;
            }
            
            .chart-title {
              font-size: 14px;
              font-weight: 600;
              color: #374151;
              margin-bottom: 20px;
              text-align: center;
            }
            
            .bar-chart {
              display: flex;
              align-items: flex-end;
              justify-content: space-around;
              height: 200px;
              margin: 20px 0;
              padding: 0 20px;
            }
            
            .bar-group {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              margin: 0 10px;
            }
            
            .bar {
              width: 80px;
              background: linear-gradient(to top, #0891b2, #06b6d4);
              border-radius: 4px 4px 0 0;
              display: flex;
              align-items: flex-start;
              justify-content: center;
              padding-top: 8px;
              position: relative;
            }
            
            .bar.negative {
              background: linear-gradient(to top, #dc2626, #ef4444);
            }
            
            .bar.positive {
              background: linear-gradient(to top, #16a34a, #22c55e);
            }
            
            .bar-value {
              font-size: 11px;
              font-weight: 600;
              color: white;
            }
            
            .bar-label {
              margin-top: 10px;
              font-size: 12px;
              font-weight: 600;
              color: #6b7280;
              text-align: center;
            }
            
            .line-chart {
              position: relative;
              height: 200px;
              margin: 30px 0;
            }
            
            .line-chart-grid {
              position: absolute;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            
            .grid-line {
              border-top: 1px dashed #e5e7eb;
              position: relative;
            }
            
            .grid-label {
              position: absolute;
              left: -60px;
              top: -8px;
              font-size: 10px;
              color: #6b7280;
            }
            
            .line-chart-path {
              position: absolute;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: flex-end;
              padding: 0 40px;
            }
            
            .line-point {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              position: relative;
            }
            
            .line-dot {
              width: 12px;
              height: 12px;
              background: #0891b2;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              position: absolute;
            }
            
            .line-value {
              position: absolute;
              top: -25px;
              font-size: 11px;
              font-weight: 600;
              color: #0891b2;
              white-space: nowrap;
            }
            
            .line-year {
              position: absolute;
              bottom: -30px;
              font-size: 12px;
              color: #6b7280;
              font-weight: 600;
            }
            
            .dso-comparison-chart {
              display: flex;
              justify-content: center;
              align-items: flex-end;
              height: 200px;
              margin: 20px 0;
              gap: 40px;
            }
            
            .dso-bar-group {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 120px;
            }
            
            .dso-bar {
              width: 100%;
              background: linear-gradient(to top, #0891b2, #06b6d4);
              border-radius: 4px 4px 0 0;
              display: flex;
              align-items: flex-start;
              justify-content: center;
              padding-top: 12px;
              position: relative;
            }
            
            .dso-bar.current {
              background: linear-gradient(to top, #dc2626, #ef4444);
            }
            
            .dso-bar.improved {
              background: linear-gradient(to top, #16a34a, #22c55e);
            }
            
            .dso-bar-value {
              font-size: 18px;
              font-weight: 700;
              color: white;
            }
            
            .dso-bar-label {
              margin-top: 12px;
              font-size: 13px;
              font-weight: 600;
              color: #6b7280;
            }
            
            .dso-bar-days {
              font-size: 11px;
              color: #9ca3af;
              margin-top: 4px;
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
              <p>Monthly Cash Flow improvements: $${Math.round((results.totalAnnualBenefit || 0) / 12).toLocaleString()} per month. This includes interest savings, labour cost reductions, and bad debt improvements.</p>
            </div>
            
            <div class="info-box">
              <h4>Current DSO</h4>
              <p>Your current DSO of ${currentDSODays} days is the baseline metric. Savings are calculated against this metric along with your cost of capital. By improving DSO to ${results.newDSO?.toFixed(0) || currentDSODays} days, you'll release $${results.workingCapitalReleased?.toLocaleString() || "0"} in working capital.</p>
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
                      (term, idx) => `
                    <tr class="${idx === 0 ? "highlight" : ""}">
                      <td><strong>${term.term}${idx === 0 ? " (Current)" : ""}</strong></td>
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
                  <div class="value">${Math.round(currentCapacity).toLocaleString()}</div>
                  <p style="font-size: 11px; color: #78716c; margin-top: 8px;">customers per collector</p>
                </div>
                <div class="capacity-card implementation">
                  <div class="label">With Implementation</div>
                  <div class="value">${implementationCapacity.toLocaleString()}</div>
                  <p style="font-size: 11px; color: #78716c; margin-top: 8px;">customers per collector</p>
                </div>
              </div>
              
              <div class="mini-metrics">
                <div class="mini-metric">
                  <div class="label">Additional Capacity (No New Hires)</div>
                  <div class="value">+${additionalCapacity.toLocaleString()}</div>
                </div>
                <div class="mini-metric">
                  <div class="label">Growth Enabled</div>
                  <div class="value">${Math.round((additionalCapacity / currentCapacity) * 100)}%</div>
                </div>
                <div class="mini-metric">
                  <div class="label">Efficiency Gain</div>
                  <div class="value">${labourSavings}%</div>
                </div>
              </div>
              
              <div class="growth-box">
                <h4>✓ Growth Scenario: 50% Customer Increase</h4>
                <div class="growth-metrics">
                  <div class="growth-metric">
                    <div class="label">New Customers</div>
                    <div class="value">${growthScenarioCustomers.toLocaleString()}</div>
                  </div>
                  <div class="growth-metric">
                    <div class="label">Handled Without Hiring</div>
                    <div class="value">${Math.min(growthScenarioCustomers, additionalCapacity).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div class="info-box">
                <h4>Additional Customer Business Goal</h4>
                <p>Without automation: would need ${Math.ceil(growthScenarioCustomers / currentCapacity)} new collectors at ~$50,000 each = $${(Math.ceil(growthScenarioCustomers / currentCapacity) * 50000).toLocaleString()} hiring cost. 
                With automation: ${additionalCapacity.toLocaleString()} additional customers handled automatically, saving significant hiring and training costs.</p>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Investment vs Annual Savings</div>
              <div class="chart-container">
                <div class="chart-title">First Year Comparison</div>
                <div class="bar-chart">
                  <div class="bar-group">
                    <div class="bar negative" style="height: ${(investmentAmount / maxAmount) * 180}px;">
                      <div class="bar-value">$${(investmentAmount / 1000).toFixed(0)}k</div>
                    </div>
                    <div class="bar-label">Investment</div>
                  </div>
                  <div class="bar-group">
                    <div class="bar positive" style="height: ${(savingsAmount / maxAmount) * 180}px;">
                      <div class="bar-value">$${(savingsAmount / 1000).toFixed(0)}k</div>
                    </div>
                    <div class="bar-label">Annual Savings</div>
                  </div>
                  <div class="bar-group">
                    <div class="bar positive" style="height: ${Math.max(0, (year1Net / maxAmount) * 180)}px;">
                      <div class="bar-value">$${(year1Net / 1000).toFixed(0)}k</div>
                    </div>
                    <div class="bar-label">Year 1 Net</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Cumulative Savings Over Time (3 Years)</div>
              <div class="chart-container">
                <div class="line-chart">
                  <div class="line-chart-grid">
                    <div class="grid-line">
                      <span class="grid-label">$${Math.round(year3Net / 1000)}k</span>
                    </div>
                    <div class="grid-line">
                      <span class="grid-label">$${Math.round(year3Net / 2000)}k</span>
                    </div>
                    <div class="grid-line">
                      <span class="grid-label">$0</span>
                    </div>
                  </div>
                  <div class="line-chart-path">
                    <div class="line-point">
                      <div class="line-dot" style="bottom: ${(year1Net / year3Net) * 160}px;"></div>
                      <div class="line-value" style="bottom: ${(year1Net / year3Net) * 160 + 15}px;">$${(year1Net / 1000).toFixed(0)}k</div>
                      <div class="line-year">Year 1</div>
                    </div>
                    <div class="line-point">
                      <div class="line-dot" style="bottom: ${(year2Net / year3Net) * 160}px;"></div>
                      <div class="line-value" style="bottom: ${(year2Net / year3Net) * 160 + 15}px;">$${(year2Net / 1000).toFixed(0)}k</div>
                      <div class="line-year">Year 2</div>
                    </div>
                    <div class="line-point">
                      <div class="line-dot" style="bottom: 160px;"></div>
                      <div class="line-value" style="bottom: 175px;">$${(year3Net / 1000).toFixed(0)}k</div>
                      <div class="line-year">Year 3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
           Page 3: Financial Impact & Summary 
          <div class="page page-break">
            ${logoBase64 ? `<img src="${logoBase64}" alt="Kuhlekt" class="logo-small" />` : '<div style="height: 40px;"></div>'}
            
            <div class="section">
              <div class="section-title">DSO Comparison</div>
              <div class="chart-container">
                <div class="dso-comparison-chart">
                  <div class="dso-bar-group">
                    <div class="dso-bar current" style="height: ${((results.currentDSO || currentDSODays) / 90) * 160}px;">
                      <div class="dso-bar-value">${results.currentDSO?.toFixed(0) || currentDSODays}</div>
                    </div>
                    <div class="dso-bar-label">Current DSO</div>
                    <div class="dso-bar-days">${results.currentDSO?.toFixed(0) || currentDSODays} days</div>
                  </div>
                  <div class="dso-bar-group">
                    <div class="dso-bar improved" style="height: ${((results.newDSO || currentDSODays) / 90) * 160}px;">
                      <div class="dso-bar-value">${results.newDSO?.toFixed(0) || currentDSODays}</div>
                    </div>
                    <div class="dso-bar-label">Improved DSO</div>
                    <div class="dso-bar-days">${results.newDSO?.toFixed(0) || currentDSODays} days</div>
                  </div>
                </div>
                <div style="text-align: center; margin-top: 30px; padding: 16px; background: #f0f9ff; border-radius: 8px;">
                  <p style="font-size: 14px; font-weight: 600; color: #0891b2;">
                    <strong>${results.dsoReductionDays?.toFixed(0) || "0"} days faster</strong> (${dsoImprovement}% reduction)
                  </p>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Savings Assumptions</div>
              <div class="savings-cards">
                <div class="savings-card dso">
                  <div class="label">DSO Improvement</div>
                  <div class="value">${dsoImprovement}%</div>
                </div>
                <div class="savings-card bad-debt">
                  <div class="label">Bad Debt Reduction</div>
                  <div class="value">${badDebtReductionPercent}%</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Financial Impact</div>
              
              <div class="financial-grid">
                <div class="financial-item positive">
                  <div class="label">Annual Recurring Savings</div>
                  <div class="value">$${(results.totalAnnualBenefit || 0).toLocaleString()}</div>
                  <p style="font-size: 10px; color: #6b7280; margin-top: 4px;">Interest + Labour + Bad Debt</p>
                </div>
                <div class="financial-item positive">
                  <div class="label">One-Time Cash Flow (Better Balance)</div>
                  <div class="value">$${(results.workingCapitalReleased || 0).toLocaleString()}</div>
                  <p style="font-size: 10px; color: #6b7280; margin-top: 4px;">Working capital released</p>
                </div>
                <div class="financial-item positive">
                  <div class="label">Monthly Operational Savings</div>
                  <div class="value">$${Math.round((results.totalAnnualBenefit || 0) / 12).toLocaleString()}</div>
                  <p style="font-size: 10px; color: #6b7280; margin-top: 4px;">Reduced labour costs</p>
                </div>
                <div class="financial-item negative">
                  <div class="label">Total First Year Investment</div>
                  <div class="value">-$${totalFirstYearCost.toLocaleString()}</div>
                  <p style="font-size: 10px; color: #6b7280; margin-top: 4px;">Implementation + Annual cost</p>
                </div>
              </div>
              
              <div style="margin-top: 20px; padding: 16px; background: #f9fafb; border-radius: 8px;">
                <h4 style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">Breakdown of Annual Savings:</h4>
                <div style="font-size: 12px; color: #4b5563;">
                  <p style="margin-bottom: 6px;">• Interest Savings: $${(results.interestSavings || 0).toLocaleString()}</p>
                  <p style="margin-bottom: 6px;">• Labour Cost Savings: $${(results.labourCostSavings || 0).toLocaleString()}</p>
                  <p style="margin-bottom: 6px;">• Bad Debt Reduction: $${(results.badDebtReduction || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">DSO Improvement</div>
              <div class="dso-metrics">
                <div class="dso-metric current">
                  <div class="label">Current</div>
                  <div class="value">${results.currentDSO?.toFixed(0) || currentDSODays}</div>
                  <p style="font-size: 10px; color: #6b7280; margin-top: 4px;">days</p>
                </div>
                <div class="dso-metric improved">
                  <div class="label">Improved</div>
                  <div class="value">${results.newDSO?.toFixed(0) || currentDSODays}</div>
                  <p style="font-size: 10px; color: #6b7280; margin-top: 4px;">days</p>
                </div>
                <div class="dso-metric reduction">
                  <div class="label">Reduction</div>
                  <div class="value">${results.dsoReductionDays?.toFixed(0) || "0"}</div>
                  <p style="font-size: 10px; color: #6b7280; margin-top: 4px;">days faster</p>
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
                DSO by <strong>${dsoImprovement}%</strong> (from ${results.currentDSO?.toFixed(0) || currentDSODays} to ${results.newDSO?.toFixed(0) || currentDSODays} days), freeing up <strong>$${(results.workingCapitalReleased || 0).toLocaleString()}</strong> 
                in working capital without adding headcount.
              </p>
              <p>
                The total annual benefit of <strong>$${(results.totalAnnualBenefit || 0).toLocaleString()}</strong> includes 
                <strong>$${(results.interestSavings || 0).toLocaleString()}</strong> in interest savings, 
                <strong>$${(results.labourCostSavings || 0).toLocaleString()}</strong> in labour cost reductions, and 
                <strong>$${(results.badDebtReduction || 0).toLocaleString()}</strong> in bad debt improvements.
              </p>
              <p>
                Additionally, your team of ${numberOfCollectors} collectors can handle <strong>${Math.round((additionalCapacity / currentCapacity) * 100)}%</strong> 
                more customers (${additionalCapacity.toLocaleString()} additional accounts) without hiring, while delivering superior customer 
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
