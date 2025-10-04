"use server"

import { sendEmail } from "@/lib/aws-ses"

export interface ROIData {
  invoiceVolume: number
  averageInvoiceValue: number
  currentDSO: number
  targetDSO: number
  currentCollectionRate: number
  targetCollectionRate: number
  staffCost: number
  softwareCost: number
}

export interface ROIResults {
  cashFlowImprovement: number
  collectionImprovement: number
  efficiencyGains: number
  totalAnnualSavings: number
  implementationCost: number
  paybackPeriod: number
  roi: number
  savings: {
    dsoReduction: number
    collectionIncrease: number
    staffEfficiency: number
  }
}

export async function calculateROI(data: ROIData): Promise<ROIResults> {
  const annualRevenue = data.invoiceVolume * data.averageInvoiceValue

  const dsoReduction = data.currentDSO - data.targetDSO
  const cashFlowImprovement = (annualRevenue / 365) * dsoReduction

  const collectionRateImprovement = data.targetCollectionRate - data.currentCollectionRate
  const collectionImprovement = annualRevenue * (collectionRateImprovement / 100)

  const efficiencyGains = data.staffCost * 0.3

  const totalAnnualSavings = cashFlowImprovement + collectionImprovement + efficiencyGains

  const implementationCost = data.softwareCost * 12

  const paybackPeriod = implementationCost / (totalAnnualSavings / 12)

  const roi = ((totalAnnualSavings - implementationCost) / implementationCost) * 100

  return {
    cashFlowImprovement,
    collectionImprovement,
    efficiencyGains,
    totalAnnualSavings,
    implementationCost,
    paybackPeriod,
    roi,
    savings: {
      dsoReduction: cashFlowImprovement,
      collectionIncrease: collectionImprovement,
      staffEfficiency: efficiencyGains,
    },
  }
}

export async function sendROIReport(
  email: string,
  roiData: ROIData,
  results: ROIResults,
): Promise<{ success: boolean; message: string }> {
  try {
    const subject = "Your Kuhlekt AR Automation ROI Report"

    const text = `
Dear Prospect,

Thank you for using our ROI Calculator. Here are your results:

INPUT DATA:
- Monthly Invoice Volume: ${roiData.invoiceVolume.toLocaleString()}
- Average Invoice Value: $${roiData.averageInvoiceValue.toLocaleString()}
- Current DSO: ${roiData.currentDSO} days
- Target DSO: ${roiData.targetDSO} days
- Current Collection Rate: ${roiData.currentCollectionRate}%
- Target Collection Rate: ${roiData.targetCollectionRate}%
- Monthly Staff Cost: $${roiData.staffCost.toLocaleString()}
- Monthly Software Cost: $${roiData.softwareCost.toLocaleString()}

ROI RESULTS:
- Cash Flow Improvement: $${results.cashFlowImprovement.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Collection Improvement: $${results.collectionImprovement.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Efficiency Gains: $${results.efficiencyGains.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Total Annual Savings: $${results.totalAnnualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Implementation Cost: $${results.implementationCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Payback Period: ${results.paybackPeriod.toFixed(1)} months
- ROI: ${results.roi.toFixed(1)}%

Ready to achieve these results? Contact us to schedule a demo.

Best regards,
The Kuhlekt Team
    `

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .metric:last-child { border-bottom: none; }
    .label { font-weight: 600; color: #4b5563; }
    .value { color: #10b981; font-weight: bold; }
    .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b; }
    .cta { text-align: center; margin: 30px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your AR Automation ROI Report</h1>
      <p>Powered by Kuhlekt</p>
    </div>
    <div class="content">
      <p>Thank you for using our ROI Calculator. Based on your inputs, here's what AR automation could deliver for your business:</p>
      
      <div class="section">
        <h2>Input Data</h2>
        <div class="metric">
          <span class="label">Monthly Invoice Volume:</span>
          <span class="value">${roiData.invoiceVolume.toLocaleString()}</span>
        </div>
        <div class="metric">
          <span class="label">Average Invoice Value:</span>
          <span class="value">$${roiData.averageInvoiceValue.toLocaleString()}</span>
        </div>
        <div class="metric">
          <span class="label">Current DSO:</span>
          <span class="value">${roiData.currentDSO} days</span>
        </div>
        <div class="metric">
          <span class="label">Target DSO:</span>
          <span class="value">${roiData.targetDSO} days</span>
        </div>
        <div class="metric">
          <span class="label">Current Collection Rate:</span>
          <span class="value">${roiData.currentCollectionRate}%</span>
        </div>
        <div class="metric">
          <span class="label">Target Collection Rate:</span>
          <span class="value">${roiData.targetCollectionRate}%</span>
        </div>
      </div>

      <div class="section">
        <h2>Your ROI Results</h2>
        <div class="metric">
          <span class="label">Cash Flow Improvement:</span>
          <span class="value">$${results.cashFlowImprovement.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div class="metric">
          <span class="label">Collection Improvement:</span>
          <span class="value">$${results.collectionImprovement.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div class="metric">
          <span class="label">Efficiency Gains:</span>
          <span class="value">$${results.efficiencyGains.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div class="metric">
          <span class="label">Total Annual Savings:</span>
          <span class="value">$${results.totalAnnualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div class="metric">
          <span class="label">Implementation Cost:</span>
          <span class="value">$${results.implementationCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </div>

      <div class="highlight">
        <strong>Payback Period:</strong> ${results.paybackPeriod.toFixed(1)} months<br>
        <strong>Return on Investment:</strong> ${results.roi.toFixed(1)}%
      </div>

      <div class="cta">
        <p>Ready to achieve these results?</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://kuhlekt.com"}/demo" class="button">Schedule a Demo</a>
      </div>

      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        This report is based on the data you provided and industry benchmarks. Actual results may vary.
      </p>
    </div>
  </div>
</body>
</html>
    `

    const result = await sendEmail({
      to: email,
      subject,
      text,
      html,
    })

    return result
  } catch (error) {
    console.error("Error sending ROI report:", error)
    return {
      success: false,
      message: "Failed to send report",
    }
  }
}
