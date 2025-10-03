"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (error) {
      console.error("Error storing verification code:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in storeVerificationCode:", error)
    return false
  }
}

export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const code = generateVerificationCode()
    const stored = await storeVerificationCode(email, code)

    if (!stored) {
      return {
        success: false,
        message: "Failed to store verification code. Please try again.",
      }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #666;">
            Your verification code is:
          </p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #999;">
            This code will expire in 10 minutes.
          </p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification code. Please try again.",
      }
    }

    return {
      success: true,
      message: "Verification code sent successfully!",
    }
  } catch (error) {
    console.error("Error in sendVerificationCode:", error)
    return {
      success: false,
      message: "Failed to send verification code. Please try again.",
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid or expired verification code.",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    await supabase
      .from("verification_codes")
      .update({ attempts: data.attempts + 1 })
      .eq("id", data.id)

    return {
      success: true,
      message: "Email verified successfully!",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
    }
  }
}

export async function calculateSimpleROI(data: {
  invoiceVolume: number
  averageInvoiceValue: number
  currentDSO: number
  employees: number
}) {
  const annualRevenue = data.invoiceVolume * data.averageInvoiceValue
  const timeSpentOnAR = data.employees * 20
  const costPerHour = 35
  const annualLaborCost = timeSpentOnAR * costPerHour * 52

  const targetDSO = Math.max(data.currentDSO * 0.65, 15)
  const dsoReduction = data.currentDSO - targetDSO
  const cashFlowImprovement = (annualRevenue / 365) * dsoReduction

  const automationSavings = annualLaborCost * 0.7
  const totalSavings = automationSavings + cashFlowImprovement

  const implementationCost = 25000
  const annualSubscription = 15000
  const roi = ((totalSavings - annualSubscription) / implementationCost) * 100
  const paybackMonths = implementationCost / (totalSavings / 12)

  return {
    currentDSO: data.currentDSO,
    targetDSO: Math.round(targetDSO),
    dsoReduction: Math.round(dsoReduction),
    cashFlowImprovement: Math.round(cashFlowImprovement),
    automationSavings: Math.round(automationSavings),
    totalSavings: Math.round(totalSavings),
    roi: Math.round(roi),
    paybackMonths: Math.round(paybackMonths * 10) / 10,
  }
}

export async function calculateDetailedROI(data: {
  invoiceVolume: number
  averageInvoiceValue: number
  currentDSO: number
  employees: number
  industry: string
  paymentTerms: string
}) {
  const simpleROI = await calculateSimpleROI(data)

  const industryMultipliers: { [key: string]: number } = {
    manufacturing: 1.1,
    wholesale: 1.15,
    services: 1.0,
    retail: 0.95,
  }

  const multiplier = industryMultipliers[data.industry] || 1.0
  const adjustedSavings = simpleROI.totalSavings * multiplier

  return {
    ...simpleROI,
    totalSavings: Math.round(adjustedSavings),
    roi: Math.round(((adjustedSavings - 15000) / 25000) * 100),
  }
}

export async function sendROIEmail(email: string, roiData: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Analysis Report",
      text: `Your ROI Analysis Report\n\nThank you for using the Kuhlekt ROI Calculator. Here are your results:\n\nCurrent DSO: ${roiData.currentDSO} days\nTarget DSO: ${roiData.targetDSO} days\nDSO Reduction: ${roiData.dsoReduction} days\n\nCash Flow Improvement: $${roiData.cashFlowImprovement.toLocaleString()}\nAutomation Savings: $${roiData.automationSavings.toLocaleString()}\nTotal Annual Savings: $${roiData.totalSavings.toLocaleString()}\n\nROI: ${roiData.roi}%\nPayback Period: ${roiData.paybackMonths} months`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">Your ROI Analysis Report</h1>
          
          <p style="font-size: 16px; color: #666;">
            Thank you for using the Kuhlekt ROI Calculator. Here are your personalized results:
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h2 style="color: #0066cc; margin-top: 0;">DSO Improvement</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Current DSO:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${roiData.currentDSO} days</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Target DSO:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${roiData.targetDSO} days</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>DSO Reduction:</strong></td>
                <td style="padding: 8px 0; text-align: right; color: #28a745; font-weight: bold;">${roiData.dsoReduction} days</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h2 style="color: #0066cc; margin-top: 0;">Financial Impact</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Cash Flow Improvement:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">$${roiData.cashFlowImprovement.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Automation Savings:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">$${roiData.automationSavings.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Total Annual Savings:</strong></td>
                <td style="padding: 8px 0; text-align: right; color: #28a745; font-weight: bold; font-size: 18px;">$${roiData.totalSavings.toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #e7f3ff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #0066cc;">
            <h2 style="color: #0066cc; margin-top: 0;">Investment Summary</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #bdd7ee;"><strong>Return on Investment:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #bdd7ee; text-align: right; color: #0066cc; font-weight: bold; font-size: 20px;">${roiData.roi}%</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Payback Period:</strong></td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${roiData.paybackMonths} months</td>
              </tr>
            </table>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd;">
            <p style="font-size: 14px; color: #666;">
              Ready to transform your accounts receivable process? Contact us today to learn more about how Kuhlekt can help you achieve these results.
            </p>
            <a href="https://kuhlekt.com/demo" style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 10px;">Schedule a Demo</a>
          </div>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send ROI report. Please try again.",
      }
    }

    return {
      success: true,
      message: "ROI report sent successfully!",
    }
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send ROI report. Please try again.",
    }
  }
}

export { generateVerificationCode }
