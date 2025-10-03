"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIInputs {
  companyName: string
  email: string
  industry: string
  annualRevenue: number
  avgInvoiceValue: number
  monthlyInvoices: number
  currentDSO: number
  badDebtRate: number
  arStaffCount: number
  avgStaffSalary: number
}

interface ROIResults {
  currentCosts: {
    laborCosts: number
    badDebtLoss: number
    opportunityCost: number
    totalAnnual: number
  }
  withKuhlekt: {
    laborCosts: number
    badDebtLoss: number
    opportunityCost: number
    softwareCost: number
    totalAnnual: number
  }
  savings: {
    annual: number
    monthly: number
    percentage: number
  }
  paybackPeriod: number
  threeYearROI: number
}

function calculateROI(inputs: ROIInputs): ROIResults {
  const annualInvoices = inputs.monthlyInvoices * 12
  const annualRevenue = inputs.annualRevenue

  const currentLaborCosts = inputs.arStaffCount * inputs.avgStaffSalary
  const currentBadDebt = annualRevenue * (inputs.badDebtRate / 100)
  const dsoImpact = (inputs.currentDSO / 365) * annualRevenue * 0.05
  const currentTotal = currentLaborCosts + currentBadDebt + dsoImpact

  const improvedDSO = inputs.currentDSO * 0.6
  const reducedStaff = Math.max(1, Math.ceil(inputs.arStaffCount * 0.4))
  const newLaborCosts = reducedStaff * inputs.avgStaffSalary
  const newBadDebt = currentBadDebt * 0.5
  const newDsoImpact = (improvedDSO / 365) * annualRevenue * 0.05

  const softwareCost = Math.min(50000, Math.max(12000, annualInvoices * 2 + inputs.arStaffCount * 3000))

  const newTotal = newLaborCosts + newBadDebt + newDsoImpact + softwareCost

  const annualSavings = currentTotal - newTotal
  const monthlySavings = annualSavings / 12
  const savingsPercentage = (annualSavings / currentTotal) * 100
  const paybackMonths = softwareCost / monthlySavings
  const threeYearSavings = annualSavings * 3 - softwareCost * 3
  const threeYearROI = (threeYearSavings / (softwareCost * 3)) * 100

  return {
    currentCosts: {
      laborCosts: currentLaborCosts,
      badDebtLoss: currentBadDebt,
      opportunityCost: dsoImpact,
      totalAnnual: currentTotal,
    },
    withKuhlekt: {
      laborCosts: newLaborCosts,
      badDebtLoss: newBadDebt,
      opportunityCost: newDsoImpact,
      softwareCost: softwareCost,
      totalAnnual: newTotal,
    },
    savings: {
      annual: annualSavings,
      monthly: monthlySavings,
      percentage: savingsPercentage,
    },
    paybackPeriod: paybackMonths,
    threeYearROI: threeYearROI,
  }
}

export async function generateVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const { error: deleteError } = await supabase.from("verification_codes").delete().eq("email", email)

    if (deleteError) {
      console.error("Error deleting old codes:", deleteError)
    }

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (insertError) {
      console.error("Error inserting verification code:", insertError)
      return { success: false, message: "Failed to generate verification code" }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Report Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Verification Code</h2>
          <p>Your verification code is:</p>
          <h1 style="background: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px;">${code}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return { success: false, message: "Failed to send verification email" }
    }

    return { success: true, message: "Verification code sent successfully" }
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
    return { success: false, message: "An error occurred" }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single()

    if (error || !data) {
      const { error: updateError } = await supabase
        .from("verification_codes")
        .update({ attempts: supabase.rpc("increment_attempts") })
        .eq("email", email)

      return { success: false, message: "Invalid verification code" }
    }

    if (new Date(data.expires_at) < new Date()) {
      await supabase.from("verification_codes").delete().eq("email", email)
      return { success: false, message: "Verification code has expired" }
    }

    if (data.attempts >= 3) {
      await supabase.from("verification_codes").delete().eq("email", email)
      return { success: false, message: "Too many attempts. Please request a new code." }
    }

    await supabase.from("verification_codes").delete().eq("email", email)

    return { success: true, message: "Code verified successfully" }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return { success: false, message: "An error occurred during verification" }
  }
}

export async function sendROIReport(inputs: ROIInputs): Promise<{ success: boolean; message: string }> {
  try {
    const results = calculateROI(inputs)

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .section { margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 5px; }
          .metric { display: flex; justify-content: space-between; margin: 10px 0; }
          .label { font-weight: bold; }
          .value { color: #2563eb; }
          .savings { background: #dcfce7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Kuhlekt ROI Analysis</h1>
            <p>${inputs.companyName}</p>
          </div>
          
          <div class="section">
            <h2>Current Costs (Annual)</h2>
            <div class="metric">
              <span class="label">Labor Costs:</span>
              <span class="value">$${results.currentCosts.laborCosts.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="label">Bad Debt Loss:</span>
              <span class="value">$${results.currentCosts.badDebtLoss.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="label">Opportunity Cost:</span>
              <span class="value">$${results.currentCosts.opportunityCost.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="label">Total Annual:</span>
              <span class="value">$${results.currentCosts.totalAnnual.toLocaleString()}</span>
            </div>
          </div>

          <div class="section">
            <h2>With Kuhlekt (Annual)</h2>
            <div class="metric">
              <span class="label">Labor Costs:</span>
              <span class="value">$${results.withKuhlekt.laborCosts.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="label">Bad Debt Loss:</span>
              <span class="value">$${results.withKuhlekt.badDebtLoss.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="label">Opportunity Cost:</span>
              <span class="value">$${results.withKuhlekt.opportunityCost.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="label">Software Cost:</span>
              <span class="value">$${results.withKuhlekt.softwareCost.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="label">Total Annual:</span>
              <span class="value">$${results.withKuhlekt.totalAnnual.toLocaleString()}</span>
            </div>
          </div>

          <div class="savings">
            <h2>Your Potential Savings</h2>
            <div class="metric">
              <span class="label">Annual Savings:</span>
              <span class="value">$${results.savings.annual.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="label">Monthly Savings:</span>
              <span class="value">$${results.savings.monthly.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="label">Payback Period:</span>
              <span class="value">${results.paybackPeriod.toFixed(1)} months</span>
            </div>
            <div class="metric">
              <span class="label">3-Year ROI:</span>
              <span class="value">${results.threeYearROI.toFixed(0)}%</span>
            </div>
          </div>

          <p>Ready to start saving? <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo">Schedule a demo</a> to see Kuhlekt in action.</p>
        </div>
      </body>
      </html>
    `

    const emailText = `
Your Kuhlekt ROI Analysis for ${inputs.companyName}

Current Annual Costs:
- Labor: $${results.currentCosts.laborCosts.toLocaleString()}
- Bad Debt: $${results.currentCosts.badDebtLoss.toLocaleString()}
- Opportunity Cost: $${results.currentCosts.opportunityCost.toLocaleString()}
Total: $${results.currentCosts.totalAnnual.toLocaleString()}

With Kuhlekt:
- Labor: $${results.withKuhlekt.laborCosts.toLocaleString()}
- Bad Debt: $${results.withKuhlekt.badDebtLoss.toLocaleString()}
- Opportunity Cost: $${results.withKuhlekt.opportunityCost.toLocaleString()}
- Software: $${results.withKuhlekt.softwareCost.toLocaleString()}
Total: $${results.withKuhlekt.totalAnnual.toLocaleString()}

Your Potential Savings:
- Annual: $${results.savings.annual.toLocaleString()}
- Monthly: $${results.savings.monthly.toLocaleString()}
- Payback Period: ${results.paybackPeriod.toFixed(1)} months
- 3-Year ROI: ${results.threeYearROI.toFixed(0)}%

Ready to start saving? Schedule a demo at ${process.env.NEXT_PUBLIC_SITE_URL}/demo
    `

    const result = await sendEmail({
      to: inputs.email,
      subject: `Your Kuhlekt ROI Analysis - ${inputs.companyName}`,
      text: emailText,
      html: emailHtml,
    })

    return result
  } catch (error) {
    console.error("Error sending ROI report:", error)
    return {
      success: false,
      message: "Failed to send ROI report",
    }
  }
}
