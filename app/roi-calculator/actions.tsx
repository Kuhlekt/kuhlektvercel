"use server"

import { sendEmail } from "@/lib/aws-ses"

export interface ROIInputs {
  annualRevenue: number
  averageInvoiceValue: number
  currentDSO: number
  staffHours: number
}

export interface ROIResults {
  currentCosts: {
    laborCost: number
    opportunityCost: number
    totalAnnualCost: number
  }
  withKuhlekt: {
    laborCost: number
    opportunityCost: number
    totalAnnualCost: number
  }
  savings: {
    annualSavings: number
    threeYearSavings: number
    roi: number
    paybackMonths: number
  }
}

const KUHLEKT_ANNUAL_COST = 12000
const HOURLY_RATE = 50
const DSO_IMPROVEMENT = 15
const EFFICIENCY_GAIN = 0.6

export async function calculateROI(inputs: ROIInputs): Promise<ROIResults> {
  const currentLaborCost = inputs.staffHours * 52 * HOURLY_RATE
  const currentDSODays = inputs.currentDSO
  const dailyRevenue = inputs.annualRevenue / 365
  const currentOpportunityCost = dailyRevenue * currentDSODays * 0.05
  const currentTotalCost = currentLaborCost + currentOpportunityCost

  const newDSO = Math.max(currentDSODays - DSO_IMPROVEMENT, 20)
  const newStaffHours = inputs.staffHours * (1 - EFFICIENCY_GAIN)
  const newLaborCost = newStaffHours * 52 * HOURLY_RATE + KUHLEKT_ANNUAL_COST
  const newOpportunityCost = dailyRevenue * newDSO * 0.05
  const newTotalCost = newLaborCost + newOpportunityCost

  const annualSavings = currentTotalCost - newTotalCost
  const threeYearSavings = annualSavings * 3
  const roi = (threeYearSavings / (KUHLEKT_ANNUAL_COST * 3)) * 100
  const paybackMonths = (KUHLEKT_ANNUAL_COST / annualSavings) * 12

  return {
    currentCosts: {
      laborCost: currentLaborCost,
      opportunityCost: currentOpportunityCost,
      totalAnnualCost: currentTotalCost,
    },
    withKuhlekt: {
      laborCost: newLaborCost,
      opportunityCost: newOpportunityCost,
      totalAnnualCost: newTotalCost,
    },
    savings: {
      annualSavings,
      threeYearSavings,
      roi,
      paybackMonths,
    },
  }
}

export async function sendROIReport(
  email: string,
  inputs: ROIInputs,
  results: ROIResults,
): Promise<{ success: boolean; message: string }> {
  try {
    const subject = "Your Kuhlekt ROI Analysis Report"

    const text = `
Dear Valued Customer,

Thank you for using the Kuhlekt ROI Calculator. Here are your personalized results:

CURRENT SITUATION:
- Annual Revenue: $${inputs.annualRevenue.toLocaleString()}
- Average Invoice Value: $${inputs.averageInvoiceValue.toLocaleString()}
- Current DSO: ${inputs.currentDSO} days
- Weekly Staff Hours: ${inputs.staffHours}

CURRENT COSTS:
- Labor Cost: $${results.currentCosts.laborCost.toLocaleString()}
- Opportunity Cost: $${results.currentCosts.opportunityCost.toLocaleString()}
- Total Annual Cost: $${results.currentCosts.totalAnnualCost.toLocaleString()}

WITH KUHLEKT:
- Labor Cost: $${results.withKuhlekt.laborCost.toLocaleString()}
- Opportunity Cost: $${results.withKuhlekt.opportunityCost.toLocaleString()}
- Total Annual Cost: $${results.withKuhlekt.totalAnnualCost.toLocaleString()}

YOUR SAVINGS:
- Annual Savings: $${results.savings.annualSavings.toLocaleString()}
- 3-Year Savings: $${results.savings.threeYearSavings.toLocaleString()}
- ROI: ${results.savings.roi.toFixed(0)}%
- Payback Period: ${results.savings.paybackMonths.toFixed(1)} months

Ready to transform your accounts receivable process? Contact us to schedule a demo!

Best regards,
The Kuhlekt Team
    `.trim()

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .section h2 { color: #667eea; margin-top: 0; }
    .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .metric:last-child { border-bottom: none; }
    .label { font-weight: 600; color: #555; }
    .value { color: #667eea; font-weight: 700; }
    .highlight { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .highlight h2 { margin: 0 0 10px 0; font-size: 24px; }
    .highlight .big-number { font-size: 36px; font-weight: 700; margin: 10px 0; }
    .cta { text-align: center; margin: 30px 0; }
    .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Kuhlekt ROI Analysis</h1>
      <p>Personalized savings calculation based on your business metrics</p>
    </div>
    <div class="content">
      <div class="section">
        <h2>📊 Your Current Situation</h2>
        <div class="metric">
          <span class="label">Annual Revenue:</span>
          <span class="value">$${inputs.annualRevenue.toLocaleString()}</span>
        </div>
        <div class="metric">
          <span class="label">Average Invoice Value:</span>
          <span class="value">$${inputs.averageInvoiceValue.toLocaleString()}</span>
        </div>
        <div class="metric">
          <span class="label">Current DSO:</span>
          <span class="value">${inputs.currentDSO} days</span>
        </div>
        <div class="metric">
          <span class="label">Weekly Staff Hours:</span>
          <span class="value">${inputs.staffHours} hours</span>
        </div>
      </div>

      <div class="section">
        <h2>💰 Current Costs</h2>
        <div class="metric">
          <span class="label">Labor Cost:</span>
          <span class="value">$${results.currentCosts.laborCost.toLocaleString()}</span>
        </div>
        <div class="metric">
          <span class="label">Opportunity Cost:</span>
          <span class="value">$${results.currentCosts.opportunityCost.toLocaleString()}</span>
        </div>
        <div class="metric">
          <span class="label">Total Annual Cost:</span>
          <span class="value">$${results.currentCosts.totalAnnualCost.toLocaleString()}</span>
        </div>
      </div>

      <div class="section">
        <h2>🚀 With Kuhlekt</h2>
        <div class="metric">
          <span class="label">Labor Cost:</span>
          <span class="value">$${results.withKuhlekt.laborCost.toLocaleString()}</span>
        </div>
        <div class="metric">
          <span class="label">Opportunity Cost:</span>
          <span class="value">$${results.withKuhlekt.opportunityCost.toLocaleString()}</span>
        </div>
        <div class="metric">
          <span class="label">Total Annual Cost:</span>
          <span class="value">$${results.withKuhlekt.totalAnnualCost.toLocaleString()}</span>
        </div>
      </div>

      <div class="highlight">
        <h2>💎 Your Potential Savings</h2>
        <div class="big-number">$${results.savings.annualSavings.toLocaleString()}</div>
        <p style="margin: 5px 0;">Annual Savings</p>
        <div style="margin-top: 20px;">
          <p><strong>3-Year Savings:</strong> $${results.savings.threeYearSavings.toLocaleString()}</p>
          <p><strong>ROI:</strong> ${results.savings.roi.toFixed(0)}%</p>
          <p><strong>Payback Period:</strong> ${results.savings.paybackMonths.toFixed(1)} months</p>
        </div>
      </div>

      <div class="cta">
        <a href="https://kuhlekt.com/demo" class="button">Schedule Your Demo</a>
      </div>

      <p style="text-align: center; color: #666; font-size: 14px;">
        Questions? Contact us at info@kuhlekt.com or visit kuhlekt.com
      </p>
    </div>
  </div>
</body>
</html>
    `.trim()

    const result = await sendEmail({
      to: email,
      subject,
      text,
      html,
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
