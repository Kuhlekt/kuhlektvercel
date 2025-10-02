"use server"

import { sendEmail } from "@/lib/email-service"

interface ROICalculationData {
  annualRevenue: string
  currentDSO: string
  invoicesPerMonth: string
  hoursSpentPerWeek: string
  email: string
  phone: string
  results: {
    dsoReduction: number
    cashFlowImprovement: number
    timesSaved: number
    annualSavings: number
    roiPercentage: number
  }
}

export async function submitROICalculation(data: ROICalculationData) {
  try {
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

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ROI Calculator Submission</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  
                   Header 
                  <tr>
                    <td style="background: linear-gradient(135deg, #0891b2 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">New ROI Calculator Submission</h1>
                      <p style="margin: 10px 0 0; color: #e0f2fe; font-size: 16px;">Invoice to Cash Calculator</p>
                    </td>
                  </tr>

                   Contact Information 
                  <tr>
                    <td style="padding: 30px 30px 20px;">
                      <h2 style="margin: 0 0 20px; color: #111827; font-size: 20px; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">📧 Contact Information</h2>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding: 8px 0;">
                            <strong style="color: #374151; display: inline-block; width: 140px;">Email:</strong>
                            <span style="color: #0891b2; font-weight: 600;">${data.email}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <strong style="color: #374151; display: inline-block; width: 140px;">Phone:</strong>
                            <span style="color: #0891b2; font-weight: 600;">${data.phone}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                   Business Metrics 
                  <tr>
                    <td style="padding: 20px 30px;">
                      <h2 style="margin: 0 0 20px; color: #111827; font-size: 20px; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">📊 Business Metrics</h2>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding: 8px 0;">
                            <strong style="color: #374151; display: inline-block; width: 200px;">Annual Revenue:</strong>
                            <span style="color: #111827;">${formatCurrency(Number(data.annualRevenue))}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <strong style="color: #374151; display: inline-block; width: 200px;">Current DSO:</strong>
                            <span style="color: #111827;">${data.currentDSO} days</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <strong style="color: #374151; display: inline-block; width: 200px;">Invoices Per Month:</strong>
                            <span style="color: #111827;">${formatNumber(Number(data.invoicesPerMonth))}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <strong style="color: #374151; display: inline-block; width: 200px;">Hours Spent on AR:</strong>
                            <span style="color: #111827;">${data.hoursSpentPerWeek} hours/week</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                   Calculated Results 
                  <tr>
                    <td style="padding: 20px 30px;">
                      <h2 style="margin: 0 0 20px; color: #111827; font-size: 20px; border-bottom: 2px solid #10b981; padding-bottom: 10px;">💰 Calculated ROI Results</h2>
                      
                       ROI Percentage 
                      <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 4px solid #10b981; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                        <div style="font-size: 14px; color: #065f46; font-weight: 600; margin-bottom: 5px;">ESTIMATED ROI</div>
                        <div style="font-size: 36px; color: #059669; font-weight: bold;">${data.results.roiPercentage}%</div>
                        <div style="font-size: 13px; color: #047857; margin-top: 5px;">First year return on investment</div>
                      </div>

                       Metrics Grid 
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px;">
                        <tr>
                          <td style="width: 50%; padding: 15px; background-color: #eff6ff; border-radius: 4px; vertical-align: top;" valign="top">
                            <div style="font-size: 12px; color: #1e40af; font-weight: 600; margin-bottom: 5px;">DSO REDUCTION</div>
                            <div style="font-size: 24px; color: #1e3a8a; font-weight: bold;">${data.results.dsoReduction} days</div>
                            <div style="font-size: 11px; color: #3b82f6; margin-top: 3px;">Faster cash collection</div>
                          </td>
                          <td style="width: 10px;"></td>
                          <td style="width: 50%; padding: 15px; background-color: #ecfdf5; border-radius: 4px; vertical-align: top;" valign="top">
                            <div style="font-size: 12px; color: #065f46; font-weight: 600; margin-bottom: 5px;">CASH FLOW IMPACT</div>
                            <div style="font-size: 24px; color: #047857; font-weight: bold;">${formatCurrency(data.results.cashFlowImprovement)}</div>
                            <div style="font-size: 11px; color: #10b981; margin-top: 3px;">Additional working capital</div>
                          </td>
                        </tr>
                        <tr><td colspan="3" style="height: 10px;"></td></tr>
                        <tr>
                          <td style="width: 50%; padding: 15px; background-color: #faf5ff; border-radius: 4px; vertical-align: top;" valign="top">
                            <div style="font-size: 12px; color: #6b21a8; font-weight: 600; margin-bottom: 5px;">TIME SAVED</div>
                            <div style="font-size: 24px; color: #581c87; font-weight: bold;">${formatNumber(data.results.timesSaved)} hrs</div>
                            <div style="font-size: 11px; color: #8b5cf6; margin-top: 3px;">Per year on manual tasks</div>
                          </td>
                          <td style="width: 10px;"></td>
                          <td style="width: 50%; padding: 15px; background-color: #fef3c7; border-radius: 4px; vertical-align: top;" valign="top">
                            <div style="font-size: 12px; color: #92400e; font-weight: 600; margin-bottom: 5px;">ANNUAL SAVINGS</div>
                            <div style="font-size: 24px; color: #78350f; font-weight: bold;">${formatCurrency(data.results.annualSavings)}</div>
                            <div style="font-size: 11px; color: #d97706; margin-top: 3px;">Combined cost reduction</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                   Next Steps 
                  <tr>
                    <td style="padding: 20px 30px 40px;">
                      <div style="background-color: #f9fafb; border-radius: 4px; padding: 20px; border: 1px solid #e5e7eb;">
                        <h3 style="margin: 0 0 15px; color: #111827; font-size: 16px;">🎯 Recommended Next Steps</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #4b5563; line-height: 1.6;">
                          <li style="margin-bottom: 8px;">Schedule a personalized demo to see Kuhlekt in action</li>
                          <li style="margin-bottom: 8px;">Discuss their specific AR challenges and requirements</li>
                          <li style="margin-bottom: 8px;">Provide a detailed ROI analysis based on their business</li>
                          <li>Share relevant case studies and success stories</li>
                        </ul>
                      </div>
                    </td>
                  </tr>

                   Footer 
                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #6b7280; font-size: 12px;">
                        This is an automated notification from the Kuhlekt ROI Calculator
                      </p>
                      <p style="margin: 5px 0 0; color: #9ca3af; font-size: 11px;">
                        Submitted on ${new Date().toLocaleString("en-US", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `

    const emailText = `
New ROI Calculator Submission - Invoice to Cash

CONTACT INFORMATION
Email: ${data.email}
Phone: ${data.phone}

BUSINESS METRICS
Annual Revenue: ${formatCurrency(Number(data.annualRevenue))}
Current DSO: ${data.currentDSO} days
Invoices Per Month: ${formatNumber(Number(data.invoicesPerMonth))}
Hours Spent on AR: ${data.hoursSpentPerWeek} hours/week

CALCULATED ROI RESULTS
Estimated ROI: ${data.results.roiPercentage}%
DSO Reduction: ${data.results.dsoReduction} days
Cash Flow Impact: ${formatCurrency(data.results.cashFlowImprovement)}
Time Saved: ${formatNumber(data.results.timesSaved)} hours/year
Annual Savings: ${formatCurrency(data.results.annualSavings)}

NEXT STEPS
- Schedule a personalized demo
- Discuss their specific AR challenges
- Provide detailed ROI analysis
- Share relevant case studies

Submitted: ${new Date().toLocaleString()}
    `

    await sendEmail({
      to: "enquiries@kuhlekt.com",
      subject: `New ROI Calculator Lead - ${data.email}`,
      html: emailHtml,
      text: emailText,
    })

    return { success: true }
  } catch (error) {
    console.error("Error submitting ROI calculation:", error)
    return { success: false, error: "Failed to submit ROI calculation" }
  }
}
