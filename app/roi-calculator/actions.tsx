"use server"

import { createClient } from "@/lib/supabase/server"

// ROI Calculation functions
export async function calculateSimpleROI(data: {
  annualRevenue: number
  averageInvoiceValue: number
  averagePaymentDays: number
}) {
  const { annualRevenue, averageInvoiceValue, averagePaymentDays } = data

  // Calculate current DSO
  const currentDSO = averagePaymentDays

  // Estimate improvement (typically 30-40% reduction in DSO)
  const improvedDSO = currentDSO * 0.65 // 35% improvement

  // Calculate cash flow improvement
  const dailyRevenue = annualRevenue / 365
  const dsoReduction = currentDSO - improvedDSO
  const cashFlowImprovement = dailyRevenue * dsoReduction

  // Calculate time savings (estimate 20 hours per week)
  const hoursSavedPerWeek = 20
  const annualHoursSaved = hoursSavedPerWeek * 52
  const costPerHour = 50 // Average cost per hour for AR staff
  const annualTimeSavings = annualHoursSaved * costPerHour

  // Calculate total ROI
  const totalAnnualBenefit = cashFlowImprovement + annualTimeSavings
  const implementationCost = 25000 // Estimate
  const roi = ((totalAnnualBenefit - implementationCost) / implementationCost) * 100

  return {
    currentDSO,
    improvedDSO,
    dsoReduction,
    cashFlowImprovement,
    annualTimeSavings,
    totalAnnualBenefit,
    roi,
    paybackPeriod: implementationCost / (totalAnnualBenefit / 12), // in months
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  numberOfInvoices: number
  averageInvoiceValue: number
  currentDSO: number
  arStaffCount: number
  averageHourlyRate: number
  badDebtPercentage: number
}) {
  const {
    annualRevenue,
    numberOfInvoices,
    averageInvoiceValue,
    currentDSO,
    arStaffCount,
    averageHourlyRate,
    badDebtPercentage,
  } = data

  // Calculate improved metrics
  const improvedDSO = currentDSO * 0.65 // 35% improvement
  const dsoReduction = currentDSO - improvedDSO

  // Cash flow improvement
  const dailyRevenue = annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction

  // Time savings
  const currentTimePerInvoice = 15 // minutes
  const improvedTimePerInvoice = 5 // minutes
  const timeSavedPerInvoice = currentTimePerInvoice - improvedTimePerInvoice
  const totalMinutesSaved = numberOfInvoices * timeSavedPerInvoice
  const totalHoursSaved = totalMinutesSaved / 60
  const annualTimeSavings = totalHoursSaved * averageHourlyRate

  // Bad debt reduction
  const currentBadDebt = annualRevenue * (badDebtPercentage / 100)
  const improvedBadDebtPercentage = badDebtPercentage * 0.6 // 40% reduction
  const improvedBadDebt = annualRevenue * (improvedBadDebtPercentage / 100)
  const badDebtReduction = currentBadDebt - improvedBadDebt

  // Total benefits
  const totalAnnualBenefit = cashFlowImprovement + annualTimeSavings + badDebtReduction

  // Implementation and ongoing costs
  const implementationCost = 30000
  const annualSubscriptionCost = 12000
  const firstYearCost = implementationCost + annualSubscriptionCost

  // ROI calculations
  const firstYearROI = ((totalAnnualBenefit - firstYearCost) / firstYearCost) * 100
  const ongoingROI = ((totalAnnualBenefit - annualSubscriptionCost) / annualSubscriptionCost) * 100
  const paybackPeriod = firstYearCost / (totalAnnualBenefit / 12)

  return {
    currentDSO,
    improvedDSO,
    dsoReduction,
    cashFlowImprovement,
    annualTimeSavings,
    badDebtReduction,
    totalAnnualBenefit,
    firstYearCost,
    firstYearROI,
    ongoingROI,
    paybackPeriod,
    threeYearValue: totalAnnualBenefit * 3 - (implementationCost + annualSubscriptionCost * 3),
  }
}

// ClickSend Email helper
async function sendClickSendEmail(to: string, subject: string, htmlBody: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const emailAddressId = process.env.CLICKSEND_EMAIL_ADDRESS_ID

  if (!username || !apiKey || !emailAddressId) {
    throw new Error("ClickSend credentials not configured")
  }

  const emailAddressIdNum = Number.parseInt(emailAddressId, 10)
  if (isNaN(emailAddressIdNum)) {
    throw new Error("Invalid CLICKSEND_EMAIL_ADDRESS_ID")
  }

  const authToken = Buffer.from(`${username}:${apiKey}`).toString("base64")

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authToken}`,
    },
    body: JSON.stringify({
      to: [
        {
          email: to,
          name: to.split("@")[0],
        },
      ],
      from: {
        email_address_id: emailAddressIdNum,
        name: "Kuhlekt",
      },
      subject: subject,
      body: htmlBody,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`ClickSend API error: ${response.status} - ${errorBody}`)
  }

  return await response.json()
}

// Generate verification code
export async function generateVerificationCode(email: string) {
  try {
    const supabase = await createClient()

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in database
    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      used: false,
    })

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`)
    }

    // Send email via ClickSend
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .code { font-size: 32px; font-weight: bold; color: #0066cc; text-align: center; padding: 20px; background-color: white; border: 2px dashed #0066cc; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Verification Code</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for your interest in Kuhlekt's ROI Calculator. Your verification code is:</p>
              <div class="code">${code}</div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, "Your Kuhlekt Verification Code", htmlBody)

    return { success: true, message: "Verification code sent successfully" }
  } catch (error) {
    console.error("Error generating verification code:", error)
    throw error
  }
}

// Verify code
export async function verifyCode(email: string, code: string) {
  try {
    const supabase = await createClient()

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

    // Mark as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true, message: "Code verified successfully" }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, message: "Verification failed" }
  }
}

// Send ROI email
export async function sendROIEmail(email: string, results: any, isDetailed: boolean, formData: any) {
  try {
    const htmlBody = isDetailed
      ? `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0066cc; color: white; padding: 30px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .metric { background-color: white; padding: 20px; margin: 10px 0; border-left: 4px solid #0066cc; }
            .metric h3 { margin-top: 0; color: #0066cc; }
            .highlight { font-size: 24px; font-weight: bold; color: #0066cc; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #0066cc; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Kuhlekt ROI Analysis</h1>
              <p>Detailed Financial Impact Report</p>
            </div>
            <div class="content">
              <h2>Executive Summary</h2>
              <div class="metric">
                <h3>Total Annual Benefit</h3>
                <div class="highlight">$${results.totalAnnualBenefit.toLocaleString()}</div>
              </div>
              <div class="metric">
                <h3>First Year ROI</h3>
                <div class="highlight">${results.firstYearROI.toFixed(1)}%</div>
              </div>
              <div class="metric">
                <h3>Payback Period</h3>
                <div class="highlight">${results.paybackPeriod.toFixed(1)} months</div>
              </div>
              
              <h2>Key Improvements</h2>
              <table>
                <tr>
                  <th>Metric</th>
                  <th>Current</th>
                  <th>With Kuhlekt</th>
                  <th>Improvement</th>
                </tr>
                <tr>
                  <td>Days Sales Outstanding (DSO)</td>
                  <td>${results.currentDSO} days</td>
                  <td>${results.improvedDSO.toFixed(1)} days</td>
                  <td>${results.dsoReduction.toFixed(1)} days</td>
                </tr>
              </table>
              
              <h2>Financial Benefits Breakdown</h2>
              <div class="metric">
                <h3>Cash Flow Improvement</h3>
                <p>$${results.cashFlowImprovement.toLocaleString()}</p>
              </div>
              <div class="metric">
                <h3>Time Savings</h3>
                <p>$${results.annualTimeSavings.toLocaleString()}</p>
              </div>
              <div class="metric">
                <h3>Bad Debt Reduction</h3>
                <p>$${results.badDebtReduction.toLocaleString()}</p>
              </div>
              
              <h2>3-Year Projection</h2>
              <p class="highlight">$${results.threeYearValue.toLocaleString()}</p>
              
              <p style="margin-top: 30px;">Ready to achieve these results? Contact us to schedule a demo and see Kuhlekt in action.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
      : `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0066cc; color: white; padding: 30px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .metric { background-color: white; padding: 20px; margin: 10px 0; border-left: 4px solid #0066cc; }
            .metric h3 { margin-top: 0; color: #0066cc; }
            .highlight { font-size: 24px; font-weight: bold; color: #0066cc; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Kuhlekt ROI Summary</h1>
            </div>
            <div class="content">
              <div class="metric">
                <h3>Total Annual Benefit</h3>
                <div class="highlight">$${results.totalAnnualBenefit.toLocaleString()}</div>
              </div>
              <div class="metric">
                <h3>Return on Investment</h3>
                <div class="highlight">${results.roi.toFixed(1)}%</div>
              </div>
              <div class="metric">
                <h3>Payback Period</h3>
                <div class="highlight">${results.paybackPeriod.toFixed(1)} months</div>
              </div>
              
              <h2>Key Improvements</h2>
              <p>DSO Reduction: ${results.currentDSO} → ${results.improvedDSO.toFixed(1)} days</p>
              <p>Cash Flow Improvement: $${results.cashFlowImprovement.toLocaleString()}</p>
              <p>Annual Time Savings: $${results.annualTimeSavings.toLocaleString()}</p>
              
              <p style="margin-top: 30px;">Want to learn more? Contact us to schedule a personalized demo.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, "Your Kuhlekt ROI Analysis Results", htmlBody)

    return { success: true, message: "ROI results sent successfully" }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    throw error
  }
}
