"use server"

import { createClient } from "@/lib/supabase/server"

// ROI Calculation Functions
export async function calculateSimpleROI(data: {
  annualRevenue: number
  averageInvoiceValue: number
  currentDSO: number
  industryBenchmarkDSO: number
}) {
  const { annualRevenue, averageInvoiceValue, currentDSO, industryBenchmarkDSO } = data

  // Calculate potential DSO improvement
  const dsoImprovement = currentDSO - industryBenchmarkDSO
  const dsoImprovementPercentage = (dsoImprovement / currentDSO) * 100

  // Calculate cash flow improvement
  const dailyRevenue = annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoImprovement

  // Calculate ROI (assuming 5% investment of annual revenue)
  const estimatedInvestment = annualRevenue * 0.05
  const roi = ((cashFlowImprovement - estimatedInvestment) / estimatedInvestment) * 100

  // Calculate payback period in months
  const monthlyBenefit = cashFlowImprovement / 12
  const paybackPeriod = estimatedInvestment / monthlyBenefit

  return {
    dsoImprovement,
    dsoImprovementPercentage,
    cashFlowImprovement,
    estimatedInvestment,
    roi,
    paybackPeriod,
    annualSavings: cashFlowImprovement,
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  numberOfInvoices: number
  averageInvoiceValue: number
  currentDSO: number
  targetDSO: number
  collectionCosts: number
  writeOffPercentage: number
}) {
  const {
    annualRevenue,
    numberOfInvoices,
    averageInvoiceValue,
    currentDSO,
    targetDSO,
    collectionCosts,
    writeOffPercentage,
  } = data

  // Calculate DSO improvement
  const dsoImprovement = currentDSO - targetDSO
  const dsoImprovementPercentage = (dsoImprovement / currentDSO) * 100

  // Calculate cash flow improvement
  const dailyRevenue = annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoImprovement

  // Calculate write-off reduction (assume 50% reduction)
  const currentWriteOffs = annualRevenue * (writeOffPercentage / 100)
  const writeOffReduction = currentWriteOffs * 0.5

  // Calculate collection cost savings (assume 40% reduction)
  const collectionCostSavings = collectionCosts * 0.4

  // Calculate time savings
  const hoursPerInvoice = 0.5 // Assume 30 minutes per invoice currently
  const hoursReduction = 0.3 // 30% reduction in time
  const hoursSaved = numberOfInvoices * hoursPerInvoice * hoursReduction
  const costPerHour = 50 // Average cost per hour
  const timeSavings = hoursSaved * costPerHour

  // Total annual benefits
  const totalAnnualBenefits = cashFlowImprovement + writeOffReduction + collectionCostSavings + timeSavings

  // Calculate estimated investment (5% of annual revenue)
  const estimatedInvestment = annualRevenue * 0.05

  // Calculate ROI
  const roi = ((totalAnnualBenefits - estimatedInvestment) / estimatedInvestment) * 100

  // Calculate payback period
  const monthlyBenefit = totalAnnualBenefits / 12
  const paybackPeriod = estimatedInvestment / monthlyBenefit

  return {
    dsoImprovement,
    dsoImprovementPercentage,
    cashFlowImprovement,
    writeOffReduction,
    collectionCostSavings,
    timeSavings,
    hoursSaved,
    totalAnnualBenefits,
    estimatedInvestment,
    roi,
    paybackPeriod,
  }
}

// Verification Code Functions
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
    try {
      const clicksendAuth = Buffer.from(`${process.env.CLICKSEND_USERNAME}:${process.env.CLICKSEND_API_KEY}`).toString(
        "base64",
      )

      const emailBody = `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; text-align: center;">Verification Code</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                Your verification code is:
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px;">
                  ${code}
                </span>
              </div>
              <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                This code will expire in 10 minutes.
              </p>
              <p style="font-size: 14px; color: #6b7280;">
                If you didn't request this code, please ignore this email.
              </p>
            </div>
          </body>
        </html>
      `

      const response = await fetch("https://rest.clicksend.com/v3/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${clicksendAuth}`,
        },
        body: JSON.stringify({
          from: {
            email_address_id: Number.parseInt(process.env.CLICKSEND_EMAIL_ADDRESS_ID || "0"),
            name: "Kuhlekt",
          },
          to: [
            {
              email: email,
              name: email.split("@")[0],
            },
          ],
          subject: "Your Kuhlekt Verification Code",
          body: emailBody,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("ClickSend error:", errorText)
        // Don't throw error, just log it
        console.log("Verification code generated but email failed to send. Code:", code)
      }
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      // Don't throw error, just log the code for testing
      console.log("Verification code (email failed):", code)
    }

    return { success: true }
  } catch (error) {
    console.error("Error generating verification code:", error)
    throw error
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const supabase = await createClient()

    // Find valid code
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

    // Mark as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, error: "Failed to verify code" }
  }
}

// Send ROI Email Function
export async function sendROIEmail(email: string, results: any, calculationType: "simple" | "detailed") {
  try {
    const clicksendAuth = Buffer.from(`${process.env.CLICKSEND_USERNAME}:${process.env.CLICKSEND_API_KEY}`).toString(
      "base64",
    )

    const formatCurrency = (value: number) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

    const formatPercent = (value: number) => `${value.toFixed(2)}%`

    let emailBody = ""

    if (calculationType === "simple") {
      emailBody = `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; text-align: center;">Your ROI Results</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #374151; margin-top: 0;">Simple ROI Calculation</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-top: 0;">Key Metrics</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">DSO Improvement</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${results.dsoImprovement.toFixed(1)} days</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Cash Flow Improvement</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${formatCurrency(results.cashFlowImprovement)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Return on Investment</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #10b981;">${formatPercent(results.roi)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Payback Period</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${results.paybackPeriod.toFixed(1)} months</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280;">Estimated Investment</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${formatCurrency(results.estimatedInvestment)}</td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                These results are based on industry benchmarks and your provided data. 
                Contact us to discuss how Kuhlekt can help you achieve these improvements.
              </p>
            </div>
          </body>
        </html>
      `
    } else {
      emailBody = `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; text-align: center;">Your Detailed ROI Results</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #374151; margin-top: 0;">Comprehensive ROI Analysis</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-top: 0;">Financial Impact</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Cash Flow Improvement</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${formatCurrency(results.cashFlowImprovement)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Write-off Reduction</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${formatCurrency(results.writeOffReduction)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Collection Cost Savings</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${formatCurrency(results.collectionCostSavings)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Time Savings Value</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${formatCurrency(results.timeSavings)}</td>
                  </tr>
                  <tr style="border-bottom: 2px solid #667eea;">
                    <td style="padding: 10px 0; color: #374151; font-weight: bold;">Total Annual Benefits</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #10b981;">${formatCurrency(results.totalAnnualBenefits)}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-top: 0;">ROI Metrics</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">DSO Improvement</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${results.dsoImprovement.toFixed(1)} days (${formatPercent(results.dsoImprovementPercentage)})</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Hours Saved Annually</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${results.hoursSaved.toFixed(0)} hours</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Return on Investment</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #10b981;">${formatPercent(results.roi)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Payback Period</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${results.paybackPeriod.toFixed(1)} months</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280;">Estimated Investment</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${formatCurrency(results.estimatedInvestment)}</td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                These results are based on your specific data and industry best practices. 
                Schedule a demo to see how Kuhlekt can deliver these results for your business.
              </p>
            </div>
          </body>
        </html>
      `
    }

    const response = await fetch("https://rest.clicksend.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${clicksendAuth}`,
      },
      body: JSON.stringify({
        from: {
          email_address_id: Number.parseInt(process.env.CLICKSEND_EMAIL_ADDRESS_ID || "0"),
          name: "Kuhlekt",
        },
        to: [
          {
            email: email,
            name: email.split("@")[0],
          },
        ],
        subject: "Your Kuhlekt ROI Analysis Results",
        body: emailBody,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ClickSend error:", errorText)
      throw new Error("Failed to send email")
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    throw error
  }
}
