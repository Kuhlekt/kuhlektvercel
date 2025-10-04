"use server"

import { createClient } from "@/lib/supabase/server"

// ROI Calculation functions
export async function calculateSimpleROI(data: {
  currentARBalance: number
  averageInvoiceValue: number
  monthlyInvoices: number
  averageDSO: number
}) {
  const { currentARBalance, averageInvoiceValue, monthlyInvoices, averageDSO } = data

  // Calculate current annual revenue
  const annualRevenue = averageInvoiceValue * monthlyInvoices * 12

  // Estimate current bad debt (industry average 1-2%)
  const currentBadDebtRate = 0.015
  const currentBadDebt = annualRevenue * currentBadDebtRate

  // Calculate potential improvements with Kuhlekt
  const targetDSO = Math.max(15, averageDSO * 0.6) // 40% improvement
  const dsoReduction = averageDSO - targetDSO
  const dsoImprovementPercent = (dsoReduction / averageDSO) * 100

  // Calculate cash flow improvement
  const dailyRevenue = annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction

  // Calculate bad debt reduction (50% improvement)
  const improvedBadDebtRate = currentBadDebtRate * 0.5
  const badDebtSavings = annualRevenue * (currentBadDebtRate - improvedBadDebtRate)

  // Calculate staff time savings (assume 30% time savings)
  const estimatedARStaffCost = 60000 // Annual cost per AR staff member
  const staffTimeSavings = estimatedARStaffCost * 0.3

  // Total annual savings
  const totalAnnualSavings = cashFlowImprovement + badDebtSavings + staffTimeSavings

  // Calculate ROI (assuming $15,000 annual software cost)
  const annualSoftwareCost = 15000
  const roi = ((totalAnnualSavings - annualSoftwareCost) / annualSoftwareCost) * 100
  const paybackMonths = annualSoftwareCost / (totalAnnualSavings / 12)

  return {
    // Current state
    currentDSO: averageDSO,
    currentBadDebt,
    currentARBalance,

    // Improvements
    targetDSO,
    dsoReduction,
    dsoImprovementPercent,
    cashFlowImprovement,
    badDebtSavings,
    staffTimeSavings,

    // Financial results
    totalAnnualSavings,
    annualSoftwareCost,
    netAnnualBenefit: totalAnnualSavings - annualSoftwareCost,
    roi,
    paybackMonths,

    // Additional metrics
    threeYearValue: (totalAnnualSavings - annualSoftwareCost) * 3,
  }
}

export async function calculateDetailedROI(data: {
  currentARBalance: number
  averageInvoiceValue: number
  monthlyInvoices: number
  averageDSO: number
  currentBadDebtRate: number
  arStaffCount: number
  averageStaffCost: number
  industryType: string
}) {
  const {
    currentARBalance,
    averageInvoiceValue,
    monthlyInvoices,
    averageDSO,
    currentBadDebtRate,
    arStaffCount,
    averageStaffCost,
    industryType,
  } = data

  // Calculate current annual revenue
  const annualRevenue = averageInvoiceValue * monthlyInvoices * 12

  // Calculate current bad debt
  const currentBadDebt = annualRevenue * (currentBadDebtRate / 100)

  // Industry-specific improvements
  const industryFactors: Record<
    string,
    { dsoImprovement: number; badDebtImprovement: number; efficiencyGain: number }
  > = {
    manufacturing: { dsoImprovement: 0.45, badDebtImprovement: 0.55, efficiencyGain: 0.35 },
    wholesale: { dsoImprovement: 0.4, badDebtImprovement: 0.5, efficiencyGain: 0.3 },
    services: { dsoImprovement: 0.5, badDebtImprovement: 0.6, efficiencyGain: 0.4 },
    technology: { dsoImprovement: 0.45, badDebtImprovement: 0.55, efficiencyGain: 0.35 },
    healthcare: { dsoImprovement: 0.35, badDebtImprovement: 0.45, efficiencyGain: 0.25 },
    other: { dsoImprovement: 0.4, badDebtImprovement: 0.5, efficiencyGain: 0.3 },
  }

  const factors = industryFactors[industryType] || industryFactors.other

  // Calculate improvements
  const targetDSO = Math.max(15, averageDSO * (1 - factors.dsoImprovement))
  const dsoReduction = averageDSO - targetDSO
  const dsoImprovementPercent = (dsoReduction / averageDSO) * 100

  // Cash flow improvement
  const dailyRevenue = annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction

  // Bad debt reduction
  const improvedBadDebtRate = currentBadDebtRate * (1 - factors.badDebtImprovement)
  const badDebtSavings = annualRevenue * ((currentBadDebtRate - improvedBadDebtRate) / 100)

  // Staff efficiency gains
  const totalStaffCost = arStaffCount * averageStaffCost
  const staffTimeSavings = totalStaffCost * factors.efficiencyGain

  // Collection cost reduction (phone, mail, etc.)
  const estimatedCollectionCosts = annualRevenue * 0.02 // 2% of revenue
  const collectionCostSavings = estimatedCollectionCosts * 0.4 // 40% reduction

  // Total annual savings
  const totalAnnualSavings = cashFlowImprovement + badDebtSavings + staffTimeSavings + collectionCostSavings

  // Calculate ROI (assuming $15,000 annual software cost)
  const annualSoftwareCost = 15000
  const roi = ((totalAnnualSavings - annualSoftwareCost) / annualSoftwareCost) * 100
  const paybackMonths = annualSoftwareCost / (totalAnnualSavings / 12)

  return {
    // Current state
    currentDSO: averageDSO,
    currentBadDebt,
    currentBadDebtRate,
    currentARBalance,
    annualRevenue,

    // Improvements
    targetDSO,
    dsoReduction,
    dsoImprovementPercent,
    improvedBadDebtRate,

    // Savings breakdown
    cashFlowImprovement,
    badDebtSavings,
    staffTimeSavings,
    collectionCostSavings,

    // Financial results
    totalAnnualSavings,
    annualSoftwareCost,
    netAnnualBenefit: totalAnnualSavings - annualSoftwareCost,
    roi,
    paybackMonths,

    // Long-term value
    threeYearValue: (totalAnnualSavings - annualSoftwareCost) * 3,
    fiveYearValue: (totalAnnualSavings - annualSoftwareCost) * 5,
  }
}

// ClickSend Email Helper
async function sendClickSendEmail(to: string, subject: string, body: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const emailAddressId = process.env.CLICKSEND_EMAIL_ADDRESS_ID

  if (!username || !apiKey || !emailAddressId) {
    console.error("ClickSend credentials not configured")
    return { success: false, error: "Email service not configured" }
  }

  try {
    const auth = Buffer.from(`${username}:${apiKey}`).toString("base64")

    const response = await fetch("https://rest.clicksend.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        to: [{ email: to, name: to }],
        from: {
          email_address_id: Number.parseInt(emailAddressId, 10),
          name: "Kuhlekt ROI Calculator",
        },
        subject,
        body,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("ClickSend API error:", result)
      return { success: false, error: result }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

// Verification Code Generation
export async function generateVerificationCode(email: string) {
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
      throw new Error("Failed to generate verification code")
    }

    // Send email via ClickSend
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .code { font-size: 32px; font-weight: bold; color: #2563eb; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Kuhlekt ROI Calculator</h1>
          </div>
          <div class="content">
            <h2>Your Verification Code</h2>
            <p>Please use the following code to verify your email and receive your ROI calculation results:</p>
            <div class="code">${code}</div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const emailResult = await sendClickSendEmail(email, "Your Kuhlekt ROI Calculator Verification Code", emailBody)

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error)
      // Still return success if code was stored, just log the email error
      console.log("Verification code (email failed to send):", code)
    }

    return { success: true, code: process.env.NODE_ENV === "development" ? code : undefined }
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
    throw error
  }
}

// Verify Code
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
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return { success: false, error: "Invalid or expired verification code" }
    }

    // Mark code as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, error: "Verification failed" }
  }
}

// Send ROI Email
export async function sendROIEmail(email: string, results: any, calculationType: "simple" | "detailed") {
  try {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }

    const formatPercent = (value: number) => {
      return `${value.toFixed(1)}%`
    }

    let emailBody = ""

    if (calculationType === "simple") {
      emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; }
            .metric { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
            .metric-label { font-size: 14px; color: #666; text-transform: uppercase; }
            .metric-value { font-size: 28px; font-weight: bold; color: #2563eb; margin: 10px 0; }
            .highlight { background: #2563eb; color: white; padding: 25px; text-align: center; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-radius: 0 0 8px 8px; }
            .cta { display: inline-block; background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Kuhlekt ROI Analysis</h1>
              <p>Discover your potential savings with automated receivables management</p>
            </div>
            <div class="content">
              <div class="highlight">
                <h2 style="margin: 0;">Estimated Annual Savings</h2>
                <div style="font-size: 42px; font-weight: bold; margin: 15px 0;">${formatCurrency(results.totalAnnualSavings)}</div>
                <p style="margin: 0;">ROI: ${formatPercent(results.roi)}</p>
              </div>

              <h3>Key Improvements</h3>
              
              <div class="metric">
                <div class="metric-label">DSO Reduction</div>
                <div class="metric-value">${results.dsoReduction.toFixed(1)} days</div>
                <p>From ${results.currentDSO} to ${results.targetDSO.toFixed(1)} days (${formatPercent(results.dsoImprovementPercent)} improvement)</p>
              </div>

              <div class="metric">
                <div class="metric-label">Cash Flow Improvement</div>
                <div class="metric-value">${formatCurrency(results.cashFlowImprovement)}</div>
                <p>Faster collection means more cash available for business operations</p>
              </div>

              <div class="metric">
                <div class="metric-label">Bad Debt Reduction</div>
                <div class="metric-value">${formatCurrency(results.badDebtSavings)}</div>
                <p>Recover more revenue through better collection processes</p>
              </div>

              <div class="metric">
                <div class="metric-label">Staff Time Savings</div>
                <div class="metric-value">${formatCurrency(results.staffTimeSavings)}</div>
                <p>Automation reduces manual work and increases productivity</p>
              </div>

              <h3>Investment Summary</h3>
              <div class="metric">
                <div class="metric-label">Payback Period</div>
                <div class="metric-value">${results.paybackMonths.toFixed(1)} months</div>
                <p>Net Annual Benefit: ${formatCurrency(results.netAnnualBenefit)}</p>
                <p>3-Year Value: ${formatCurrency(results.threeYearValue)}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" class="cta">Schedule a Demo</a>
              </div>

              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                These calculations are estimates based on industry benchmarks and your provided data. 
                Actual results may vary based on your specific business circumstances.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              <p>${process.env.NEXT_PUBLIC_SITE_URL}</p>
            </div>
          </div>
        </body>
        </html>
      `
    } else {
      emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; }
            .metric { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
            .metric-label { font-size: 14px; color: #666; text-transform: uppercase; }
            .metric-value { font-size: 28px; font-weight: bold; color: #2563eb; margin: 10px 0; }
            .highlight { background: #2563eb; color: white; padding: 25px; text-align: center; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-radius: 0 0 8px 8px; }
            .cta { display: inline-block; background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .section { margin: 30px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Detailed Kuhlekt ROI Analysis</h1>
              <p>Comprehensive analysis of your receivables automation opportunity</p>
            </div>
            <div class="content">
              <div class="highlight">
                <h2 style="margin: 0;">Total Annual Savings</h2>
                <div style="font-size: 42px; font-weight: bold; margin: 15px 0;">${formatCurrency(results.totalAnnualSavings)}</div>
                <p style="margin: 0;">ROI: ${formatPercent(results.roi)}</p>
              </div>

              <div class="section">
                <h3>Current State Analysis</h3>
                <div class="metric">
                  <div class="metric-label">Annual Revenue</div>
                  <div class="metric-value">${formatCurrency(results.annualRevenue)}</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Current DSO</div>
                  <div class="metric-value">${results.currentDSO} days</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Current Bad Debt</div>
                  <div class="metric-value">${formatCurrency(results.currentBadDebt)}</div>
                  <p>${formatPercent(results.currentBadDebtRate)} of revenue</p>
                </div>
              </div>

              <div class="section">
                <h3>Projected Improvements</h3>
                <div class="metric">
                  <div class="metric-label">DSO Reduction</div>
                  <div class="metric-value">${results.dsoReduction.toFixed(1)} days</div>
                  <p>Target DSO: ${results.targetDSO.toFixed(1)} days (${formatPercent(results.dsoImprovementPercent)} improvement)</p>
                </div>
                <div class="metric">
                  <div class="metric-label">Bad Debt Rate Reduction</div>
                  <div class="metric-value">${formatPercent(results.currentBadDebtRate - results.improvedBadDebtRate)}</div>
                  <p>From ${formatPercent(results.currentBadDebtRate)} to ${formatPercent(results.improvedBadDebtRate)}</p>
                </div>
              </div>

              <div class="section">
                <h3>Savings Breakdown</h3>
                <div class="metric">
                  <div class="metric-label">Cash Flow Improvement</div>
                  <div class="metric-value">${formatCurrency(results.cashFlowImprovement)}</div>
                  <p>Faster collection means more working capital</p>
                </div>
                <div class="metric">
                  <div class="metric-label">Bad Debt Reduction</div>
                  <div class="metric-value">${formatCurrency(results.badDebtSavings)}</div>
                  <p>Better collection processes recover more revenue</p>
                </div>
                <div class="metric">
                  <div class="metric-label">Staff Efficiency Gains</div>
                  <div class="metric-value">${formatCurrency(results.staffTimeSavings)}</div>
                  <p>Automation increases team productivity</p>
                </div>
                <div class="metric">
                  <div class="metric-label">Collection Cost Reduction</div>
                  <div class="metric-value">${formatCurrency(results.collectionCostSavings)}</div>
                  <p>Lower operational costs for collections</p>
                </div>
              </div>

              <div class="section">
                <h3>Investment Summary</h3>
                <div class="metric">
                  <div class="metric-label">Annual Software Cost</div>
                  <div class="metric-value">${formatCurrency(results.annualSoftwareCost)}</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Net Annual Benefit</div>
                  <div class="metric-value">${formatCurrency(results.netAnnualBenefit)}</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Payback Period</div>
                  <div class="metric-value">${results.paybackMonths.toFixed(1)} months</div>
                </div>
              </div>

              <div class="section">
                <h3>Long-Term Value</h3>
                <div class="metric">
                  <div class="metric-label">3-Year Value</div>
                  <div class="metric-value">${formatCurrency(results.threeYearValue)}</div>
                </div>
                <div class="metric">
                  <div class="metric-label">5-Year Value</div>
                  <div class="metric-value">${formatCurrency(results.fiveYearValue)}</div>
                </div>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" class="cta">Schedule a Demo</a>
              </div>

              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                These calculations are estimates based on industry benchmarks and your provided data. 
                Actual results may vary based on your specific business circumstances.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              <p>${process.env.NEXT_PUBLIC_SITE_URL}</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const emailResult = await sendClickSendEmail(email, "Your Kuhlekt ROI Analysis Results", emailBody)

    if (!emailResult.success) {
      console.error("Failed to send ROI email:", emailResult.error)
      return { success: false, error: "Failed to send email" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return { success: false, error: "Failed to send email" }
  }
}
