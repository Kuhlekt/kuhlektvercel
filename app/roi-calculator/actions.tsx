"use server"

import { createClient } from "@/lib/supabase/server"

// ROI Calculation Functions
export async function calculateSimpleROI(formData: {
  currentARDays: number
  invoiceVolume: number
  averageInvoiceValue: number
}) {
  const { currentARDays, invoiceVolume, averageInvoiceValue } = formData

  // Calculations
  const currentDSO = currentARDays
  const projectedDSO = Math.max(15, currentDSO * 0.4) // 60% reduction, minimum 15 days
  const dsoReduction = currentDSO - projectedDSO

  const annualRevenue = invoiceVolume * averageInvoiceValue * 12
  const currentARBalance = (annualRevenue / 365) * currentDSO
  const projectedARBalance = (annualRevenue / 365) * projectedDSO
  const cashFlowImprovement = currentARBalance - projectedARBalance

  const annualInterestRate = 0.08
  const financialImpact = cashFlowImprovement * annualInterestRate

  const implementationCost = 50000
  const annualLicenseFee = 24000
  const totalFirstYearCost = implementationCost + annualLicenseFee

  const roi = ((financialImpact - totalFirstYearCost) / totalFirstYearCost) * 100
  const paybackMonths = totalFirstYearCost / (financialImpact / 12)

  return {
    currentDSO,
    projectedDSO,
    dsoReduction,
    cashFlowImprovement,
    financialImpact,
    roi,
    paybackMonths,
    annualRevenue,
    implementationCost,
    annualLicenseFee,
  }
}

export async function calculateDetailedROI(formData: {
  currentARDays: number
  invoiceVolume: number
  averageInvoiceValue: number
  collectionStaffCount: number
  avgStaffSalary: number
  disputeRate: number
  badDebtRate: number
}) {
  const {
    currentARDays,
    invoiceVolume,
    averageInvoiceValue,
    collectionStaffCount,
    avgStaffSalary,
    disputeRate,
    badDebtRate,
  } = formData

  // Basic calculations from simple ROI
  const simpleResults = await calculateSimpleROI({
    currentARDays,
    invoiceVolume,
    averageInvoiceValue,
  })

  // Additional detailed calculations
  const annualRevenue = invoiceVolume * averageInvoiceValue * 12

  // Staff efficiency gains
  const currentStaffCost = collectionStaffCount * avgStaffSalary
  const projectedStaffNeeded = Math.max(1, Math.ceil(collectionStaffCount * 0.4)) // 60% reduction
  const projectedStaffCost = projectedStaffNeeded * avgStaffSalary
  const staffCostSavings = currentStaffCost - projectedStaffCost

  // Dispute reduction
  const currentDisputeCost = annualRevenue * (disputeRate / 100) * 0.15 // 15% handling cost
  const projectedDisputeRate = disputeRate * 0.5 // 50% reduction
  const projectedDisputeCost = annualRevenue * (projectedDisputeRate / 100) * 0.15
  const disputeSavings = currentDisputeCost - projectedDisputeCost

  // Bad debt reduction
  const currentBadDebt = annualRevenue * (badDebtRate / 100)
  const projectedBadDebtRate = badDebtRate * 0.7 // 30% reduction
  const projectedBadDebt = annualRevenue * (projectedBadDebtRate / 100)
  const badDebtSavings = currentBadDebt - projectedBadDebt

  // Total benefits
  const totalAnnualBenefit = simpleResults.financialImpact + staffCostSavings + disputeSavings + badDebtSavings

  // ROI calculations
  const implementationCost = 75000 // Higher for enterprise
  const annualLicenseFee = 48000 // Higher for enterprise
  const totalFirstYearCost = implementationCost + annualLicenseFee

  const detailedROI = ((totalAnnualBenefit - totalFirstYearCost) / totalFirstYearCost) * 100
  const detailedPaybackMonths = totalFirstYearCost / (totalAnnualBenefit / 12)

  return {
    ...simpleResults,
    collectionStaffCount,
    projectedStaffNeeded,
    staffCostSavings,
    currentDisputeRate: disputeRate,
    projectedDisputeRate,
    disputeSavings,
    currentBadDebtRate: badDebtRate,
    projectedBadDebtRate,
    badDebtSavings,
    totalAnnualBenefit,
    detailedROI,
    detailedPaybackMonths,
    implementationCost,
    annualLicenseFee,
  }
}

// ClickSend Email Helper Function
async function sendClickSendEmail(to: string, subject: string, htmlBody: string, textBody: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_EMAIL_ADDRESS_ID || "support@kuhlekt.com"

  if (!username || !apiKey) {
    console.error("Missing ClickSend credentials")
    throw new Error("Email service not configured")
  }

  const auth = Buffer.from(`${username}:${apiKey}`).toString("base64")

  const payload = {
    to: [
      {
        email: to,
        name: to.split("@")[0],
      },
    ],
    from: {
      email_address: fromEmail,
      name: "Kuhlekt",
    },
    subject,
    body: htmlBody,
  }

  console.log("Sending ClickSend email with payload:", JSON.stringify(payload, null, 2))

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error("ClickSend API error:", JSON.stringify(data, null, 2))
    throw new Error(`Failed to send email: ${data.response_msg || "Unknown error"}`)
  }

  console.log("ClickSend response:", JSON.stringify(data, null, 2))
  return data
}

// Verification Code Functions
export async function generateVerificationCode(email: string) {
  try {
    console.log("Environment variables check:", {
      hasUsername: !!process.env.CLICKSEND_USERNAME,
      hasApiKey: !!process.env.CLICKSEND_API_KEY,
      emailFrom: process.env.CLICKSEND_EMAIL_ADDRESS_ID,
    })

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const supabase = createClient()

    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt,
      used: false,
    })

    if (error) {
      console.error("Supabase error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    // Send email via ClickSend
    const subject = "Your Kuhlekt ROI Calculator Verification Code"
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Verification Code</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Thank you for using the Kuhlekt ROI Calculator!</p>
            <p style="font-size: 16px; margin-bottom: 20px;">Your verification code is:</p>
            <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h2 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h2>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">This code will expire in 10 minutes.</p>
            <p style="font-size: 14px; color: #666;">If you didn't request this code, please ignore this email.</p>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
            <p>&copy; 2025 Kuhlekt. All rights reserved.</p>
          </div>
        </body>
      </html>
    `
    const textBody = `Your Kuhlekt ROI Calculator verification code is: ${code}. This code will expire in 10 minutes.`

    try {
      await sendClickSendEmail(email, subject, htmlBody, textBody)
      console.log(`Verification code sent to ${email}`)
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
      // Return the code anyway so testing can continue
      console.log("VERIFICATION CODE FOR TESTING:", code)
    }

    return { success: true, code } // Return code for testing purposes
  } catch (error) {
    console.error("Error generating verification code:", error)
    throw error
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !data) {
      return { success: false, message: "Invalid or expired verification code" }
    }

    // Mark code as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, message: "Verification failed" }
  }
}

// Send ROI Email
export async function sendROIEmail(email: string, results: any, isDetailed = false) {
  try {
    const subject = "Your Kuhlekt ROI Calculator Results"

    let htmlBody = ""

    if (isDetailed) {
      htmlBody = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Your Detailed ROI Analysis</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Key Metrics</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="font-size: 18px; margin: 10px 0;"><strong>ROI:</strong> <span style="color: #10b981; font-size: 24px;">${results.detailedROI.toFixed(1)}%</span></p>
                <p style="font-size: 18px; margin: 10px 0;"><strong>Payback Period:</strong> ${results.detailedPaybackMonths.toFixed(1)} months</p>
                <p style="font-size: 18px; margin: 10px 0;"><strong>Annual Benefit:</strong> $${results.totalAnnualBenefit.toLocaleString()}</p>
              </div>

              <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">DSO Improvement</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Current DSO:</strong> ${results.currentDSO} days</p>
                <p><strong>Projected DSO:</strong> ${results.projectedDSO} days</p>
                <p><strong>DSO Reduction:</strong> <span style="color: #10b981;">${results.dsoReduction.toFixed(1)} days</span></p>
                <p><strong>Cash Flow Improvement:</strong> $${results.cashFlowImprovement.toLocaleString()}</p>
              </div>

              <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">Operational Efficiency</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Current Staff:</strong> ${results.collectionStaffCount} people</p>
                <p><strong>Projected Staff Needed:</strong> ${results.projectedStaffNeeded} people</p>
                <p><strong>Staff Cost Savings:</strong> $${results.staffCostSavings.toLocaleString()}/year</p>
              </div>

              <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">Risk Reduction</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Dispute Rate Reduction:</strong> ${results.currentDisputeRate.toFixed(1)}% → ${results.projectedDisputeRate.toFixed(1)}%</p>
                <p><strong>Dispute Savings:</strong> $${results.disputeSavings.toLocaleString()}/year</p>
                <p><strong>Bad Debt Reduction:</strong> ${results.currentBadDebtRate.toFixed(1)}% → ${results.projectedBadDebtRate.toFixed(1)}%</p>
                <p><strong>Bad Debt Savings:</strong> $${results.badDebtSavings.toLocaleString()}/year</p>
              </div>

              <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">Investment</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Implementation Cost:</strong> $${results.implementationCost.toLocaleString()}</p>
                <p><strong>Annual License Fee:</strong> $${results.annualLicenseFee.toLocaleString()}</p>
                <p><strong>Total First Year Cost:</strong> $${(results.implementationCost + results.annualLicenseFee).toLocaleString()}</p>
              </div>

              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
                <h3 style="margin: 0 0 10px 0;">Ready to Transform Your AR Process?</h3>
                <p style="margin: 10px 0;">Schedule a demo to see Kuhlekt in action</p>
                <a href="https://kuhlekt.com/demo" style="display: inline-block; background: white; color: #059669; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Book a Demo</a>
              </div>
            </div>
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
              <p>&copy; 2025 Kuhlekt. All rights reserved.</p>
            </div>
          </body>
        </html>
      `
    } else {
      htmlBody = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Your ROI Analysis</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Key Results</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="font-size: 18px; margin: 10px 0;"><strong>ROI:</strong> <span style="color: #10b981; font-size: 24px;">${results.roi.toFixed(1)}%</span></p>
                <p style="font-size: 18px; margin: 10px 0;"><strong>Payback Period:</strong> ${results.paybackMonths.toFixed(1)} months</p>
                <p style="font-size: 18px; margin: 10px 0;"><strong>Annual Financial Impact:</strong> $${results.financialImpact.toLocaleString()}</p>
              </div>

              <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">DSO Improvement</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Current DSO:</strong> ${results.currentDSO} days</p>
                <p><strong>Projected DSO:</strong> ${results.projectedDSO} days</p>
                <p><strong>DSO Reduction:</strong> <span style="color: #10b981;">${results.dsoReduction.toFixed(1)} days</span></p>
                <p><strong>Cash Flow Improvement:</strong> $${results.cashFlowImprovement.toLocaleString()}</p>
              </div>

              <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">Investment</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Implementation Cost:</strong> $${results.implementationCost.toLocaleString()}</p>
                <p><strong>Annual License Fee:</strong> $${results.annualLicenseFee.toLocaleString()}</p>
              </div>

              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
                <h3 style="margin: 0 0 10px 0;">Want a More Detailed Analysis?</h3>
                <p style="margin: 10px 0;">Use our detailed calculator for a comprehensive breakdown</p>
                <a href="https://kuhlekt.com" style="display: inline-block; background: white; color: #059669; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Get Detailed Analysis</a>
              </div>
            </div>
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
              <p>&copy; 2025 Kuhlekt. All rights reserved.</p>
            </div>
          </body>
        </html>
      `
    }

    const textBody = `Your Kuhlekt ROI Calculator Results - ROI: ${isDetailed ? results.detailedROI.toFixed(1) : results.roi.toFixed(1)}%`

    await sendClickSendEmail(email, subject, htmlBody, textBody)

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    throw error
  }
}
