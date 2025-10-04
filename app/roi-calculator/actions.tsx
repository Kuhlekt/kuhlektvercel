"use server"

import { createClient } from "@/lib/supabase/server"

// ClickSend email helper
async function sendClickSendEmail(to: string, subject: string, body: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "noreply@kuhlekt.com"

  if (!username || !apiKey) {
    throw new Error("ClickSend credentials not configured")
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
    body: body,
  }

  console.log("[ClickSend] Sending email with payload:", JSON.stringify(payload, null, 2))

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
    console.error("[ClickSend] Error response:", data)
    throw new Error(`ClickSend API error: ${data.response_msg || "Unknown error"} - ${JSON.stringify(data.data || {})}`)
  }

  console.log("[ClickSend] Success response:", data)
  return data
}

// Generate and send verification code
export async function generateVerificationCode(email: string) {
  try {
    console.log("[Verification] Generating code for:", email)

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    console.log("[Verification] Generated code:", code)

    // Store in database
    const supabase = await createClient()
    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (dbError) {
      console.error("[Verification] Database error:", dbError)
      throw new Error("Failed to store verification code")
    }

    console.log("[Verification] Code stored in database")

    // Send email with code
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
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            <p style="font-size: 12px; color: #6b7280;">
              This is an automated message from Kuhlekt. Please do not reply to this email.
            </p>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, "Your Kuhlekt ROI Calculator Verification Code", emailBody)

    console.log("[Verification] Email sent successfully")

    return { success: true }
  } catch (error) {
    console.error("[Verification] Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send verification code",
    }
  }
}

// Verify code
export async function verifyCode(email: string, code: string) {
  try {
    console.log("[Verify] Verifying code for:", email, "Code:", code)

    const supabase = await createClient()

    // Find the code
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      console.error("[Verify] Code not found or error:", error)
      return { success: false, error: "Invalid or expired verification code" }
    }

    console.log("[Verify] Code found:", data)

    // Mark as used
    const { error: updateError } = await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    if (updateError) {
      console.error("[Verify] Error marking code as used:", updateError)
      return { success: false, error: "Failed to verify code" }
    }

    console.log("[Verify] Code verified and marked as used")

    return { success: true }
  } catch (error) {
    console.error("[Verify] Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify code",
    }
  }
}

// Calculate Simple ROI
export async function calculateSimpleROI(data: {
  currentDSO: string
  averageInvoiceValue: string
  monthlyInvoices: string
  simpleDSOImprovement: string
  simpleCostOfCapital: string
}) {
  const currentDSO = Number.parseFloat(data.currentDSO)
  const avgInvoiceValue = Number.parseFloat(data.averageInvoiceValue)
  const monthlyInvoices = Number.parseFloat(data.monthlyInvoices)
  const dsoImprovementPercent = Number.parseFloat(data.simpleDSOImprovement)
  const costOfCapital = Number.parseFloat(data.simpleCostOfCapital) / 100

  // Calculate annual revenue
  const annualRevenue = avgInvoiceValue * monthlyInvoices * 12

  // Calculate current cash tied up
  const currentCashTied = (annualRevenue / 365) * currentDSO

  // Calculate DSO improvement in days
  const dsoImprovementDays = currentDSO * (dsoImprovementPercent / 100)
  const newDSO = currentDSO - dsoImprovementDays

  // Calculate cash released
  const cashReleased = (annualRevenue / 365) * dsoImprovementDays

  // Calculate annual savings from cash release
  const annualSavings = cashReleased * costOfCapital

  return {
    currentDSO,
    newDSO,
    dsoImprovementDays,
    currentCashTied,
    cashReleased,
    annualSavings,
    annualRevenue,
  }
}

// Calculate Detailed ROI
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
  averagePaymentTerms: string
  numberOfDebtors: string
  numberOfCollectors: string
  projectedCustomerGrowth: string
}) {
  const implementationCost = Number.parseFloat(data.implementationCost)
  const monthlyCost = Number.parseFloat(data.monthlyCost)
  const annualCost = monthlyCost * 12
  const labourCosts = Number.parseFloat(data.perAnnumDirectLabourCosts)
  const interestRate = Number.parseFloat(data.interestRate) / 100
  const badDebtPercent = Number.parseFloat(data.averageBadDebt) / 100
  const currentBadDebts = Number.parseFloat(data.currentBadDebts)
  const labourSavingsPercent = Number.parseFloat(data.labourSavings) / 100
  const dsoImprovementPercent = Number.parseFloat(data.dsoImprovement) / 100
  const currentDSODays = Number.parseFloat(data.currentDSODays)
  const debtorsBalance = Number.parseFloat(data.debtorsBalance)

  // Calculate DSO improvement
  const dsoReductionDays = currentDSODays * dsoImprovementPercent
  const newDSO = currentDSODays - dsoReductionDays

  // Calculate working capital released
  const dailyRevenue = debtorsBalance / currentDSODays
  const workingCapitalReleased = dailyRevenue * dsoReductionDays

  // Calculate interest savings
  const interestSavings = workingCapitalReleased * interestRate

  // Calculate labour savings
  const labourCostSavings = labourCosts * labourSavingsPercent

  // Calculate bad debt reduction (assume 30% reduction in bad debts)
  const badDebtReduction = currentBadDebts * 0.3

  // Calculate total annual benefit
  const totalAnnualBenefit = interestSavings + labourCostSavings + badDebtReduction

  // Calculate net annual benefit
  const netAnnualBenefit = totalAnnualBenefit - annualCost

  // Calculate ROI
  const totalFirstYearCost = implementationCost + annualCost
  const roi = (netAnnualBenefit / totalFirstYearCost) * 100

  // Calculate payback period
  const paybackMonths = totalFirstYearCost / (netAnnualBenefit / 12)

  return {
    currentDSO: currentDSODays,
    newDSO,
    dsoReductionDays,
    workingCapitalReleased,
    interestSavings,
    labourCostSavings,
    badDebtReduction,
    totalAnnualBenefit,
    netAnnualBenefit,
    annualCost,
    implementationCost,
    totalFirstYearCost,
    roi,
    paybackMonths,
  }
}

// Send ROI report email
export async function sendROIEmail(params: {
  name: string
  email: string
  company: string
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}) {
  try {
    console.log("[ROI Email] Sending report to:", params.email)

    const isSimple = params.calculatorType === "simple"

    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0891b2; margin-bottom: 10px;">Your ROI Analysis Results</h1>
              <p style="color: #6b7280;">Generated for ${params.company}</p>
            </div>

            <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; padding: 20px; margin-bottom: 30px;">
              <h2 style="margin-top: 0; color: #0891b2;">Hello ${params.name},</h2>
              <p>Thank you for using the Kuhlekt ROI Calculator. Below is your personalized ROI analysis.</p>
            </div>

            ${
              isSimple
                ? `
            <h3 style="color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">Simple ROI Results</h3>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">Estimated Annual Savings</div>
                <div style="font-size: 48px; font-weight: bold; color: #0891b2;">
                  $${params.results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tr>
                <td style="padding: 15px; border: 1px solid #e5e7eb; background-color: #f9fafb;">
                  <strong>Current DSO</strong>
                </td>
                <td style="padding: 15px; border: 1px solid #e5e7eb;">
                  ${params.inputs.currentDSO} days
                </td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 1px solid #e5e7eb; background-color: #f9fafb;">
                  <strong>New DSO</strong>
                </td>
                <td style="padding: 15px; border: 1px solid #e5e7eb; color: #059669;">
                  ${params.results.newDSO?.toFixed(0)} days
                </td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 1px solid #e5e7eb; background-color: #f9fafb;">
                  <strong>Cash Released</strong>
                </td>
                <td style="padding: 15px; border: 1px solid #e5e7eb; color: #059669;">
                  $${params.results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 1px solid #e5e7eb; background-color: #f9fafb;">
                  <strong>DSO Improvement</strong>
                </td>
                <td style="padding: 15px; border: 1px solid #e5e7eb; color: #059669;">
                  ${params.results.dsoImprovementDays?.toFixed(0)} days
                </td>
              </tr>
            </table>
            `
                : `
            <h3 style="color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">Detailed ROI Results</h3>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">Total Annual Benefit</div>
                <div style="font-size: 48px; font-weight: bold; color: #0891b2;">
                  $${params.results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div style="margin-top: 15px; font-size: 16px; color: #6b7280;">
                  ROI: <strong style="color: #0891b2;">${params.results.roi?.toFixed(0)}%</strong> | 
                  Payback: <strong style="color: #0891b2;">${params.results.paybackMonths?.toFixed(1)} months</strong>
                </div>
              </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tr>
                <td style="padding: 15px; border: 1px solid #e5e7eb; background-color: #f9fafb;">
                  <strong>Working Capital Released</strong>
                </td>
                <td style="padding: 15px; border: 1px solid #e5e7eb; color: #059669;">
                  $${params.results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 1px solid #e5e7eb; background-color: #f9fafb;">
                  <strong>Interest Savings</strong>
                </td>
                <td style="padding: 15px; border: 1px solid #e5e7eb; color: #059669;">
                  $${params.results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 1px solid #e5e7eb; background-color: #f9fafb;">
                  <strong>Labour Savings</strong>
                </td>
                <td style="padding: 15px; border: 1px solid #e5e7eb; color: #059669;">
                  $${params.results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 1px solid #e5e7eb; background-color: #f9fafb;">
                  <strong>Bad Debt Reduction</strong>
                </td>
                <td style="padding: 15px; border: 1px solid #e5e7eb; color: #059669;">
                  $${params.results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 1px solid #e5e7eb; background-color: #f9fafb;">
                  <strong>DSO Reduction</strong>
                </td>
                <td style="padding: 15px; border: 1px solid #e5e7eb; color: #059669;">
                  ${params.results.dsoReductionDays?.toFixed(0)} days
                </td>
              </tr>
            </table>
            `
            }

            <div style="background-color: #f0f9ff; border: 1px solid #0891b2; border-radius: 8px; padding: 20px; margin-top: 30px;">
              <h3 style="margin-top: 0; color: #0891b2;">Next Steps</h3>
              <p>Ready to turn these projections into reality? Our team is here to help you:</p>
              <ul style="color: #4b5563;">
                <li>Review your specific requirements</li>
                <li>Customize a solution for your business</li>
                <li>Schedule a personalized demo</li>
              </ul>
              <p>
                <a href="https://kuhlekt.com/demo" style="display: inline-block; background-color: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
                  Schedule a Demo
                </a>
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0;" />
            
            <div style="text-align: center; color: #6b7280; font-size: 12px;">
              <p>Kuhlekt - Intelligent Receivables Management</p>
              <p>This analysis is based on the information you provided and represents estimated results.</p>
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(
      params.email,
      `Your Kuhlekt ROI Analysis - ${params.calculatorType === "simple" ? "Simple" : "Detailed"} Calculator`,
      emailBody,
    )

    console.log("[ROI Email] Report sent successfully")

    return { success: true }
  } catch (error) {
    console.error("[ROI Email] Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send ROI report",
    }
  }
}
