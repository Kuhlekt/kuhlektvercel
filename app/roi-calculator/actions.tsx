"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"

interface ROICalculatorData {
  // Calculator inputs
  annualRevenue: string
  currentDSO: string
  invoicesPerMonth: string
  hoursSpentPerWeek: string
  // Contact info
  email: string
  phone: string
  // Calculated results
  results: {
    dsoReduction: number
    cashFlowImprovement: number
    timesSaved: number
    annualSavings: number
    roiPercentage: number
  }
}

export async function submitROICalculation(data: ROICalculatorData) {
  try {
    const subject = `ROI Calculator Submission from ${data.email}`

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }

    const text = `
New ROI Calculator Submission

CONTACT INFORMATION:
Email: ${data.email}
Phone: ${data.phone}

BUSINESS METRICS:
Annual Revenue: $${Number(data.annualRevenue).toLocaleString()}
Current DSO: ${data.currentDSO} days
Invoices Per Month: ${data.invoicesPerMonth}
Hours Spent on AR Per Week: ${data.hoursSpentPerWeek} hours

CALCULATED RESULTS:
ROI Percentage: ${data.results.roiPercentage}%
DSO Reduction: ${data.results.dsoReduction} days
Cash Flow Improvement: ${formatCurrency(data.results.cashFlowImprovement)}
Time Saved Per Year: ${data.results.timesSaved} hours
Annual Savings: ${formatCurrency(data.results.annualSavings)}

Submitted at: ${new Date().toLocaleString()}
    `

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0891b2; border-bottom: 3px solid #0891b2; padding-bottom: 10px;">
          ROI Calculator Submission
        </h2>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Contact Information</h3>
          <p style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</p>
          <p style="margin: 8px 0;"><strong>Phone:</strong> ${data.phone}</p>
        </div>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Business Metrics</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Annual Revenue:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">$${Number(data.annualRevenue).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Current DSO:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${data.currentDSO} days</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Invoices Per Month:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${data.invoicesPerMonth}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Hours Spent on AR/Week:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${data.hoursSpentPerWeek} hours</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981;">
          <h3 style="color: #065f46; margin-top: 0;">Calculated Results</h3>
          <div style="text-align: center; margin: 20px 0;">
            <div style="font-size: 48px; font-weight: bold; color: #0891b2;">${data.results.roiPercentage}%</div>
            <div style="color: #6b7280; margin-top: 5px;">Potential ROI</div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1fae5;"><strong>DSO Reduction:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1fae5; text-align: right;">${data.results.dsoReduction} days</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1fae5;"><strong>Cash Flow Improvement:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1fae5; text-align: right;">${formatCurrency(data.results.cashFlowImprovement)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1fae5;"><strong>Time Saved Per Year:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1fae5; text-align: right;">${data.results.timesSaved} hours</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Annual Savings:</strong></td>
              <td style="padding: 8px 0; text-align: right; font-size: 18px; color: #065f46;"><strong>${formatCurrency(data.results.annualSavings)}</strong></td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>Submitted at: ${new Date().toLocaleString()}</p>
          <p style="margin-top: 10px;">
            <strong>Next Steps:</strong> Follow up with this lead to discuss how Kuhlekt can help them achieve these results.
          </p>
        </div>
      </div>
    `

    const result = await sendEmailWithSES({
      to: "enquiries@kuhlekt.com",
      subject,
      text,
      html,
    })

    if (result.success) {
      console.log("ROI calculator submission sent successfully:", result.messageId)
      return { success: true }
    } else {
      console.error("Failed to send ROI calculator submission:", result.message)
      return { success: false, error: result.message }
    }
  } catch (error) {
    console.error("Error submitting ROI calculator:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
