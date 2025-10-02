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

    const formatNumber = (value: number) => {
      return new Intl.NumberFormat("en-US").format(value)
    }

    const text = `
New ROI Calculator Submission

CONTACT INFORMATION:
Email: ${data.email}
Phone: ${data.phone}

BUSINESS METRICS:
Annual Revenue: $${formatNumber(Number(data.annualRevenue))}
Current DSO: ${data.currentDSO} days
Invoices Per Month: ${formatNumber(Number(data.invoicesPerMonth))}
Hours Spent on AR Per Week: ${data.hoursSpentPerWeek} hours

CALCULATED RESULTS:
ROI Percentage: ${data.results.roiPercentage}%
DSO Reduction: ${data.results.dsoReduction} days
Cash Flow Improvement: ${formatCurrency(data.results.cashFlowImprovement)}
Time Saved Per Year: ${formatNumber(data.results.timesSaved)} hours
Annual Savings: ${formatCurrency(data.results.annualSavings)}

Submitted at: ${new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "long",
    })}
    `

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0891b2 0%, #2563eb 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
              🎯 New ROI Calculator Lead
            </h1>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 30px 20px;">
            
            <!-- Contact Information -->
            <div style="background: linear-gradient(135deg, #ecfeff 0%, #dbeafe 100%); padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #0891b2;">
              <h2 style="color: #0e7490; margin: 0 0 15px 0; font-size: 20px;">📧 Contact Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #374151; font-weight: 600;">Email:</td>
                  <td style="padding: 8px 0; color: #1f2937; text-align: right;">
                    <a href="mailto:${data.email}" style="color: #0891b2; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #374151; font-weight: 600;">Phone:</td>
                  <td style="padding: 8px 0; color: #1f2937; text-align: right;">
                    <a href="tel:${data.phone}" style="color: #0891b2; text-decoration: none;">${data.phone}</a>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Business Metrics -->
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #6b7280;">
              <h2 style="color: #374151; margin: 0 0 15px 0; font-size: 20px;">📊 Business Metrics</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: 600;">Annual Revenue:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937; font-weight: bold;">$${formatNumber(Number(data.annualRevenue))}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: 600;">Current DSO:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937; font-weight: bold;">${data.currentDSO} days</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: 600;">Invoices Per Month:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937; font-weight: bold;">${formatNumber(Number(data.invoicesPerMonth))}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #374151; font-weight: 600;">Hours Spent on AR/Week:</td>
                  <td style="padding: 10px 0; text-align: right; color: #1f2937; font-weight: bold;">${data.hoursSpentPerWeek} hours</td>
                </tr>
              </table>
            </div>

            <!-- ROI Results -->
            <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); padding: 25px; border-radius: 12px; border: 3px solid #10b981; margin-bottom: 25px;">
              <h2 style="color: #065f46; margin: 0 0 20px 0; font-size: 20px; text-align: center;">💰 Calculated ROI Results</h2>
              
              <!-- ROI Percentage Highlight -->
              <div style="text-align: center; background-color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="font-size: 56px; font-weight: bold; color: #0891b2; line-height: 1;">${data.results.roiPercentage}%</div>
                <div style="color: #6b7280; margin-top: 8px; font-size: 14px; font-weight: 600;">POTENTIAL ROI</div>
              </div>
              
              <!-- Metrics Grid -->
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 2px solid #a7f3d0;">
                    <div style="color: #065f46; font-weight: 600; font-size: 14px;">DSO Reduction</div>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 2px solid #a7f3d0; text-align: right;">
                    <div style="color: #047857; font-weight: bold; font-size: 22px;">${data.results.dsoReduction} days</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 2px solid #a7f3d0;">
                    <div style="color: #065f46; font-weight: 600; font-size: 14px;">Cash Flow Improvement</div>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 2px solid #a7f3d0; text-align: right;">
                    <div style="color: #047857; font-weight: bold; font-size: 22px;">${formatCurrency(data.results.cashFlowImprovement)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 2px solid #a7f3d0;">
                    <div style="color: #065f46; font-weight: 600; font-size: 14px;">Time Saved Per Year</div>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 2px solid #a7f3d0; text-align: right;">
                    <div style="color: #047857; font-weight: bold; font-size: 22px;">${formatNumber(data.results.timesSaved)} hrs</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <div style="color: #065f46; font-weight: 600; font-size: 14px;">Total Annual Savings</div>
                  </td>
                  <td style="padding: 12px 0; text-align: right;">
                    <div style="color: #047857; font-weight: bold; font-size: 26px;">${formatCurrency(data.results.annualSavings)}</div>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Next Steps -->
            <div style="background-color: #eff6ff; padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6; margin-bottom: 25px;">
              <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">🎯 Recommended Next Steps:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #1e3a8a;">
                <li style="margin-bottom: 8px;">Schedule a personalized demo call</li>
                <li style="margin-bottom: 8px;">Discuss specific implementation timeline</li>
                <li style="margin-bottom: 8px;">Review integration requirements with their ERP</li>
                <li>Provide case studies from similar-sized organizations</li>
              </ul>
            </div>

          </div>

          <!-- Footer -->
          <div style="background-color: #f3f4f6; padding: 20px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-align: center;">
              <strong>Submitted:</strong> ${new Date().toLocaleString("en-US", {
                dateStyle: "full",
                timeStyle: "long",
              })}
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 11px; text-align: center;">
              This is an automated notification from the Kuhlekt ROI Calculator
            </p>
          </div>
        </div>
      </body>
      </html>
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
