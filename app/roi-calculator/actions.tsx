"use server"

import { sendEmail } from "@/lib/aws-ses"

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

// Global in-memory storage for verification codes
const verificationCodes = new Map<string, { code: string; timestamp: number; attempts: number }>()

// Debug function to check codes
export async function debugGetCodes(): Promise<any> {
  return {
    totalCodes: verificationCodes.size,
    codes: Array.from(verificationCodes.entries()).map(([email, data]) => ({
      email,
      code: data.code,
      timestamp: new Date(data.timestamp).toISOString(),
      attempts: data.attempts,
      age: Date.now() - data.timestamp,
    })),
  }
}

function cleanupOldCodes() {
  const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000
  let cleaned = 0
  for (const [email, data] of verificationCodes.entries()) {
    if (data.timestamp < fifteenMinutesAgo) {
      verificationCodes.delete(email)
      cleaned++
      console.log(`[Verification] Cleaned up expired code for ${email}`)
    }
  }
  if (cleaned > 0) {
    console.log(`[Verification] Cleaned ${cleaned} expired codes`)
  }
}

export async function generateVerificationCode(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`[Verification] === GENERATE CODE START ===`)
    console.log(`[Verification] Email received: "${email}"`)

    cleanupOldCodes()

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const normalizedEmail = email.toLowerCase().trim()

    console.log(`[Verification] Generated code: ${code}`)
    console.log(`[Verification] Normalized email: "${normalizedEmail}"`)

    verificationCodes.set(normalizedEmail, {
      code,
      timestamp: Date.now(),
      attempts: 0,
    })

    console.log(`[Verification] Code stored in Map`)
    console.log(`[Verification] Map size: ${verificationCodes.size}`)
    console.log(`[Verification] Map keys:`, Array.from(verificationCodes.keys()))

    // Verify it was stored
    const storedData = verificationCodes.get(normalizedEmail)
    console.log(`[Verification] Verification of storage:`, storedData ? "SUCCESS" : "FAILED")
    if (storedData) {
      console.log(`[Verification] Stored code matches: ${storedData.code === code}`)
    }

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
            .footer {
              background: #f9fafb;
              padding: 25px 30px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Verification Code</h1>
            </div>
            <div class="content">
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              <p style="text-align: center; color: #6b7280;">This code expires in 15 minutes</p>
            </div>
            <div class="footer">
              <p><strong>Kuhlekt</strong> - ROI Calculator</p>
            </div>
          </div>
        </body>
      </html>
    `

    console.log(`[Verification] Sending email to: ${email}`)
    const result = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      html: emailHtml,
      text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.`,
    })

    console.log(`[Verification] Email send result:`, result)
    console.log(`[Verification] === GENERATE CODE END ===`)

    if (!result.success) {
      console.error("[Verification] Failed to send email:", result.message)
      return {
        success: false,
        error: "Failed to send verification code. Please try again.",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("[Verification] EXCEPTION in generateVerificationCode:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred.",
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`[Verification] === VERIFY CODE START ===`)
    console.log(`[Verification] Email received: "${email}"`)
    console.log(`[Verification] Code received: "${code}"`)

    cleanupOldCodes()

    const normalizedEmail = email.toLowerCase().trim()
    const normalizedCode = code.trim()

    console.log(`[Verification] Normalized email: "${normalizedEmail}"`)
    console.log(`[Verification] Normalized code: "${normalizedCode}"`)
    console.log(`[Verification] Map size: ${verificationCodes.size}`)
    console.log(`[Verification] Map keys:`, Array.from(verificationCodes.keys()))

    const storedData = verificationCodes.get(normalizedEmail)

    console.log(`[Verification] Stored data found: ${!!storedData}`)

    if (!storedData) {
      console.error(`[Verification] NO DATA FOUND for email: "${normalizedEmail}"`)
      console.log(`[Verification] Available emails:`, Array.from(verificationCodes.keys()))
      return {
        success: false,
        error: "Verification code not found or expired. Please request a new code.",
      }
    }

    console.log(`[Verification] Stored code: "${storedData.code}"`)
    console.log(`[Verification] Code age (ms): ${Date.now() - storedData.timestamp}`)
    console.log(`[Verification] Attempts: ${storedData.attempts}`)

    // Check expiration
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000
    if (storedData.timestamp < fifteenMinutesAgo) {
      verificationCodes.delete(normalizedEmail)
      console.error(`[Verification] CODE EXPIRED`)
      return {
        success: false,
        error: "Verification code has expired. Please request a new code.",
      }
    }

    // Check attempts
    if (storedData.attempts >= 5) {
      verificationCodes.delete(normalizedEmail)
      console.error(`[Verification] TOO MANY ATTEMPTS`)
      return {
        success: false,
        error: "Too many failed attempts. Please request a new code.",
      }
    }

    // Verify the code
    console.log(`[Verification] Comparing codes:`)
    console.log(`[Verification]   Stored: "${storedData.code}" (type: ${typeof storedData.code})`)
    console.log(`[Verification]   Input:  "${normalizedCode}" (type: ${typeof normalizedCode})`)
    console.log(`[Verification]   Match: ${storedData.code === normalizedCode}`)

    if (storedData.code !== normalizedCode) {
      storedData.attempts++
      const remainingAttempts = 5 - storedData.attempts
      console.error(`[Verification] CODE MISMATCH - Attempts now: ${storedData.attempts}`)
      return {
        success: false,
        error: `Invalid verification code. ${remainingAttempts} ${remainingAttempts === 1 ? "attempt" : "attempts"} remaining.`,
      }
    }

    // Success - remove the code
    verificationCodes.delete(normalizedEmail)
    console.log(`[Verification] CODE VERIFIED SUCCESSFULLY`)
    console.log(`[Verification] Code removed from Map`)
    console.log(`[Verification] === VERIFY CODE END ===`)

    return { success: true }
  } catch (error) {
    console.error("[Verification] EXCEPTION in verifyCode:", error)
    return {
      success: false,
      error: "Failed to verify code. Please try again.",
    }
  }
}

export async function calculateSimpleROI(inputs: SimpleROIInputs): Promise<SimpleROIResults> {
  console.log("[ROI] Calculating simple ROI")

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
  console.log("[ROI] Calculating detailed ROI")

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
    console.log("[ROI] Sending ROI email")

    const emailSubject = `Your ROI Analysis Results - ${data.company}`

    let emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif;
              line-height: 1.6; 
              color: #1f2937;
            }
            .container { 
              max-width: 700px; 
              margin: 40px auto; 
              background: white;
              border-radius: 12px;
              overflow: hidden;
            }
            .header { 
              background: #0891b2; 
              color: white; 
              padding: 40px 30px; 
              text-align: center;
            }
            .content { 
              padding: 40px 30px;
            }
            .highlight { 
              background: #ecfeff; 
              padding: 30px; 
              border-radius: 12px; 
              margin: 30px 0; 
              text-align: center;
              border: 2px solid #0891b2;
            }
            .highlight-value { 
              font-size: 48px; 
              font-weight: bold; 
              color: #0891b2;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis</h1>
            </div>
            <div class="content">
    `

    if (data.calculatorType === "simple") {
      emailHtml += `
              <div class="highlight">
                <div>Annual Savings Potential</div>
                <div class="highlight-value">$${data.results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
      `
    } else {
      emailHtml += `
              <div class="highlight">
                <div>Total Annual Benefit</div>
                <div class="highlight-value">$${data.results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
      `
    }

    emailHtml += `
            </div>
          </div>
        </body>
      </html>
    `

    const userResult = await sendEmail({
      to: data.email,
      subject: emailSubject,
      html: emailHtml,
      text: `Your ROI Calculator Results from Kuhlekt - ${data.company}`,
    })

    if (!userResult.success) {
      console.error("[ROI] Failed to send email:", userResult.message)
      return {
        success: false,
        error: userResult.message || "Failed to send email",
      }
    }

    // Send notification
    await sendEmail({
      to: "enquiries@kuhlekt.com",
      subject: `New ROI Calculator Lead: ${data.company}`,
      html: `<p>New submission from ${data.name} at ${data.company}</p>${emailHtml}`,
      text: `New ROI Calculator submission from ${data.name} at ${data.company}`,
    })

    return { success: true }
  } catch (error) {
    console.error("[ROI] Error in sendROIEmail:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}
