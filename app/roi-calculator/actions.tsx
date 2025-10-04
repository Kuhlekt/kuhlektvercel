"use server"

import { createClient } from "@/lib/supabase/server"

// ============================================================================
// ROI Calculation Functions
// ============================================================================

export interface SimpleROIInputs {
  annualRevenue: number
  avgInvoiceValue: number
  avgDSO: number
  latePaymentRate: number
}

export interface SimpleROIResults {
  currentDSO: number
  projectedDSO: number
  dsoImprovement: number
  annualSavings: number
  threeYearSavings: number
  paybackPeriod: number
}

export interface DetailedROIInputs extends SimpleROIInputs {
  numberOfInvoices: number
  collectionStaffCost: number
  collectionStaffHours: number
  badDebtRate: number
  earlyPaymentDiscountRate: number
}

export interface DetailedROIResults extends SimpleROIResults {
  laborCostSavings: number
  badDebtReduction: number
  cashFlowImprovement: number
  workingCapitalImpact: number
  totalAnnualBenefit: number
}

export async function calculateSimpleROI(inputs: SimpleROIInputs): Promise<SimpleROIResults> {
  const { annualRevenue, avgInvoiceValue, avgDSO, latePaymentRate } = inputs

  // Calculate baseline metrics
  const currentDSO = avgDSO
  const projectedDSO = Math.max(currentDSO * 0.65, 20) // 35% improvement, min 20 days
  const dsoImprovement = currentDSO - projectedDSO

  // Calculate financial impact
  const dailyRevenue = annualRevenue / 365
  const annualSavings = dailyRevenue * dsoImprovement
  const threeYearSavings = annualSavings * 3

  // Estimate payback period (assuming implementation cost of ~$50k)
  const estimatedImplementationCost = 50000
  const paybackPeriod = estimatedImplementationCost / (annualSavings / 12)

  return {
    currentDSO,
    projectedDSO,
    dsoImprovement,
    annualSavings,
    threeYearSavings,
    paybackPeriod,
  }
}

export async function calculateDetailedROI(inputs: DetailedROIInputs): Promise<DetailedROIResults> {
  const {
    annualRevenue,
    avgInvoiceValue,
    avgDSO,
    latePaymentRate,
    numberOfInvoices,
    collectionStaffCost,
    collectionStaffHours,
    badDebtRate,
    earlyPaymentDiscountRate,
  } = inputs

  // Get simple ROI calculations
  const simpleResults = await calculateSimpleROI({
    annualRevenue,
    avgInvoiceValue,
    avgDSO,
    latePaymentRate,
  })

  // Calculate additional detailed metrics
  const laborCostSavings = collectionStaffCost * (collectionStaffHours / 2080) * 0.6 // 60% time savings
  const badDebtReduction = annualRevenue * (badDebtRate / 100) * 0.5 // 50% reduction in bad debt
  const cashFlowImprovement = simpleResults.annualSavings
  const workingCapitalImpact = (annualRevenue / 365) * simpleResults.dsoImprovement
  const totalAnnualBenefit = simpleResults.annualSavings + laborCostSavings + badDebtReduction

  return {
    ...simpleResults,
    laborCostSavings,
    badDebtReduction,
    cashFlowImprovement,
    workingCapitalImpact,
    totalAnnualBenefit,
  }
}

// ============================================================================
// ClickSend Email Function
// ============================================================================

async function sendClickSendEmail(to: string, subject: string, htmlBody: string): Promise<void> {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "support@kuhlekt.com"

  if (!username || !apiKey) {
    console.error("ClickSend credentials missing")
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
    subject: subject,
    body: htmlBody,
  }

  console.log("Sending email via ClickSend:", {
    to,
    from: fromEmail,
    subject,
  })

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  })

  const responseData = await response.json()

  if (!response.ok) {
    console.error("ClickSend error:", responseData)
    throw new Error(`ClickSend API error: ${JSON.stringify(responseData)}`)
  }

  console.log("Email sent successfully via ClickSend")
}

// ============================================================================
// Verification Code Functions
// ============================================================================

export async function generateVerificationCode(
  email: string,
): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    const supabase = await createClient()

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in database with 10-minute expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt,
      used: false,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      return { success: false, error: "Failed to generate verification code" }
    }

    // Send email via ClickSend
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .code { font-size: 32px; font-weight: bold; color: #2563eb; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
            .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verification Code</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Your verification code for the ROI Calculator is:</p>
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

    try {
      await sendClickSendEmail(email, "Your Verification Code - Kuhlekt ROI Calculator", htmlBody)
      console.log("Verification code sent successfully to:", email)
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      // Don't fail the whole operation if email fails
      console.log("Verification code (email failed):", code)
    }

    return { success: true, code }
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Find the code
    const { data: verificationData, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !verificationData) {
      return { success: false, error: "Invalid or expired verification code" }
    }

    // Mark as used
    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ used: true })
      .eq("id", verificationData.id)

    if (updateError) {
      console.error("Error marking code as used:", updateError)
      return { success: false, error: "Failed to verify code" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// ============================================================================
// ROI Email Function
// ============================================================================

export async function sendROIEmail(
  email: string,
  results: SimpleROIResults | DetailedROIResults,
  isDetailed: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }

    const formatNumber = (value: number, decimals = 1) => {
      return value.toFixed(decimals)
    }

    let htmlBody = ""

    if (isDetailed) {
      const detailedResults = results as DetailedROIResults
      htmlBody = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .metric { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
              .metric-label { font-size: 14px; color: #6b7280; margin-bottom: 5px; }
              .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
              .section { margin: 20px 0; }
              .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; }
              .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Your Detailed ROI Analysis</h1>
              </div>
              <div class="content">
                <p>Thank you for using the Kuhlekt ROI Calculator. Here are your detailed results:</p>
                
                <div class="section">
                  <div class="section-title">DSO Improvement</div>
                  <div class="metric">
                    <div class="metric-label">Current DSO</div>
                    <div class="metric-value">${formatNumber(detailedResults.currentDSO)} days</div>
                  </div>
                  <div class="metric">
                    <div class="metric-label">Projected DSO</div>
                    <div class="metric-value">${formatNumber(detailedResults.projectedDSO)} days</div>
                  </div>
                  <div class="metric">
                    <div class="metric-label">DSO Reduction</div>
                    <div class="metric-value">${formatNumber(detailedResults.dsoImprovement)} days</div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">Financial Impact</div>
                  <div class="metric">
                    <div class="metric-label">Annual Savings</div>
                    <div class="metric-value">${formatCurrency(detailedResults.annualSavings)}</div>
                  </div>
                  <div class="metric">
                    <div class="metric-label">Labor Cost Savings</div>
                    <div class="metric-value">${formatCurrency(detailedResults.laborCostSavings)}</div>
                  </div>
                  <div class="metric">
                    <div class="metric-label">Bad Debt Reduction</div>
                    <div class="metric-value">${formatCurrency(detailedResults.badDebtReduction)}</div>
                  </div>
                  <div class="metric">
                    <div class="metric-label">Total Annual Benefit</div>
                    <div class="metric-value">${formatCurrency(detailedResults.totalAnnualBenefit)}</div>
                  </div>
                  <div class="metric">
                    <div class="metric-label">3-Year Savings</div>
                    <div class="metric-value">${formatCurrency(detailedResults.threeYearSavings)}</div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">Working Capital</div>
                  <div class="metric">
                    <div class="metric-label">Cash Flow Improvement</div>
                    <div class="metric-value">${formatCurrency(detailedResults.cashFlowImprovement)}</div>
                  </div>
                  <div class="metric">
                    <div class="metric-label">Working Capital Impact</div>
                    <div class="metric-value">${formatCurrency(detailedResults.workingCapitalImpact)}</div>
                  </div>
                  <div class="metric">
                    <div class="metric-label">Payback Period</div>
                    <div class="metric-value">${formatNumber(detailedResults.paybackPeriod)} months</div>
                  </div>
                </div>

                <p style="margin-top: 30px;">Ready to unlock these savings? <a href="https://kuhlekt.com/demo" style="color: #2563eb;">Schedule a demo</a> to see how Kuhlekt can transform your accounts receivable process.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
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
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .metric { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
              .metric-label { font-size: 14px; color: #6b7280; margin-bottom: 5px; }
              .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
              .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Your ROI Analysis</h1>
              </div>
              <div class="content">
                <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
                
                <div class="metric">
                  <div class="metric-label">Current DSO</div>
                  <div class="metric-value">${formatNumber(results.currentDSO)} days</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Projected DSO</div>
                  <div class="metric-value">${formatNumber(results.projectedDSO)} days</div>
                </div>
                <div class="metric">
                  <div class="metric-label">DSO Improvement</div>
                  <div class="metric-value">${formatNumber(results.dsoImprovement)} days</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Annual Savings</div>
                  <div class="metric-value">${formatCurrency(results.annualSavings)}</div>
                </div>
                <div class="metric">
                  <div class="metric-label">3-Year Savings</div>
                  <div class="metric-value">${formatCurrency(results.threeYearSavings)}</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Payback Period</div>
                  <div class="metric-value">${formatNumber(results.paybackPeriod)} months</div>
                </div>

                <p style="margin-top: 30px;">Ready to unlock these savings? <a href="https://kuhlekt.com/demo" style="color: #2563eb;">Schedule a demo</a> to see how Kuhlekt can transform your accounts receivable process.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    }

    await sendClickSendEmail(email, "Your ROI Analysis Results - Kuhlekt", htmlBody)

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}
