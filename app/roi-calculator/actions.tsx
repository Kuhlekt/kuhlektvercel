"use server"

import { createClient } from "@/lib/supabase/server"

// Helper function to send email via ClickSend
async function sendClickSendEmail(to: string, subject: string, body: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "support@kuhlekt.com"

  if (!username || !apiKey) {
    console.error("ClickSend credentials not configured")
    throw new Error("Email service not configured")
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

  console.log("Sending ClickSend email with payload:", JSON.stringify(payload, null, 2))

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json()

  if (!response.ok) {
    console.error("ClickSend API error:", result)
    throw new Error(
      `fetch to https://rest.clicksend.com/v3/email/send failed with status ${response.status} and body: ${JSON.stringify(result)}`,
    )
  }

  return result
}

// Calculate Simple ROI
export async function calculateSimpleROI(data: {
  annualRevenue: number
  averageInvoiceValue: number
  numberOfInvoices: number
  currentDSO: number
}) {
  const targetDSO = Math.max(30, data.currentDSO * 0.7)
  const dsoReduction = data.currentDSO - targetDSO
  const dsoReductionPercentage = (dsoReduction / data.currentDSO) * 100

  const dailyRevenue = data.annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction
  const cashFlowImprovementPercentage = (cashFlowImprovement / data.annualRevenue) * 100

  const estimatedAnnualCost = data.annualRevenue * 0.001
  const netBenefit = cashFlowImprovement - estimatedAnnualCost
  const roi = (netBenefit / estimatedAnnualCost) * 100
  const paybackPeriod = estimatedAnnualCost / (cashFlowImprovement / 12)

  return {
    currentDSO: data.currentDSO,
    targetDSO,
    dsoReduction,
    dsoReductionPercentage,
    cashFlowImprovement,
    cashFlowImprovementPercentage,
    estimatedAnnualCost,
    netBenefit,
    roi,
    paybackPeriod,
  }
}

// Calculate Detailed ROI
export async function calculateDetailedROI(data: {
  annualRevenue: number
  averageInvoiceValue: number
  numberOfInvoices: number
  currentDSO: number
  numberOfEmployees: number
  averageHourlyRate: number
  hoursPerInvoice: number
  badDebtPercentage: number
  latePaymentFees: number
}) {
  const simpleResults = await calculateSimpleROI(data)

  const currentLaborCost = data.numberOfInvoices * data.hoursPerInvoice * data.averageHourlyRate
  const automatedLaborCost = currentLaborCost * 0.3
  const laborSavings = currentLaborCost - automatedLaborCost

  const currentBadDebt = data.annualRevenue * (data.badDebtPercentage / 100)
  const reducedBadDebt = currentBadDebt * 0.5
  const badDebtReduction = currentBadDebt - reducedBadDebt

  const workingCapitalBenefit = simpleResults.cashFlowImprovement * 0.05

  const totalAnnualBenefit =
    simpleResults.cashFlowImprovement + laborSavings + badDebtReduction + workingCapitalBenefit + data.latePaymentFees

  const netBenefit = totalAnnualBenefit - simpleResults.estimatedAnnualCost
  const roi = (netBenefit / simpleResults.estimatedAnnualCost) * 100
  const paybackPeriod = simpleResults.estimatedAnnualCost / (totalAnnualBenefit / 12)

  return {
    ...simpleResults,
    laborSavings,
    badDebtReduction,
    workingCapitalBenefit,
    latePaymentFees: data.latePaymentFees,
    totalAnnualBenefit,
    netBenefit,
    roi,
    paybackPeriod,
  }
}

// Generate verification code
export async function generateVerificationCode(email: string) {
  try {
    const supabase = await createClient()

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in Supabase with 10-minute expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt,
      used: false,
    })

    if (insertError) {
      console.error("Error inserting verification code:", insertError)
      throw insertError
    }

    // Send email via ClickSend
    try {
      const emailBody = `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
              <h2 style="color: #333; margin-bottom: 20px;">Your Verification Code</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Thank you for your interest in Kuhlekt's ROI Calculator. Use the verification code below to access your personalized ROI report:
              </p>
              <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
                <div style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">
                  ${code}
                </div>
              </div>
              <p style="color: #666; font-size: 14px; line-height: 1.5;">
                This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
              <p style="color: #999; font-size: 12px;">
                Kuhlekt - Credit Management Solutions
              </p>
            </div>
          </body>
        </html>
      `

      await sendClickSendEmail(email, "Your Kuhlekt ROI Calculator Verification Code", emailBody)
      console.log("Verification email sent successfully")
    } catch (emailError) {
      console.error("Error sending verification email:", emailError)
      // Still return the code even if email fails, for testing
      console.log("Verification code (email failed):", code)
    }

    return { success: true, code }
  } catch (error) {
    console.error("Error generating verification code:", error)
    throw error
  }
}

// Verify code
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
      .single()

    if (error || !data) {
      return { success: false, message: "Invalid or expired verification code" }
    }

    // Mark code as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, message: "Verification failed" }
  }
}

// Send ROI email
export async function sendROIEmail(email: string, results: any, isDetailed: boolean) {
  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

    let emailBody = ""

    if (isDetailed) {
      emailBody = `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 40px; border-radius: 10px;">
              <h1 style="color: #2563eb; margin-bottom: 30px;">Your Detailed ROI Analysis</h1>
              
              <div style="background-color: #fff; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
                <h2 style="color: #333; margin-bottom: 20px;">Executive Summary</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                  <div>
                    <p style="color: #666; margin: 5px 0;">Total Annual Benefit</p>
                    <p style="font-size: 24px; font-weight: bold; color: #2563eb; margin: 5px 0;">
                      ${formatter.format(results.totalAnnualBenefit)}
                    </p>
                  </div>
                  <div>
                    <p style="color: #666; margin: 5px 0;">Return on Investment</p>
                    <p style="font-size: 24px; font-weight: bold; color: #16a34a; margin: 5px 0;">
                      ${results.roi.toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p style="color: #666; margin: 5px 0;">Net Benefit</p>
                    <p style="font-size: 24px; font-weight: bold; color: #2563eb; margin: 5px 0;">
                      ${formatter.format(results.netBenefit)}
                    </p>
                  </div>
                  <div>
                    <p style="color: #666; margin: 5px 0;">Payback Period</p>
                    <p style="font-size: 24px; font-weight: bold; color: #2563eb; margin: 5px 0;">
                      ${results.paybackPeriod.toFixed(1)} months
                    </p>
                  </div>
                </div>
              </div>

              <div style="background-color: #fff; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
                <h2 style="color: #333; margin-bottom: 20px;">Cash Flow Improvement</h2>
                <p style="color: #666; margin: 10px 0;">Current DSO: <strong>${results.currentDSO} days</strong></p>
                <p style="color: #666; margin: 10px 0;">Target DSO: <strong>${results.targetDSO.toFixed(0)} days</strong></p>
                <p style="color: #666; margin: 10px 0;">DSO Reduction: <strong>${results.dsoReduction.toFixed(0)} days (${results.dsoReductionPercentage.toFixed(1)}%)</strong></p>
                <p style="color: #2563eb; font-size: 18px; font-weight: bold; margin: 20px 0;">
                  Cash Flow Improvement: ${formatter.format(results.cashFlowImprovement)}
                </p>
              </div>

              <div style="background-color: #fff; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
                <h2 style="color: #333; margin-bottom: 20px;">Operational Savings</h2>
                <p style="color: #666; margin: 10px 0;">Labor Cost Savings: <strong>${formatter.format(results.laborSavings)}</strong></p>
                <p style="color: #666; margin: 10px 0;">Bad Debt Reduction: <strong>${formatter.format(results.badDebtReduction)}</strong></p>
                <p style="color: #666; margin: 10px 0;">Late Payment Fee Recovery: <strong>${formatter.format(results.latePaymentFees)}</strong></p>
                <p style="color: #666; margin: 10px 0;">Working Capital Benefit: <strong>${formatter.format(results.workingCapitalBenefit)}</strong></p>
              </div>

              <div style="background-color: #fff; padding: 30px; border-radius: 8px;">
                <h2 style="color: #333; margin-bottom: 20px;">Investment</h2>
                <p style="color: #666; margin: 10px 0;">Estimated Annual Cost: <strong>${formatter.format(results.estimatedAnnualCost)}</strong></p>
              </div>

              <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
                <h3 style="color: #333; margin-bottom: 15px;">Next Steps</h3>
                <p style="color: #666; line-height: 1.6;">
                  Ready to achieve these results? Schedule a personalized demo to see how Kuhlekt can transform your accounts receivable process.
                </p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" 
                   style="display: inline-block; background-color: #2563eb; color: white; padding: 15px 30px; 
                          text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: bold;">
                  Schedule a Demo
                </a>
              </div>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0;" />
              <p style="color: #999; font-size: 12px;">
                Kuhlekt - Credit Management Solutions<br>
                This analysis is based on the information you provided and industry benchmarks.
              </p>
            </div>
          </body>
        </html>
      `
    } else {
      emailBody = `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 40px; border-radius: 10px;">
              <h1 style="color: #2563eb; margin-bottom: 30px;">Your ROI Analysis</h1>
              
              <div style="background-color: #fff; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
                <h2 style="color: #333; margin-bottom: 20px;">Key Results</h2>
                <div style="margin: 20px 0;">
                  <p style="color: #666; margin: 5px 0;">Cash Flow Improvement</p>
                  <p style="font-size: 28px; font-weight: bold; color: #2563eb; margin: 5px 0;">
                    ${formatter.format(results.cashFlowImprovement)}
                  </p>
                </div>
                <div style="margin: 20px 0;">
                  <p style="color: #666; margin: 5px 0;">Return on Investment</p>
                  <p style="font-size: 28px; font-weight: bold; color: #16a34a; margin: 5px 0;">
                    ${results.roi.toFixed(0)}%
                  </p>
                </div>
                <div style="margin: 20px 0;">
                  <p style="color: #666; margin: 5px 0;">Payback Period</p>
                  <p style="font-size: 28px; font-weight: bold; color: #2563eb; margin: 5px 0;">
                    ${results.paybackPeriod.toFixed(1)} months
                  </p>
                </div>
              </div>

              <div style="background-color: #fff; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
                <h2 style="color: #333; margin-bottom: 20px;">DSO Improvement</h2>
                <p style="color: #666; margin: 10px 0;">Current DSO: <strong>${results.currentDSO} days</strong></p>
                <p style="color: #666; margin: 10px 0;">Target DSO: <strong>${results.targetDSO.toFixed(0)} days</strong></p>
                <p style="color: #666; margin: 10px 0;">DSO Reduction: <strong>${results.dsoReduction.toFixed(0)} days (${results.dsoReductionPercentage.toFixed(1)}%)</strong></p>
              </div>

              <div style="background-color: #fff; padding: 30px; border-radius: 8px;">
                <h2 style="color: #333; margin-bottom: 20px;">Investment</h2>
                <p style="color: #666; margin: 10px 0;">Estimated Annual Cost: <strong>${formatter.format(results.estimatedAnnualCost)}</strong></p>
                <p style="color: #666; margin: 10px 0;">Net Benefit: <strong>${formatter.format(results.netBenefit)}</strong></p>
              </div>

              <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
                <h3 style="color: #333; margin-bottom: 15px;">Want a More Detailed Analysis?</h3>
                <p style="color: #666; line-height: 1.6;">
                  Get a comprehensive breakdown including labor savings, bad debt reduction, and more.
                </p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/?calculator=detailed" 
                   style="display: inline-block; background-color: #2563eb; color: white; padding: 15px 30px; 
                          text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: bold;">
                  Get Detailed Analysis
                </a>
              </div>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0;" />
              <p style="color: #999; font-size: 12px;">
                Kuhlekt - Credit Management Solutions<br>
                This analysis is based on the information you provided and industry benchmarks.
              </p>
            </div>
          </body>
        </html>
      `
    }

    await sendClickSendEmail(email, `Your Kuhlekt ROI ${isDetailed ? "Detailed" : ""} Analysis Results`, emailBody)

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    throw error
  }
}
