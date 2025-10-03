"use server"

import { sendEmail } from "@/lib/aws-ses"
import { createClient } from "@/lib/supabase/server"

interface SimpleROIInputs {
  currentDSO: string
  averageInvoiceValue: string
  monthlyInvoices: string
  simpleDSOImprovement: string
  simpleCostOfCapital: string
}

interface DetailedROIInputs {
  implementationCost: string
  monthlyCost: string
  currentDSODays: string
  debtorsBalance: string
  interestType: "loan" | "deposit"
  interestRate: string
  perAnnumDirectLabourCosts: string
  currentBadDebts: string
  averageBadDebt: string
  dsoImprovement: string
  labourSavings: string
  numberOfDebtors: string
  numberOfCollectors: string
  projectedCustomerGrowth: string
  averagePaymentTerms: "net30" | "net60" | "net90"
}

interface SimpleROIResults {
  currentCashTied: number
  newDSO: number
  cashReleased: number
  annualSavings: number
  dsoImprovementPercent: number
}

interface DetailedROIResults {
  currentDSO: number
  newDSO: number
  dsoReductionDays: number
  workingCapitalReleased: number
  labourCostSavings: number
  badDebtReduction: number
  interestSavings: number
  totalAnnualBenefit: number
  totalImplementationAndAnnualCost: number
  roi: number
  paybackMonths: number
}

// Clean up expired codes
async function cleanupExpiredCodes() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("verification_codes").delete().lt("expires_at", new Date().toISOString())

    if (error) {
      console.error("[Verification] Error cleaning up expired codes:", error)
    }
  } catch (error) {
    console.error("[Verification] Exception cleaning up codes:", error)
  }
}

export async function generateVerificationCode(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`[Verification] Generating code for: ${email}`)

    const supabase = await createClient()

    // Clean up expired codes
    await cleanupExpiredCodes()

    const normalizedEmail = email.toLowerCase().trim()

    // Delete any existing codes for this email
    const { error: deleteError } = await supabase.from("verification_codes").delete().eq("email", normalizedEmail)

    if (deleteError) {
      console.error("[Verification] Error deleting old codes:", deleteError)
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000) // 15 minutes from now

    console.log(`[Verification] Generated code: ${code}`)

    // Store in database
    const { error } = await supabase.from("verification_codes").insert({
      email: normalizedEmail,
      code: code,
      attempts: 0,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    })

    if (error) {
      console.error("[Verification] Database insert error:", error)
      return {
        success: false,
        error: `Failed to store verification code: ${error.message}`,
      }
    }

    // Send the code via email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6; 
              color: #1f2937;
              margin: 0;
              padding: 0;
              background-color: #f3f4f6;
            }
            .container { 
              max-width: 600px; 
              margin: 40px auto; 
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content { 
              padding: 40px 30px;
            }
            .code-box { 
              background: #f0f9ff;
              border: 3px dashed #0891b2; 
              padding: 30px; 
              text-align: center; 
              margin: 30px 0; 
              border-radius: 12px;
            }
            .code { 
              font-size: 42px; 
              font-weight: bold; 
              color: #0891b2; 
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Verification Code</h1>
              <p>Kuhlekt ROI Calculator</p>
            </div>
            <div class="content">
              <p>Your verification code is:</p>
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              <p>This code expires in 15 minutes.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      html: emailHtml,
      text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.`,
    })

    if (!result.success) {
      console.error("[Verification] Failed to send email:", result.error)
      return {
        success: false,
        error: "Failed to send verification code email. Please try again.",
      }
    }

    console.log("[Verification] Verification email sent successfully")
    return { success: true }
  } catch (error) {
    console.error("[Verification] Exception:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred.",
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    await cleanupExpiredCodes()

    const normalizedEmail = email.toLowerCase().trim()
    const normalizedCode = code.trim()

    const { data: storedData, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle()

    if (fetchError || !storedData) {
      return {
        success: false,
        error: "Verification code not found or expired.",
      }
    }

    const expiresAt = new Date(storedData.expires_at)
    if (expiresAt < new Date()) {
      await supabase.from("verification_codes").delete().eq("email", normalizedEmail)
      return {
        success: false,
        error: "Verification code has expired.",
      }
    }

    if (storedData.attempts >= 5) {
      await supabase.from("verification_codes").delete().eq("email", normalizedEmail)
      return {
        success: false,
        error: "Too many failed attempts.",
      }
    }

    if (storedData.code !== normalizedCode) {
      const newAttempts = storedData.attempts + 1
      await supabase.from("verification_codes").update({ attempts: newAttempts }).eq("email", normalizedEmail)
      return {
        success: false,
        error: `Invalid code. ${5 - newAttempts} attempts remaining.`,
      }
    }

    await supabase.from("verification_codes").delete().eq("email", normalizedEmail)
    return { success: true }
  } catch (error) {
    console.error("[Verification] Exception:", error)
    return {
      success: false,
      error: "Failed to verify code.",
    }
  }
}

export async function calculateSimpleROI(inputs: SimpleROIInputs): Promise<SimpleROIResults> {
  const currentDSO = Number.parseFloat(inputs.currentDSO)
  const avgInvoiceValue = Number.parseFloat(inputs.averageInvoiceValue)
  const monthlyInvoices = Number.parseFloat(inputs.monthlyInvoices)
  const dsoImprovementPercent = Number.parseFloat(inputs.simpleDSOImprovement) / 100
  const costOfCapitalPercent = Number.parseFloat(inputs.simpleCostOfCapital) / 100

  const currentCashTied = (currentDSO / 30) * avgInvoiceValue * monthlyInvoices
  const newDSO = currentDSO * (1 - dsoImprovementPercent)
  const newCashTied = (newDSO / 30) * avgInvoiceValue * monthlyInvoices
  const cashReleased = currentCashTied - newCashTied
  const annualSavings = cashReleased * costOfCapitalPercent

  return {
    currentCashTied,
    newDSO,
    cashReleased,
    annualSavings,
    dsoImprovementPercent: Number.parseFloat(inputs.simpleDSOImprovement),
  }
}

export async function calculateDetailedROI(inputs: DetailedROIInputs): Promise<DetailedROIResults> {
  const implementationCost = Number.parseFloat(inputs.implementationCost)
  const monthlyCost = Number.parseFloat(inputs.monthlyCost)
  const annualCost = monthlyCost * 12
  const perAnnumDirectLabourCosts = Number.parseFloat(inputs.perAnnumDirectLabourCosts)
  const interestRate = Number.parseFloat(inputs.interestRate) / 100
  const currentBadDebts = Number.parseFloat(inputs.currentBadDebts)
  const labourSavingsPercent = Number.parseFloat(inputs.labourSavings) / 100
  const dsoImprovementPercent = Number.parseFloat(inputs.dsoImprovement) / 100
  const daysSales = 365
  const currentDSO = Number.parseFloat(inputs.currentDSODays)
  const debtorsBalance = Number.parseFloat(inputs.debtorsBalance)

  const annualRevenue = (debtorsBalance / currentDSO) * daysSales
  const dsoReductionDays = currentDSO * dsoImprovementPercent
  const newDSO = currentDSO - dsoReductionDays
  const dailyRevenue = annualRevenue / daysSales
  const workingCapitalReleased = dailyRevenue * dsoReductionDays
  const interestSavings = workingCapitalReleased * interestRate
  const labourCostSavings = perAnnumDirectLabourCosts * labourSavingsPercent
  const badDebtReduction = currentBadDebts * 0.4
  const totalAnnualBenefit = interestSavings + labourCostSavings + badDebtReduction
  const totalImplementationAndAnnualCost = implementationCost + annualCost
  const netBenefit = totalAnnualBenefit - annualCost
  const roi = totalImplementationAndAnnualCost > 0 ? (netBenefit / totalImplementationAndAnnualCost) * 100 : 0
  const paybackMonths = totalAnnualBenefit > 0 ? (totalImplementationAndAnnualCost / totalAnnualBenefit) * 12 : 0

  return {
    currentDSO,
    newDSO,
    dsoReductionDays,
    workingCapitalReleased,
    labourCostSavings,
    badDebtReduction,
    interestSavings,
    totalAnnualBenefit,
    totalImplementationAndAnnualCost,
    roi,
    paybackMonths,
  }
}

export async function sendROIEmail(data: {
  name: string
  email: string
  company: string
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}): Promise<{ success: boolean; error?: string }> {
  try {
    const emailSubject = `Your ROI Analysis Results - ${data.company}`
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Your ROI Analysis</h1>
          <p>Company: ${data.company}</p>
          <p>Name: ${data.name}</p>
        </body>
      </html>
    `

    const result = await sendEmail({
      to: data.email,
      subject: emailSubject,
      html: emailHtml,
      text: `Your ROI Analysis Results`,
    })

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to send email",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("[ROI] Error:", error)
    return {
      success: false,
      error: "Failed to send email",
    }
  }
}
