"use server"

import { createClient } from "@/lib/supabase/server"

// ROI Calculation Types
export interface SimpleROIInputs {
  annualRevenue: number
  currentDSO: number
}

export interface DetailedROIInputs extends SimpleROIInputs {
  averageInvoiceValue: number
  monthlyInvoices: number
  collectionCosts: number
  badDebtRate: number
}

export interface SimpleROIResults {
  currentCashTiedUp: number
  improvedCashTiedUp: number
  cashReleased: number
  annualSavings: number
  threeYearSavings: number
}

export interface DetailedROIResults extends SimpleROIResults {
  currentCollectionCosts: number
  reducedCollectionCosts: number
  collectionCostSavings: number
  currentBadDebt: number
  reducedBadDebt: number
  badDebtReduction: number
  totalAnnualBenefit: number
  threeYearBenefit: number
  roiPercentage: number
  paybackMonths: number
}

// Simple ROI Calculation
export async function calculateSimpleROI(inputs: SimpleROIInputs): Promise<SimpleROIResults> {
  const { annualRevenue, currentDSO } = inputs

  const targetDSO = Math.max(currentDSO * 0.7, 30) // 30% improvement, minimum 30 days
  const dsoReduction = currentDSO - targetDSO

  const dailyRevenue = annualRevenue / 365
  const currentCashTiedUp = dailyRevenue * currentDSO
  const improvedCashTiedUp = dailyRevenue * targetDSO
  const cashReleased = currentCashTiedUp - improvedCashTiedUp

  const annualSavings = cashReleased * 0.05 // 5% opportunity cost
  const threeYearSavings = annualSavings * 3

  return {
    currentCashTiedUp,
    improvedCashTiedUp,
    cashReleased,
    annualSavings,
    threeYearSavings,
  }
}

// Detailed ROI Calculation
export async function calculateDetailedROI(inputs: DetailedROIInputs): Promise<DetailedROIResults> {
  const simpleResults = await calculateSimpleROI(inputs)

  const { averageInvoiceValue, monthlyInvoices, collectionCosts, badDebtRate } = inputs

  const annualInvoices = monthlyInvoices * 12
  const currentCollectionCosts = collectionCosts * 12
  const reducedCollectionCosts = currentCollectionCosts * 0.6 // 40% reduction
  const collectionCostSavings = currentCollectionCosts - reducedCollectionCosts

  const annualRevenue = averageInvoiceValue * annualInvoices
  const currentBadDebt = annualRevenue * (badDebtRate / 100)
  const reducedBadDebt = currentBadDebt * 0.5 // 50% reduction
  const badDebtReduction = currentBadDebt - reducedBadDebt

  const totalAnnualBenefit = simpleResults.annualSavings + collectionCostSavings + badDebtReduction
  const threeYearBenefit = totalAnnualBenefit * 3

  const estimatedImplementationCost = 50000 // Placeholder
  const roiPercentage = ((totalAnnualBenefit - estimatedImplementationCost) / estimatedImplementationCost) * 100
  const paybackMonths = estimatedImplementationCost / (totalAnnualBenefit / 12)

  return {
    ...simpleResults,
    currentCollectionCosts,
    reducedCollectionCosts,
    collectionCostSavings,
    currentBadDebt,
    reducedBadDebt,
    badDebtReduction,
    totalAnnualBenefit,
    threeYearBenefit,
    roiPercentage,
    paybackMonths,
  }
}

// ClickSend Email Helper
async function sendClickSendEmail(to: string, subject: string, body: string): Promise<boolean> {
  try {
    const username = process.env.CLICKSEND_USERNAME
    const apiKey = process.env.CLICKSEND_API_KEY
    const emailAddressId = process.env.CLICKSEND_EMAIL_ADDRESS_ID

    console.log("ClickSend Environment Variables:", {
      username: username ? "SET" : "MISSING",
      apiKey: apiKey ? "SET" : "MISSING",
      emailAddressId: emailAddressId ? `SET (${emailAddressId})` : "MISSING",
    })

    if (!username || !apiKey || !emailAddressId) {
      console.error("Missing ClickSend credentials")
      return false
    }

    // Parse email_address_id - it might come as a string
    const emailAddressIdNum = Number.parseInt(emailAddressId, 10)

    if (isNaN(emailAddressIdNum)) {
      console.error("Invalid CLICKSEND_EMAIL_ADDRESS_ID - not a number:", emailAddressId)
      return false
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
        email_address_id: emailAddressIdNum,
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

    const responseData = await response.json()

    console.log("ClickSend API Response:", {
      status: response.status,
      data: responseData,
    })

    if (!response.ok) {
      console.error("ClickSend API error:", responseData)
      return false
    }

    console.log("Email sent successfully via ClickSend")
    return true
  } catch (error) {
    console.error("Error sending email via ClickSend:", error)
    return false
  }
}

// Generate Verification Code
export async function generateVerificationCode(email: string): Promise<{ code?: string; error?: string }> {
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in Supabase
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return { error: "Failed to generate verification code" }
    }

    // Send email via ClickSend
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Your Verification Code</h2>
        <p style="font-size: 16px; color: #666;">Please use the following code to verify your email address:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">${code}</span>
        </div>
        <p style="font-size: 14px; color: #999;">This code will expire in 10 minutes.</p>
        <p style="font-size: 14px; color: #999;">If you didn't request this code, please ignore this email.</p>
      </div>
    `

    const emailSent = await sendClickSendEmail(email, "Your Verification Code", emailBody)

    if (!emailSent) {
      console.warn("Email sending failed, but code was stored. Code:", code)
    }

    return { code } // Return code for testing even if email fails
  } catch (error) {
    console.error("Error generating verification code:", error)
    return { error: error instanceof Error ? error.message : "Failed to generate verification code" }
  }
}

// Verify Code
export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
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

// Send ROI Email
export async function sendROIEmail(
  email: string,
  results: SimpleROIResults | DetailedROIResults,
  isDetailed: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const formatCurrency = (value: number) =>
      `$${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

    let emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Your ROI Analysis Results</h2>
        <p style="font-size: 16px; color: #666;">Thank you for using our ROI Calculator. Here are your personalized results:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Cash Flow Impact</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">Current Cash Tied Up:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">${formatCurrency(results.currentCashTiedUp)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">Improved Cash Tied Up:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">${formatCurrency(results.improvedCashTiedUp)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd; color: #28a745;">Cash Released:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold; color: #28a745;">${formatCurrency(results.cashReleased)}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #e8f5e9; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Projected Savings</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0;">Annual Savings:</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 18px;">${formatCurrency(results.annualSavings)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0;">3-Year Savings:</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 18px;">${formatCurrency(results.threeYearSavings)}</td>
            </tr>
          </table>
        </div>
    `

    if (isDetailed && "totalAnnualBenefit" in results) {
      emailBody += `
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Additional Benefits</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">Collection Cost Savings:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">${formatCurrency(results.collectionCostSavings)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">Bad Debt Reduction:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">${formatCurrency(results.badDebtReduction)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #28a745;">Total Annual Benefit:</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 18px; color: #28a745;">${formatCurrency(results.totalAnnualBenefit)}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #e3f2fd; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">ROI Metrics</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0;">ROI Percentage:</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 18px; color: #1976d2;">${results.roiPercentage.toFixed(1)}%</td>
            </tr>
            <tr>
              <td style="padding: 10px 0;">Payback Period:</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 18px; color: #1976d2;">${results.paybackMonths.toFixed(1)} months</td>
            </tr>
          </table>
        </div>
      `
    }

    emailBody += `
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="font-size: 14px; color: #666;">Ready to unlock these savings? Contact us to schedule a demo and see how Kuhlekt can transform your accounts receivable process.</p>
          <a href="https://kuhlekt.com/demo" style="display: inline-block; background-color: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Schedule a Demo</a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
          <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
        </div>
      </div>
    `

    const emailSent = await sendClickSendEmail(email, "Your ROI Analysis Results", emailBody)

    if (!emailSent) {
      return { success: false, error: "Failed to send email" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return { success: false, error: "Failed to send ROI results" }
  }
}
