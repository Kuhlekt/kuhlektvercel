"use server"

import { createClient } from "@/lib/supabase/server"

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

export async function calculateSimpleROI(data: SimpleROIData) {
  const currentDSO = Number.parseFloat(data.currentDSO)
  const averageInvoiceValue = Number.parseFloat(data.averageInvoiceValue)
  const monthlyInvoices = Number.parseFloat(data.monthlyInvoices)
  const dsoImprovement = Number.parseFloat(data.simpleDSOImprovement) / 100
  const costOfCapital = Number.parseFloat(data.simpleCostOfCapital) / 100

  // Validate inputs
  if (isNaN(currentDSO) || currentDSO <= 0) {
    throw new Error("Current DSO must be a positive number")
  }
  if (isNaN(averageInvoiceValue) || averageInvoiceValue <= 0) {
    throw new Error("Average invoice value must be a positive number")
  }
  if (isNaN(monthlyInvoices) || monthlyInvoices <= 0) {
    throw new Error("Monthly invoices must be a positive number")
  }
  if (isNaN(dsoImprovement) || dsoImprovement < 0 || dsoImprovement > 1) {
    throw new Error("DSO improvement must be between 0 and 100%")
  }
  if (isNaN(costOfCapital) || costOfCapital < 0) {
    throw new Error("Cost of capital must be a positive number")
  }

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
    costOfCapital: costOfCapital * 100,
  }
}

export async function calculateDetailedROI(data: DetailedROIData) {
  const implementationCost = Number.parseFloat(data.implementationCost)
  const monthlyCost = Number.parseFloat(data.monthlyCost)
  const labourCosts = Number.parseFloat(data.perAnnumDirectLabourCosts)
  const labourSavingsPercent = Number.parseFloat(data.labourSavings) / 100
  const interestRate = Number.parseFloat(data.interestRate) / 100
  const currentDSO = Number.parseFloat(data.currentDSODays)
  const dsoImprovementPercent = Number.parseFloat(data.dsoImprovement) / 100
  const debtorsBalance = Number.parseFloat(data.debtorsBalance)
  const currentBadDebts = Number.parseFloat(data.currentBadDebts)

  // Validate inputs
  if (isNaN(implementationCost) || implementationCost < 0) {
    throw new Error("Implementation cost must be a positive number")
  }
  if (isNaN(monthlyCost) || monthlyCost < 0) {
    throw new Error("Monthly cost must be a positive number")
  }
  if (isNaN(labourCosts) || labourCosts < 0) {
    throw new Error("Labour costs must be a positive number")
  }
  if (isNaN(currentDSO) || currentDSO <= 0) {
    throw new Error("Current DSO must be a positive number")
  }
  if (isNaN(debtorsBalance) || debtorsBalance < 0) {
    throw new Error("Debtors balance must be a positive number")
  }
  if (isNaN(dsoImprovementPercent) || dsoImprovementPercent < 0 || dsoImprovementPercent > 1) {
    throw new Error("DSO improvement must be between 0 and 100%")
  }

  const annualCost = monthlyCost * 12
  const totalFirstYearCost = implementationCost + annualCost

  const labourCostSavings = labourCosts * labourSavingsPercent

  const dsoReductionDays = currentDSO * dsoImprovementPercent
  const newDSO = currentDSO - dsoReductionDays
  const workingCapitalReleased = (debtorsBalance / currentDSO) * dsoReductionDays
  const interestSavings = workingCapitalReleased * interestRate

  const badDebtReduction = currentBadDebts * 0.5

  const totalAnnualBenefit = labourCostSavings + interestSavings + badDebtReduction
  const netBenefit = totalAnnualBenefit - totalFirstYearCost
  const roi = (netBenefit / totalFirstYearCost) * 100
  const paybackMonths = totalFirstYearCost / (totalAnnualBenefit / 12)

  return {
    implementationCost,
    annualCost,
    totalFirstYearCost,
    totalFirstYearInvestment: totalFirstYearCost,
    labourCostSavings,
    interestSavings,
    badDebtReduction,
    workingCapitalReleased,
    dsoReductionDays,
    currentDSO,
    newDSO,
    totalAnnualBenefit,
    netBenefit,
    roi,
    paybackMonths,
  }
}

async function sendClickSendEmail(to: string, subject: string, body: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL

  if (!username || !apiKey || !fromEmail) {
    throw new Error("ClickSend credentials not configured")
  }

  const auth = Buffer.from(`${username}:${apiKey}`).toString("base64")

  // First, fetch verified email addresses to get the email_address_id
  const addressesResponse = await fetch("https://rest.clicksend.com/v3/email/addresses", {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  })

  if (!addressesResponse.ok) {
    const errorText = await addressesResponse.text()
    console.error("[ClickSend] Failed to fetch email addresses:", errorText)
    throw new Error(`Failed to fetch email addresses: ${addressesResponse.status}`)
  }

  const addressesData = await addressesResponse.json()
  console.log("[ClickSend] Email addresses response:", JSON.stringify(addressesData, null, 2))

  // Find the email address that matches our from email
  const emailAddress = addressesData.data?.data?.find(
    (addr: any) => addr.email_address === fromEmail && addr.verified === 1,
  )

  if (!emailAddress) {
    throw new Error(`Email address ${fromEmail} not found or not verified in ClickSend`)
  }

  const emailAddressId = emailAddress.email_address_id

  console.log("[ClickSend] Using email_address_id:", emailAddressId)

  const payload = {
    to: [{ email: to, name: to.split("@")[0] }],
    from: {
      email_address_id: emailAddressId,
      name: "Kuhlekt",
    },
    subject,
    body,
  }

  console.log("[ClickSend] Sending email with payload:", JSON.stringify(payload, null, 2))

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error("[ClickSend] Error response:", errorBody)
    throw new Error(`Failed to send email: ${response.status} - ${errorBody}`)
  }

  const result = await response.json()
  console.log("[ClickSend] Email sent successfully:", result)
  return result
}

export async function generateVerificationCode(email: string) {
  try {
    console.log("[generateVerificationCode] Starting for email:", email)

    const supabase = await createClient()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    console.log("[generateVerificationCode] Generated code:", code)
    console.log("[generateVerificationCode] Expires at:", expiresAt)

    const { data, error } = await supabase
      .from("verification_codes")
      .insert({
        email,
        code,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[generateVerificationCode] Database error:", error)
      return { success: false, error: "Failed to generate verification code" }
    }

    console.log("[generateVerificationCode] Code saved to database:", data)

    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0891b2;">Your Verification Code</h2>
            <p>Thank you for using the Kuhlekt ROI Calculator.</p>
            <p>Your verification code is:</p>
            <div style="background-color: #f0f9ff; border: 2px solid #0891b2; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="font-size: 36px; letter-spacing: 8px; margin: 0; color: #0891b2;">${code}</h1>
            </div>
            <p>This code will expire in 15 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #6b7280;">
              © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `

    console.log("[generateVerificationCode] Sending email to:", email)
    await sendClickSendEmail(email, "Your Kuhlekt ROI Calculator Verification Code", emailBody)
    console.log("[generateVerificationCode] Email sent successfully")

    return { success: true }
  } catch (error) {
    console.error("[generateVerificationCode] Error:", error)
    return { success: false, error: "Failed to send verification code" }
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    console.log("[verifyCode] Verifying code for email:", email)
    console.log("[verifyCode] Code to verify:", code)

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      console.error("[verifyCode] No valid code found:", error)
      return { success: false, error: "Invalid or expired verification code" }
    }

    console.log("[verifyCode] Valid code found:", data)

    const { error: deleteError } = await supabase.from("verification_codes").delete().eq("id", data.id)

    if (deleteError) {
      console.error("[verifyCode] Error deleting code:", deleteError)
      return { success: false, error: "Failed to verify code" }
    }

    console.log("[verifyCode] Code deleted successfully")
    return { success: true }
  } catch (error) {
    console.error("[verifyCode] Error:", error)
    return { success: false, error: "Failed to verify code" }
  }
}

export async function sendROIEmail({
  name,
  email,
  company,
  calculatorType,
  results,
  inputs,
}: {
  name: string
  email: string
  company: string
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}) {
  try {
    console.log("[sendROIEmail] Sending ROI report to:", email)
    console.log("[sendROIEmail] Calculator type:", calculatorType)
    console.log("[sendROIEmail] Results:", JSON.stringify(results, null, 2))

    let emailBody = ""

    if (calculatorType === "simple") {
      emailBody = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #0891b2;">Your ROI Analysis Results</h2>
              <p>Dear ${name},</p>
              <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
              
              <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #0891b2;">Estimated Annual Savings</h3>
                <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #0891b2;">
                  $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <h3>Key Metrics:</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Current DSO</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${results.currentDSO?.toFixed(0)} days</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">New DSO</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #0891b2;">${results.newDSO?.toFixed(0)} days</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Current Cash Tied Up</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">$${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Cash Released</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
              </table>

              <p>Company: ${company}</p>
              
              <p style="margin-top: 30px;">
                Ready to see these results in your business? 
                <a href="https://roi.kuhlekt-info.com/demo" style="color: #0891b2; text-decoration: none; font-weight: bold;">Schedule a demo</a>
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="font-size: 12px; color: #6b7280;">
                © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `
    } else {
      emailBody = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #0891b2;">Your Comprehensive ROI Analysis</h2>
              <p>Dear ${name},</p>
              <p>Thank you for using the Kuhlekt ROI Calculator. Here are your detailed results:</p>
              
              <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #0891b2;">Total Annual Benefit</h3>
                <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #0891b2;">
                  $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p style="margin: 0;">
                  <strong>ROI:</strong> ${results.roi?.toFixed(0)}% | 
                  <strong>Payback:</strong> ${results.paybackMonths?.toFixed(1)} months
                </p>
              </div>

              <h3>Key Benefits:</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">DSO Improvement</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${results.dsoReductionDays?.toFixed(0)} days</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Working Capital Released</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Interest Savings</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Labour Cost Savings</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Bad Debt Reduction</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
              </table>

              <h3>Investment:</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Implementation Cost</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">$${results.implementationCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Annual Cost</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">$${results.annualCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">Total First Year Cost</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">$${results.totalFirstYearCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
              </table>

              <p>Company: ${company}</p>
              
              <p style="margin-top: 30px;">
                Ready to see these results in your business? 
                <a href="https://roi.kuhlekt-info.com/demo" style="color: #0891b2; text-decoration: none; font-weight: bold;">Schedule a demo</a>
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="font-size: 12px; color: #6b7280;">
                © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `
    }

    await sendClickSendEmail(email, "Your Kuhlekt ROI Analysis Results", emailBody)
    console.log("[sendROIEmail] Email sent successfully")

    return { success: true }
  } catch (error) {
    console.error("[sendROIEmail] Error sending ROI email:", error)
    throw error
  }
}
