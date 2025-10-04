"use server"

import { sendEmail } from "@/lib/aws-ses"
import { createClient } from "@/lib/supabase/server"

interface ROIData {
  companyName: string
  email: string
  annualRevenue: number
  currentDSO: number
  invoiceVolume: number
  industry: string
}

export async function sendROIReport(data: ROIData) {
  try {
    const targetDSO = Math.max(15, data.currentDSO * 0.6)
    const dsoReduction = data.currentDSO - targetDSO
    const dailyRevenue = data.annualRevenue / 365
    const cashFlowImprovement = dailyRevenue * dsoReduction
    const annualSavings = cashFlowImprovement * 0.05

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .metric { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #0066cc; }
            .metric-label { font-weight: bold; color: #666; }
            .metric-value { font-size: 24px; color: #0066cc; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis Report</h1>
            </div>
            <div class="content">
              <p>Dear ${data.companyName},</p>
              <p>Thank you for using our ROI Calculator. Based on your inputs, here's your personalized analysis:</p>
              
              <div class="metric">
                <div class="metric-label">Current DSO</div>
                <div class="metric-value">${data.currentDSO} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Target DSO with Kuhlekt</div>
                <div class="metric-value">${targetDSO.toFixed(1)} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">DSO Reduction</div>
                <div class="metric-value">${dsoReduction.toFixed(1)} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Cash Flow Improvement</div>
                <div class="metric-value">$${cashFlowImprovement.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Annual Cost Savings</div>
                <div class="metric-value">$${annualSavings.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
              </div>
              
              <p>Ready to see these results in action? Schedule a demo with our team to learn how Kuhlekt can transform your accounts receivable process.</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="background-color: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Schedule a Demo</a>
              </p>
            </div>
            <div class="footer">
              <p>© 2025 Kuhlekt. All rights reserved.</p>
              <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
Your ROI Analysis Report

Dear ${data.companyName},

Thank you for using our ROI Calculator. Based on your inputs, here's your personalized analysis:

Current DSO: ${data.currentDSO} days
Target DSO with Kuhlekt: ${targetDSO.toFixed(1)} days
DSO Reduction: ${dsoReduction.toFixed(1)} days
Cash Flow Improvement: $${cashFlowImprovement.toLocaleString("en-US", { maximumFractionDigits: 0 })}
Annual Cost Savings: $${annualSavings.toLocaleString("en-US", { maximumFractionDigits: 0 })}

Ready to see these results in action? Schedule a demo with our team to learn how Kuhlekt can transform your accounts receivable process.

Visit: ${process.env.NEXT_PUBLIC_SITE_URL}/demo

© 2025 Kuhlekt. All rights reserved.
    `

    const result = await sendEmail({
      to: data.email,
      subject: "Your Kuhlekt ROI Analysis Report",
      text: emailText,
      html: emailHtml,
    })

    if (!result.success) {
      throw new Error(result.error || "Failed to send email")
    }

    const supabase = await createClient()
    await supabase.from("roi_calculations").insert({
      company_name: data.companyName,
      email: data.email,
      annual_revenue: data.annualRevenue,
      current_dso: data.currentDSO,
      target_dso: targetDSO,
      invoice_volume: data.invoiceVolume,
      industry: data.industry,
      cash_flow_improvement: cashFlowImprovement,
      annual_savings: annualSavings,
      created_at: new Date().toISOString(),
    })

    return { success: true, message: "ROI report sent successfully!" }
  } catch (error) {
    console.error("Error sending ROI report:", error)
    return {
      success: false,
      message: "Failed to send ROI report. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
