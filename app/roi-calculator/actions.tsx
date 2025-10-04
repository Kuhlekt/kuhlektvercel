"use server"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

interface SimpleROIData {
  currentDSO: string
  averageInvoiceValue: string
  monthlyInvoices: string
  simpleDSOImprovement: string
  simpleCostOfCapital: string
}

interface DetailedROIData {
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
}

async function sendEmailViaClickSend(to: string, subject: string, body: string) {
  try {
    const clickSendAuth = Buffer.from(`${process.env.CLICKSEND_USERNAME}:${process.env.CLICKSEND_API_KEY}`).toString(
      "base64",
    )

    const response = await fetch("https://rest.clicksend.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${clickSendAuth}`,
      },
      body: JSON.stringify({
        to: [{ email: to, name: to }],
        from: {
          email_address_id: process.env.CLICKSEND_EMAIL_ADDRESS_ID,
          name: "Kuhlekt",
        },
        subject,
        body,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("ClickSend error:", result)
      return { success: false, error: result }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Error sending email via ClickSend:", error)
    return { success: false, error }
  }
}

export async function calculateSimpleROI(data: SimpleROIData) {
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
    dsoImprovement: dsoImprovement * 100,
  }
}

export async function calculateDetailedROI(data: DetailedROIData) {
  const implementationCost = Number.parseFloat(data.implementationCost)
  const monthlyCost = Number.parseFloat(data.monthlyCost)
  const annualCost = monthlyCost * 12
  const totalFirstYearCost = implementationCost + annualCost

  const perAnnumDirectLabourCosts = Number.parseFloat(data.perAnnumDirectLabourCosts)
  const labourSavings = Number.parseFloat(data.labourSavings) / 100
  const labourCostSavings = perAnnumDirectLabourCosts * labourSavings

  const currentDSODays = Number.parseFloat(data.currentDSODays)
  const dsoImprovement = Number.parseFloat(data.dsoImprovement) / 100
  const dsoReductionDays = currentDSODays * dsoImprovement
  const newDSODays = currentDSODays - dsoReductionDays

  const debtorsBalance = Number.parseFloat(data.debtorsBalance)
  const annualRevenue = (debtorsBalance / currentDSODays) * 365
  const workingCapitalReleased = (annualRevenue / 365) * dsoReductionDays

  const interestRate = Number.parseFloat(data.interestRate) / 100
  const interestSavings = workingCapitalReleased * interestRate

  const currentBadDebts = Number.parseFloat(data.currentBadDebts)
  const badDebtReduction = currentBadDebts * 0.5

  const totalAnnualBenefit = labourCostSavings + interestSavings + badDebtReduction

  const netAnnualBenefit = totalAnnualBenefit - annualCost
  const roi = (netAnnualBenefit / totalFirstYearCost) * 100
  const paybackMonths = totalFirstYearCost / (totalAnnualBenefit / 12)

  return {
    implementationCost,
    annualCost,
    totalFirstYearCost,
    labourCostSavings,
    dsoReductionDays,
    newDSODays,
    workingCapitalReleased,
    interestSavings,
    badDebtReduction,
    totalAnnualBenefit,
    netAnnualBenefit,
    roi,
    paybackMonths,
  }
}

export async function generateVerificationCode(email: string) {
  try {
    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store in Supabase
    const { error: insertError } = await supabase.from("verification_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      return { success: false, error: "Failed to generate code" }
    }

    // Send email via ClickSend
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Your verification code for Kuhlekt ROI Calculator is:</p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
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

    const emailResult = await sendEmailViaClickSend(email, "Your Kuhlekt Verification Code", emailBody)

    if (!emailResult.success) {
      console.error("Failed to send email, but code is stored. Code:", code)
      return {
        success: true,
        code,
        message: "Code generated but email failed to send. Check console for code.",
      }
    }

    return { success: true, message: `Verification code sent to ${email}` }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return { success: false, error: "Failed to generate code" }
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("code", code)
      .eq("used", false)
      .single()

    if (error || !data) {
      return { success: false, error: "Invalid verification code" }
    }

    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
      return { success: false, error: "Verification code has expired" }
    }

    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, error: "Failed to verify code" }
  }
}

export async function sendROIEmail(emailData: {
  name: string
  email: string
  company: string
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}) {
  try {
    const { name, email, company, calculatorType, results, inputs } = emailData

    let emailBody = ""

    if (calculatorType === "simple") {
      emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .result-box { background: white; padding: 20px; margin: 15px 0; border-left: 4px solid #667eea; border-radius: 4px; }
            .result-label { color: #666; font-size: 14px; }
            .result-value { font-size: 24px; font-weight: bold; color: #667eea; margin-top: 5px; }
            .highlight { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis Results</h1>
              <p>Simple ROI Calculator</p>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results for ${company}:</p>
              
              <div class="highlight">
                <h2 style="margin: 0;">Annual Savings</h2>
                <p style="font-size: 36px; font-weight: bold; margin: 10px 0;">$${results.annualSavings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>

              <div class="result-box">
                <div class="result-label">Current DSO</div>
                <div class="result-value">${results.currentDSO.toFixed(1)} days</div>
              </div>

              <div class="result-box">
                <div class="result-label">Improved DSO</div>
                <div class="result-value">${results.newDSO.toFixed(1)} days</div>
              </div>

              <div class="result-box">
                <div class="result-label">Cash Released</div>
                <div class="result-value">$${results.cashReleased.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>

              <p style="margin-top: 30px;">Ready to unlock these savings? Contact us to learn how Kuhlekt can transform your receivables management.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
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
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .result-box { background: white; padding: 20px; margin: 15px 0; border-left: 4px solid #667eea; border-radius: 4px; }
            .result-label { color: #666; font-size: 14px; }
            .result-value { font-size: 24px; font-weight: bold; color: #667eea; margin-top: 5px; }
            .highlight { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .two-column { display: flex; gap: 10px; }
            .column { flex: 1; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Comprehensive ROI Analysis</h1>
              <p>Detailed ROI Calculator</p>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>Thank you for using the Kuhlekt Detailed ROI Calculator. Here's your comprehensive analysis for ${company}:</p>
              
              <div class="highlight">
                <h2 style="margin: 0;">Net Annual Benefit</h2>
                <p style="font-size: 36px; font-weight: bold; margin: 10px 0;">$${results.netAnnualBenefit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>

              <div class="result-box">
                <div class="result-label">Return on Investment (ROI)</div>
                <div class="result-value">${results.roi.toFixed(1)}%</div>
              </div>

              <div class="result-box">
                <div class="result-label">Payback Period</div>
                <div class="result-value">${results.paybackMonths.toFixed(1)} months</div>
              </div>

              <div class="result-box">
                <div class="result-label">Labour Cost Savings</div>
                <div class="result-value">$${results.labourCostSavings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>

              <div class="result-box">
                <div class="result-label">Working Capital Released</div>
                <div class="result-value">$${results.workingCapitalReleased.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>

              <div class="result-box">
                <div class="result-label">Interest Savings</div>
                <div class="result-value">$${results.interestSavings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>

              <div class="result-box">
                <div class="result-label">Bad Debt Reduction</div>
                <div class="result-value">$${results.badDebtReduction.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>

              <div class="result-box">
                <div class="result-label">DSO Improvement</div>
                <div class="result-value">${results.dsoReductionDays.toFixed(1)} days reduction</div>
              </div>

              <p style="margin-top: 30px;">These results demonstrate the significant impact Kuhlekt can have on your business. Contact us today to start your journey to better receivables management.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const emailResult = await sendEmailViaClickSend(email, `Your Kuhlekt ROI Analysis Results - ${company}`, emailBody)

    if (!emailResult.success) {
      console.error("Failed to send ROI email:", emailResult.error)
      return { success: false, error: "Failed to send email" }
    }

    return { success: true, message: "ROI results sent successfully" }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return { success: false, error: "Failed to send email" }
  }
}
