"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const company = formData.get("company") as string
    const invoiceVolume = formData.get("invoiceVolume") as string
    const avgInvoiceValue = formData.get("avgInvoiceValue") as string
    const currentDSO = formData.get("currentDSO") as string
    const collectionCost = formData.get("collectionCost") as string

    if (!email || !name) {
      return {
        success: false,
        message: "Email and name are required",
      }
    }

    // Calculate ROI metrics
    const annualInvoices = Number.parseInt(invoiceVolume) || 0
    const avgValue = Number.parseFloat(avgInvoiceValue) || 0
    const dso = Number.parseInt(currentDSO) || 0
    const costPerCollection = Number.parseFloat(collectionCost) || 0

    const annualRevenue = annualInvoices * avgValue
    const dsoReduction = Math.round(dso * 0.4) // 40% reduction
    const cashFlowImprovement = Math.round((annualRevenue / 365) * dsoReduction)
    const laborSavings = Math.round(annualInvoices * costPerCollection * 0.7)
    const totalAnnualSavings = cashFlowImprovement + laborSavings

    // Create email content
    const subject = "Your Kuhlekt ROI Analysis Report"
    const text = `Hi ${name},\n\nThank you for using the Kuhlekt ROI Calculator. Based on your inputs, here are your potential savings:\n\nAnnual Invoice Volume: ${annualInvoices.toLocaleString()}\nAverage Invoice Value: $${avgValue.toLocaleString()}\nCurrent DSO: ${dso} days\n\nProjected Benefits:\n- DSO Reduction: ${dsoReduction} days\n- Cash Flow Improvement: $${cashFlowImprovement.toLocaleString()}\n- Labor Cost Savings: $${laborSavings.toLocaleString()}\n- Total Annual Savings: $${totalAnnualSavings.toLocaleString()}\n\nTo learn more about how Kuhlekt can help your business, schedule a demo at https://kuhlekt.com/demo\n\nBest regards,\nThe Kuhlekt Team`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .metrics { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .metric-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .metric-label { font-weight: bold; }
            .metric-value { color: #2563eb; }
            .cta { text-align: center; margin: 30px 0; }
            .button { background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis Report</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for using the Kuhlekt ROI Calculator. Based on your inputs, here are your potential savings:</p>
              
              <div class="metrics">
                <h3>Your Inputs</h3>
                <div class="metric-row">
                  <span class="metric-label">Company:</span>
                  <span class="metric-value">${company || "N/A"}</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label">Annual Invoice Volume:</span>
                  <span class="metric-value">${annualInvoices.toLocaleString()}</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label">Average Invoice Value:</span>
                  <span class="metric-value">$${avgValue.toLocaleString()}</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label">Current DSO:</span>
                  <span class="metric-value">${dso} days</span>
                </div>
              </div>

              <div class="metrics">
                <h3>Projected Benefits with Kuhlekt</h3>
                <div class="metric-row">
                  <span class="metric-label">DSO Reduction:</span>
                  <span class="metric-value">${dsoReduction} days</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label">Cash Flow Improvement:</span>
                  <span class="metric-value">$${cashFlowImprovement.toLocaleString()}</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label">Labor Cost Savings:</span>
                  <span class="metric-value">$${laborSavings.toLocaleString()}</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label">Total Annual Savings:</span>
                  <span class="metric-value" style="font-size: 1.2em; color: #059669;">$${totalAnnualSavings.toLocaleString()}</span>
                </div>
              </div>

              <div class="cta">
                <p>Ready to unlock these savings for your business?</p>
                <a href="https://kuhlekt.com/demo" class="button">Schedule a Demo</a>
              </div>

              <p>Best regards,<br>The Kuhlekt Team</p>
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
    console.error("Error in sendROIReport:", error)
    return {
      success: false,
      message: "Failed to send ROI report",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
