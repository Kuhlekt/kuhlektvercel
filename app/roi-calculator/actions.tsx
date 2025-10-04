"use server"

import { createClient } from "@/lib/supabase/server"

// Helper function to send emails via ClickSend
async function sendClickSendEmail(to: string, subject: string, html: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "support@kuhlekt.com"

  if (!username || !apiKey) {
    throw new Error("ClickSend credentials not configured")
  }

  const auth = Buffer.from(`${username}:${apiKey}`).toString("base64")

  // First, fetch the list of verified email addresses to get the email_address_id
  const addressesResponse = await fetch("https://rest.clicksend.com/v3/email/addresses", {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })

  if (!addressesResponse.ok) {
    throw new Error(`Failed to fetch email addresses: ${addressesResponse.status}`)
  }

  const addressesData = await addressesResponse.json()
  const matchingAddress = addressesData.data?.data?.find(
    (addr: any) => addr.email_address.toLowerCase() === fromEmail.toLowerCase(),
  )

  if (!matchingAddress) {
    throw new Error(`No verified email address found for ${fromEmail}`)
  }

  const emailAddressId = matchingAddress.email_address_id

  const payload = {
    to: [
      {
        email: to,
        name: to.split("@")[0],
      },
    ],
    from: {
      email_address_id: emailAddressId,
      name: "Kuhlekt",
    },
    subject: subject,
    body: html,
  }

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`ClickSend API error: ${response.status} - ${errorText}`)
  }

  return await response.json()
}

export async function calculateSimpleROI(data: {
  currentDSO: string
  averageInvoiceValue: string
  monthlyInvoices: string
  simpleDSOImprovement: string
  simpleCostOfCapital: string
}) {
  const currentDSO = Number.parseFloat(data.currentDSO)
  const averageInvoiceValue = Number.parseFloat(data.averageInvoiceValue)
  const monthlyInvoices = Number.parseFloat(data.monthlyInvoices)
  const dsoImprovement = Number.parseFloat(data.simpleDSOImprovement) / 100
  const costOfCapital = Number.parseFloat(data.simpleCostOfCapital) / 100

  const annualRevenue = averageInvoiceValue * monthlyInvoices * 12
  const currentCashTied = (annualRevenue / 365) * currentDSO
  const newDSO = currentDSO * (1 - dsoImprovement)
  const newCashTied = (annualRevenue / 365) * newDSO
  const cashReleased = currentCashTied - newCashTied
  const annualSavings = cashReleased * costOfCapital

  return {
    currentDSO,
    newDSO,
    currentCashTied,
    cashReleased,
    annualSavings,
    annualRevenue,
  }
}

export async function calculateDetailedROI(data: {
  implementationCost: string
  monthlyCost: string
  perAnnumDirectLabourCosts: string
  interestType: "loan" | "deposit"
  interestRate: string
  averageBadDebt: string
  currentBadDebts: string
  labourSavings: string
  dsoImprovement: string
  currentDSODays: string
  debtorsBalance: string
  averagePaymentTerms: "net30" | "net60" | "net90"
  numberOfDebtors: string
  numberOfCollectors: string
  projectedCustomerGrowth: string
}) {
  const implementationCost = Number.parseFloat(data.implementationCost)
  const monthlyCost = Number.parseFloat(data.monthlyCost)
  const annualCost = monthlyCost * 12
  const totalFirstYearCost = implementationCost + annualCost

  const labourCosts = Number.parseFloat(data.perAnnumDirectLabourCosts)
  const labourSavingsPercent = Number.parseFloat(data.labourSavings) / 100
  const labourCostSavings = labourCosts * labourSavingsPercent

  const currentDSO = Number.parseFloat(data.currentDSODays)
  const dsoImprovementPercent = Number.parseFloat(data.dsoImprovement) / 100
  const dsoReductionDays = currentDSO * dsoImprovementPercent
  const newDSO = currentDSO - dsoReductionDays

  const debtorsBalance = Number.parseFloat(data.debtorsBalance)
  const dailyRevenue = debtorsBalance / currentDSO
  const workingCapitalReleased = dailyRevenue * dsoReductionDays

  const interestRate = Number.parseFloat(data.interestRate) / 100
  const interestSavings = workingCapitalReleased * interestRate

  const currentBadDebts = Number.parseFloat(data.currentBadDebts)
  const badDebtReductionPercent = 0.5
  const badDebtReduction = currentBadDebts * badDebtReductionPercent

  const totalAnnualBenefit = labourCostSavings + interestSavings + badDebtReduction
  const netBenefit = totalAnnualBenefit - annualCost
  const roi = (netBenefit / totalFirstYearCost) * 100
  const paybackMonths = totalFirstYearCost / (totalAnnualBenefit / 12)

  return {
    implementationCost,
    annualCost,
    totalFirstYearCost,
    labourCostSavings,
    dsoReductionDays,
    newDSO,
    workingCapitalReleased,
    interestSavings,
    badDebtReduction,
    totalAnnualBenefit,
    netBenefit,
    roi,
    paybackMonths,
  }
}

export async function generateVerificationCode(email: string) {
  try {
    const supabase = await createClient()

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (insertError) {
      console.error("Error inserting verification code:", insertError)
      return { success: false, error: "Failed to generate verification code" }
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0891b2; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
            .code-box { background: white; border: 2px solid #0891b2; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; }
            .code { font-size: 32px; font-weight: bold; color: #0891b2; letter-spacing: 5px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verification Code</h1>
            </div>
            <div class="content">
              <p>Thank you for using the Kuhlekt ROI Calculator!</p>
              <p>Your verification code is:</p>
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              <p>This code will expire in 15 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, "Your Kuhlekt Verification Code", emailHtml)

    return { success: true }
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send verification code",
    }
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .single()

    if (error || !data) {
      return { success: false, error: "Invalid verification code" }
    }

    if (new Date(data.expires_at) < new Date()) {
      return { success: false, error: "Verification code has expired" }
    }

    const { error: updateError } = await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    if (updateError) {
      return { success: false, error: "Failed to verify code" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return { success: false, error: "Failed to verify code" }
  }
}

export async function sendROIEmail(params: {
  name: string
  email: string
  company: string
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}) {
  try {
    const { name, email, company, calculatorType, results, inputs } = params

    const emailHtml =
      calculatorType === "simple"
        ? `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0891b2; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .metric { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .metric-label { font-weight: bold; color: #666; }
            .metric-value { font-size: 24px; color: #0891b2; font-weight: bold; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis Results</h1>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
              
              <div class="metric">
                <div class="metric-label">Estimated Annual Savings</div>
                <div class="metric-value">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Current Cash Tied Up</div>
                <div class="metric-value">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Cash Released</div>
                <div class="metric-value">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Current DSO → New DSO</div>
                <div class="metric-value">${inputs.currentDSO} → ${results.newDSO?.toFixed(0)} days</div>
              </div>
              
              <p>Ready to transform your accounts receivable process? Contact us today to learn more about Kuhlekt.</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
        : `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0891b2; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .metric { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .metric-label { font-weight: bold; color: #666; }
            .metric-value { font-size: 24px; color: #0891b2; font-weight: bold; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Detailed ROI Analysis</h1>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for using the Kuhlekt ROI Calculator. Here are your detailed results:</p>
              
              <div class="metric">
                <div class="metric-label">Total Annual Benefit</div>
                <div class="metric-value">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Return on Investment</div>
                <div class="metric-value">${results.roi?.toFixed(0)}%</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Payback Period</div>
                <div class="metric-value">${results.paybackMonths?.toFixed(1)} months</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">DSO Improvement</div>
                <div class="metric-value">${results.dsoReductionDays?.toFixed(0)} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Working Capital Released</div>
                <div class="metric-value">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Labour Cost Savings</div>
                <div class="metric-value">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Interest Savings</div>
                <div class="metric-value">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Bad Debt Reduction</div>
                <div class="metric-value">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              
              <p>Ready to transform your accounts receivable process? Contact us today to learn more about Kuhlekt.</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, "Your Kuhlekt ROI Calculator Results", emailHtml)

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}
