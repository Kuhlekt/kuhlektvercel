"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIInputs {
  email: string
  annualRevenue: number
  averageInvoiceValue: number
  monthlyInvoices: number
  currentDSO: number
  collectionRate: number
  teamSize: number
  hourlyRate: number
}

export async function sendROIReport(inputs: ROIInputs) {
  try {
    const calculations = {
      targetDSO: Math.max(15, inputs.currentDSO * 0.6),
      dsoReduction: inputs.currentDSO - Math.max(15, inputs.currentDSO * 0.6),
      cashFlowImprovement: (inputs.annualRevenue / 365) * (inputs.currentDSO - Math.max(15, inputs.currentDSO * 0.6)),
      collectionRateImprovement: Math.min(98, inputs.collectionRate + 15) - inputs.collectionRate,
      additionalRevenue:
        (inputs.annualRevenue * (Math.min(98, inputs.collectionRate + 15) - inputs.collectionRate)) / 100,
      laborSavings: inputs.teamSize * inputs.hourlyRate * 20 * 12 * 0.6,
      totalAnnualBenefit: 0,
      roi: 0,
      paybackPeriod: 0,
    }

    calculations.totalAnnualBenefit =
      calculations.cashFlowImprovement + calculations.additionalRevenue + calculations.laborSavings
    const estimatedAnnualCost = 12000
    calculations.roi = ((calculations.totalAnnualBenefit - estimatedAnnualCost) / estimatedAnnualCost) * 100
    calculations.paybackPeriod = estimatedAnnualCost / (calculations.totalAnnualBenefit / 12)

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    .metric { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .metric-label { color: #666; font-size: 14px; margin-bottom: 5px; }
    .metric-value { color: #667eea; font-size: 28px; font-weight: bold; }
    .section-title { color: #667eea; font-size: 20px; font-weight: bold; margin: 25px 0 15px 0; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Kuhlekt ROI Analysis</h1>
      <p>Personalized Report for ${inputs.email}</p>
    </div>
    <div class="content">
      <p>Thank you for using the Kuhlekt ROI Calculator. Based on your inputs, here's what you can expect:</p>
      
      <div class="section-title">Cash Flow Improvements</div>
      <div class="metric">
        <div class="metric-label">DSO Reduction</div>
        <div class="metric-value">${calculations.dsoReduction.toFixed(1)} days</div>
      </div>
      <div class="metric">
        <div class="metric-label">Cash Flow Improvement</div>
        <div class="metric-value">$${calculations.cashFlowImprovement.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
      </div>
      
      <div class="section-title">Revenue Impact</div>
      <div class="metric">
        <div class="metric-label">Collection Rate Improvement</div>
        <div class="metric-value">${calculations.collectionRateImprovement.toFixed(1)}%</div>
      </div>
      <div class="metric">
        <div class="metric-label">Additional Annual Revenue</div>
        <div class="metric-value">$${calculations.additionalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
      </div>
      
      <div class="section-title">Operational Efficiency</div>
      <div class="metric">
        <div class="metric-label">Annual Labor Savings</div>
        <div class="metric-value">$${calculations.laborSavings.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
      </div>
      
      <div class="section-title">Bottom Line</div>
      <div class="metric">
        <div class="metric-label">Total Annual Benefit</div>
        <div class="metric-value">$${calculations.totalAnnualBenefit.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Return on Investment</div>
        <div class="metric-value">${calculations.roi.toFixed(0)}%</div>
      </div>
      <div class="metric">
        <div class="metric-label">Payback Period</div>
        <div class="metric-value">${calculations.paybackPeriod.toFixed(1)} months</div>
      </div>
      
      <p style="margin-top: 30px;">Ready to transform your accounts receivable process?</p>
      <a href="https://kuhlekt.com/demo" class="cta-button">Schedule a Demo</a>
      
      <p style="color: #666; font-size: 12px; margin-top: 30px;">This analysis is based on the information you provided and industry benchmarks. Actual results may vary.</p>
    </div>
  </div>
</body>
</html>
    `

    const textContent = `
Your Kuhlekt ROI Analysis

Thank you for using the Kuhlekt ROI Calculator. Based on your inputs, here's what you can expect:

Cash Flow Improvements:
- DSO Reduction: ${calculations.dsoReduction.toFixed(1)} days
- Cash Flow Improvement: $${calculations.cashFlowImprovement.toLocaleString("en-US", { maximumFractionDigits: 0 })}

Revenue Impact:
- Collection Rate Improvement: ${calculations.collectionRateImprovement.toFixed(1)}%
- Additional Annual Revenue: $${calculations.additionalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}

Operational Efficiency:
- Annual Labor Savings: $${calculations.laborSavings.toLocaleString("en-US", { maximumFractionDigits: 0 })}

Bottom Line:
- Total Annual Benefit: $${calculations.totalAnnualBenefit.toLocaleString("en-US", { maximumFractionDigits: 0 })}
- Return on Investment: ${calculations.roi.toFixed(0)}%
- Payback Period: ${calculations.paybackPeriod.toFixed(1)} months

Ready to transform your accounts receivable process? Visit https://kuhlekt.com/demo to schedule a demo.

This analysis is based on the information you provided and industry benchmarks. Actual results may vary.
    `

    const result = await sendEmail({
      to: inputs.email,
      subject: "Your Kuhlekt ROI Analysis",
      text: textContent,
      html: htmlContent,
    })

    return result
  } catch (error) {
    console.error("Error sending ROI report:", error)
    return {
      success: false,
      message: "Failed to send ROI report",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function generateVerificationCode(
  email: string,
): Promise<{ success: boolean; message: string; code?: string }> {
  try {
    const supabase = await createClient()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const { error } = await supabase.from("verification_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (error) {
      console.error("Database error:", error)
      return {
        success: false,
        message: "Failed to generate verification code",
      }
    }

    return {
      success: true,
      message: "Verification code generated",
      code,
    }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      message: "Failed to generate verification code",
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    const { data: records, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email.toLowerCase())
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)

    if (fetchError) {
      console.error("Database fetch error:", fetchError)
      return {
        success: false,
        message: "Failed to verify code",
      }
    }

    if (!records || records.length === 0) {
      return {
        success: false,
        message: "No valid verification code found",
      }
    }

    const record = records[0]

    if (record.attempts >= 3) {
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    if (record.code !== code) {
      await supabase
        .from("verification_codes")
        .update({ attempts: record.attempts + 1 })
        .eq("id", record.id)

      return {
        success: false,
        message: "Invalid verification code",
      }
    }

    await supabase.from("verification_codes").delete().eq("id", record.id)

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "Failed to verify code",
    }
  }
}
