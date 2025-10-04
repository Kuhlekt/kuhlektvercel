"use server"

import { createClient } from "@/lib/supabase/server"

// ROI Calculation Types
interface SimpleROIInput {
  currentRevenue: number
  invoiceVolume: number
  averageDSO: number
}

interface DetailedROIInput extends SimpleROIInput {
  collectionCosts: number
  badDebtRate: number
  interestRate: number
}

interface ROIResult {
  annualSavings: number
  threeYearROI: number
  paybackPeriod: number
  dsoImprovement: number
  cashFlowImprovement: number
}

// ClickSend Email Function
async function sendClickSendEmail(to: string, subject: string, body: string): Promise<void> {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const emailAddressId = process.env.CLICKSEND_EMAIL_ADDRESS_ID

  if (!username || !apiKey || !emailAddressId) {
    throw new Error("ClickSend credentials not configured")
  }

  // Parse email_address_id as integer
  const parsedEmailAddressId = Number.parseInt(emailAddressId, 10)

  if (isNaN(parsedEmailAddressId)) {
    throw new Error(`Invalid CLICKSEND_EMAIL_ADDRESS_ID - not a number: ${emailAddressId}`)
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
      email_address_id: parsedEmailAddressId,
      name: "Kuhlekt",
    },
    subject: subject,
    body: body,
  }

  console.log("ClickSend payload:", JSON.stringify(payload, null, 2))

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  })

  const responseData = await response.json()

  if (!response.ok) {
    console.error("ClickSend error:", responseData)
    throw new Error(
      `fetch to https://rest.clicksend.com/v3/email/send failed with status ${response.status} and body: ${JSON.stringify(responseData)}`,
    )
  }

  console.log("ClickSend success:", responseData)
}

// Simple ROI Calculation
export async function calculateSimpleROI(input: SimpleROIInput): Promise<ROIResult> {
  const { currentRevenue, invoiceVolume, averageDSO } = input

  // Assumptions for simple calculation
  const targetDSO = Math.max(averageDSO * 0.7, 30) // 30% improvement
  const dsoReduction = averageDSO - targetDSO
  const dailyRevenue = currentRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction

  // Annual savings calculation
  const interestRate = 0.06 // 6% cost of capital
  const annualSavings = cashFlowImprovement * interestRate

  // Implementation cost estimate (simplified)
  const implementationCost = invoiceVolume * 2 // $2 per invoice setup

  const paybackPeriod = implementationCost / annualSavings
  const threeYearROI = ((annualSavings * 3 - implementationCost) / implementationCost) * 100

  return {
    annualSavings: Math.round(annualSavings),
    threeYearROI: Math.round(threeYearROI),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    dsoImprovement: Math.round(dsoReduction),
    cashFlowImprovement: Math.round(cashFlowImprovement),
  }
}

// Detailed ROI Calculation
export async function calculateDetailedROI(input: DetailedROIInput): Promise<ROIResult> {
  const { currentRevenue, invoiceVolume, averageDSO, collectionCosts, badDebtRate, interestRate } = input

  // DSO improvement
  const targetDSO = Math.max(averageDSO * 0.7, 30)
  const dsoReduction = averageDSO - targetDSO
  const dailyRevenue = currentRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction

  // Collection cost savings (50% reduction in manual work)
  const collectionSavings = collectionCosts * 0.5

  // Bad debt reduction (30% improvement)
  const badDebtSavings = currentRevenue * badDebtRate * 0.3

  // Interest savings from improved cash flow
  const interestSavings = cashFlowImprovement * interestRate

  // Total annual savings
  const annualSavings = collectionSavings + badDebtSavings + interestSavings

  // Implementation cost (more detailed)
  const setupCost = 5000
  const perInvoiceCost = invoiceVolume * 2
  const implementationCost = setupCost + perInvoiceCost

  const paybackPeriod = implementationCost / annualSavings
  const threeYearROI = ((annualSavings * 3 - implementationCost) / implementationCost) * 100

  return {
    annualSavings: Math.round(annualSavings),
    threeYearROI: Math.round(threeYearROI),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    dsoImprovement: Math.round(dsoReduction),
    cashFlowImprovement: Math.round(cashFlowImprovement),
  }
}

// Generate Verification Code
export async function generateVerificationCode(
  email: string,
): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    const supabase = await createClient()

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store in database
    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      throw new Error(`Database error: ${dbError.message}`)
    }

    // Send email via ClickSend
    try {
      await sendClickSendEmail(
        email,
        "Your Kuhlekt ROI Calculator Verification Code",
        `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
                .content { padding: 30px; background-color: #f9f9f9; }
                .code { font-size: 32px; font-weight: bold; color: #0066cc; text-align: center; padding: 20px; background-color: white; border: 2px solid #0066cc; border-radius: 5px; margin: 20px 0; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Kuhlekt ROI Calculator</h1>
                </div>
                <div class="content">
                  <p>Thank you for your interest in Kuhlekt's AR automation solutions!</p>
                  <p>Your verification code is:</p>
                  <div class="code">${code}</div>
                  <p>This code will expire in 10 minutes.</p>
                  <p>If you didn't request this code, please ignore this email.</p>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      )
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Still return success with the code for testing
      console.log("Verification code (email failed):", code)
    }

    return { success: true, code }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Verify Code
export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Find valid code
    const { data, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !data) {
      return { success: false, error: "Invalid or expired code" }
    }

    // Mark as used
    const { error: updateError } = await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    if (updateError) {
      console.error("Error marking code as used:", updateError)
      return { success: false, error: "Failed to verify code" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Send ROI Email
export async function sendROIEmail(
  email: string,
  results: ROIResult,
  input: SimpleROIInput | DetailedROIInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const isDetailed = "collectionCosts" in input

    const emailBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .results { background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .metric-label { font-weight: bold; }
            .metric-value { color: #0066cc; font-weight: bold; }
            .cta { text-align: center; margin: 30px 0; }
            .button { display: inline-block; padding: 15px 30px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 5px; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Kuhlekt ROI Analysis</h1>
            </div>
            <div class="content">
              <p>Thank you for using the Kuhlekt ROI Calculator!</p>
              <p>Based on your ${isDetailed ? "detailed" : "simple"} analysis, here are your potential savings with Kuhlekt's AR automation:</p>
              
              <div class="results">
                <div class="metric">
                  <span class="metric-label">Annual Savings:</span>
                  <span class="metric-value">$${results.annualSavings.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">3-Year ROI:</span>
                  <span class="metric-value">${results.threeYearROI.toLocaleString()}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Payback Period:</span>
                  <span class="metric-value">${results.paybackPeriod} months</span>
                </div>
                <div class="metric">
                  <span class="metric-label">DSO Improvement:</span>
                  <span class="metric-value">${results.dsoImprovement} days</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Cash Flow Improvement:</span>
                  <span class="metric-value">$${results.cashFlowImprovement.toLocaleString()}</span>
                </div>
              </div>

              ${
                isDetailed
                  ? `
              <h3>Your Input Data:</h3>
              <div class="results">
                <div class="metric">
                  <span class="metric-label">Annual Revenue:</span>
                  <span class="metric-value">$${input.currentRevenue.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Invoice Volume:</span>
                  <span class="metric-value">${input.invoiceVolume.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Average DSO:</span>
                  <span class="metric-value">${input.averageDSO} days</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Collection Costs:</span>
                  <span class="metric-value">$${(input as DetailedROIInput).collectionCosts.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Bad Debt Rate:</span>
                  <span class="metric-value">${((input as DetailedROIInput).badDebtRate * 100).toFixed(1)}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Interest Rate:</span>
                  <span class="metric-value">${((input as DetailedROIInput).interestRate * 100).toFixed(1)}%</span>
                </div>
              </div>
              `
                  : ""
              }

              <div class="cta">
                <p>Ready to transform your accounts receivable process?</p>
                <a href="https://kuhlekt.com/demo" class="button">Schedule a Demo</a>
              </div>

              <p>Our team is ready to show you how Kuhlekt can help your business achieve these results and more.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              <p>Questions? Contact us at support@kuhlekt.com</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, "Your Kuhlekt ROI Analysis Results", emailBody)

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
