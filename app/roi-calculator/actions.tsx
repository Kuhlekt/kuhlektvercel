"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

// Generate a random 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store verification code in database
async function storeVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    // Delete any existing codes for this email
    await supabase.from("verification_codes").delete().eq("email", email)

    // Insert new code
    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (error) {
      console.error("[Verification] Error storing code:", error)
      return { success: false, error: "Failed to store verification code" }
    }

    return { success: true }
  } catch (error) {
    console.error("[Verification] Error in storeVerificationCode:", error)
    return { success: false, error: "Database error" }
  }
}

// Send verification code via email
export async function sendVerificationCode(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const code = generateVerificationCode()

    // Store code in database
    const storeResult = await storeVerificationCode(email, code)
    if (!storeResult.success) {
      return storeResult
    }

    // Send email
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2;">Kuhlekt ROI Calculator</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f0f9ff; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0891b2; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return { success: false, error: "Failed to send email" }
    }

    return { success: true }
  } catch (error) {
    console.error("[Verification] Error sending code:", error)
    return { success: false, error: "Failed to send verification code" }
  }
}

// Verify the code entered by the user
export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get the verification code
    const { data, error } = await supabase.from("verification_codes").select("*").eq("email", email).single()

    if (error || !data) {
      return { success: false, error: "Verification code not found" }
    }

    // Check if code has expired
    if (new Date(data.expires_at) < new Date()) {
      await supabase.from("verification_codes").delete().eq("email", email)
      return { success: false, error: "Verification code has expired" }
    }

    // Check attempts
    if (data.attempts >= 3) {
      await supabase.from("verification_codes").delete().eq("email", email)
      return { success: false, error: "Too many attempts. Please request a new code." }
    }

    // Verify the code
    if (data.code !== code) {
      // Increment attempts
      await supabase
        .from("verification_codes")
        .update({ attempts: data.attempts + 1 })
        .eq("email", email)

      return { success: false, error: "Invalid verification code" }
    }

    // Code is valid, delete it
    await supabase.from("verification_codes").delete().eq("email", email)

    return { success: true }
  } catch (error) {
    console.error("[Verification] Error verifying code:", error)
    return { success: false, error: "Failed to verify code" }
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
  const dsoImprovement = Number.parseFloat(data.simpleDSOImprovement) / 100
  const costOfCapital = Number.parseFloat(data.simpleCostOfCapital) / 100

  const annualRevenue = avgInvoiceValue * monthlyInvoices * 12
  const currentCashTied = (annualRevenue / 365) * currentDSO
  const dsoReduction = currentDSO * dsoImprovement
  const newDSO = currentDSO - dsoReduction
  const cashReleased = (annualRevenue / 365) * dsoReduction
  const annualSavings = cashReleased * costOfCapital

  return {
    currentDSO,
    newDSO,
    dsoReduction,
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
  averagePaymentTerms: "net30" | "net60" | "net90"
  numberOfDebtors: string
  numberOfCollectors: string
  projectedCustomerGrowth: string
}) {
  const implementationCost = Number.parseFloat(data.implementationCost)
  const monthlyCost = Number.parseFloat(data.monthlyCost)
  const annualCost = monthlyCost * 12
  const labourCosts = Number.parseFloat(data.perAnnumDirectLabourCosts)
  const interestRate = Number.parseFloat(data.interestRate) / 100
  const avgBadDebt = Number.parseFloat(data.averageBadDebt) / 100
  const currentBadDebts = Number.parseFloat(data.currentBadDebts)
  const labourSavings = Number.parseFloat(data.labourSavings) / 100
  const dsoImprovement = Number.parseFloat(data.dsoImprovement) / 100
  const currentDSO = Number.parseFloat(data.currentDSODays)
  const debtorsBalance = Number.parseFloat(data.debtorsBalance)

  // Calculate DSO reduction
  const dsoReductionDays = currentDSO * dsoImprovement
  const newDSO = currentDSO - dsoReductionDays

  // Calculate working capital released
  const annualRevenue = (debtorsBalance / currentDSO) * 365
  const workingCapitalReleased = (annualRevenue / 365) * dsoReductionDays

  // Calculate interest savings
  const interestSavings = workingCapitalReleased * interestRate

  // Calculate labour cost savings
  const labourCostSavings = labourCosts * labourSavings

  // Calculate bad debt reduction (30% improvement)
  const badDebtReduction = currentBadDebts * 0.3

  // Calculate total annual benefit
  const totalAnnualBenefit = interestSavings + labourCostSavings + badDebtReduction - annualCost

  // Calculate ROI
  const roi = ((totalAnnualBenefit - implementationCost) / implementationCost) * 100

  // Calculate payback period
  const paybackMonths = implementationCost / (totalAnnualBenefit / 12)

  return {
    implementationCost,
    annualCost,
    dsoReductionDays,
    newDSO,
    workingCapitalReleased,
    interestSavings,
    labourCostSavings,
    badDebtReduction,
    totalAnnualBenefit,
    roi,
    paybackMonths,
    annualRevenue,
  }
}

// Send ROI results via email
export async function sendROIEmail(params: {
  name: string
  email: string
  company: string
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}) {
  const { name, email, company, calculatorType, results, inputs } = params

  const subject = `Your Kuhlekt ROI Calculator Results - ${company}`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0891b2;">Kuhlekt ROI Calculator Results</h2>
      <p>Hi ${name},</p>
      <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
      
      ${
        calculatorType === "simple"
          ? `
        <h3>Simple ROI Analysis</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Current DSO:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${results.currentDSO} days</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>New DSO:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${results.newDSO?.toFixed(0)} days</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Cash Released:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Annual Savings:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #0891b2; font-weight: bold;">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          </tr>
        </table>
      `
          : `
        <h3>Detailed ROI Analysis</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Total Annual Benefit:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #0891b2; font-weight: bold;">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>ROI:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${results.roi?.toFixed(0)}%</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Payback Period:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${results.paybackMonths?.toFixed(1)} months</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Working Capital Released:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Interest Savings:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Labour Savings:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Bad Debt Reduction:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          </tr>
        </table>
      `
      }
      
      <p style="margin-top: 30px;">Ready to see these results in action? <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="color: #0891b2;">Schedule a demo</a> with our team.</p>
      
      <p style="color: #666; font-size: 12px; margin-top: 30px;">This calculation is based on the information you provided and industry benchmarks. Actual results may vary.</p>
    </div>
  `

  const textContent = `
Kuhlekt ROI Calculator Results

Hi ${name},

Thank you for using the Kuhlekt ROI Calculator. Here are your results:

${
  calculatorType === "simple"
    ? `Simple ROI Analysis
Current DSO: ${results.currentDSO} days
New DSO: ${results.newDSO?.toFixed(0)} days
Cash Released: $${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
Annual Savings: $${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : `Detailed ROI Analysis
Total Annual Benefit: $${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
ROI: ${results.roi?.toFixed(0)}%
Payback Period: ${results.paybackMonths?.toFixed(1)} months
Working Capital Released: $${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
Interest Savings: $${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
Labour Savings: $${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
Bad Debt Reduction: $${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

Ready to see these results in action? Schedule a demo with our team at ${process.env.NEXT_PUBLIC_SITE_URL}/demo

This calculation is based on the information you provided and industry benchmarks. Actual results may vary.
  `

  return await sendEmail({
    to: email,
    subject,
    text: textContent,
    html: htmlContent,
  })
}

// Export generateVerificationCode for the modal component
export { generateVerificationCode }
