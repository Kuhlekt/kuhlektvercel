"use server"

import { createClient } from "@/lib/supabase/server"

// Types for ROI calculations
interface SimpleROIInputs {
  annualRevenue: number
  avgInvoiceValue: number
  dso: number
}

interface DetailedROIInputs extends SimpleROIInputs {
  numInvoices: number
  collectionCost: number
  writeOffRate: number
}

interface SimpleROIResult {
  currentDSO: number
  projectedDSO: number
  dsoReduction: number
  cashFlowImprovement: number
  annualSavings: number
}

interface DetailedROIResult extends SimpleROIResult {
  currentCollectionCost: number
  projectedCollectionCost: number
  costSavings: number
  writeOffReduction: number
  totalAnnualBenefit: number
  roi: number
  paybackPeriod: number
}

// Simple ROI Calculation
export async function calculateSimpleROI(inputs: SimpleROIInputs): Promise<SimpleROIResult> {
  const { annualRevenue, avgInvoiceValue, dso } = inputs

  // Calculate current metrics
  const currentDSO = dso

  // Project 30% DSO reduction with automation
  const projectedDSO = dso * 0.7
  const dsoReduction = currentDSO - projectedDSO

  // Calculate cash flow improvement
  const dailyRevenue = annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction

  // Calculate annual savings (interest saved on freed capital at 5%)
  const annualSavings = cashFlowImprovement * 0.05

  return {
    currentDSO,
    projectedDSO,
    dsoReduction,
    cashFlowImprovement,
    annualSavings,
  }
}

// Detailed ROI Calculation
export async function calculateDetailedROI(inputs: DetailedROIInputs): Promise<DetailedROIResult> {
  const { annualRevenue, avgInvoiceValue, dso, numInvoices, collectionCost, writeOffRate } = inputs

  // Get simple ROI metrics first
  const simpleMetrics = await calculateSimpleROI({ annualRevenue, avgInvoiceValue, dso })

  // Calculate collection costs
  const currentCollectionCost = numInvoices * collectionCost
  const projectedCollectionCost = currentCollectionCost * 0.5 // 50% reduction with automation
  const costSavings = currentCollectionCost - projectedCollectionCost

  // Calculate write-off reduction
  const currentWriteOff = annualRevenue * (writeOffRate / 100)
  const projectedWriteOff = currentWriteOff * 0.7 // 30% reduction
  const writeOffReduction = currentWriteOff - projectedWriteOff

  // Calculate total benefits
  const totalAnnualBenefit = simpleMetrics.annualSavings + costSavings + writeOffReduction

  // Assume implementation cost of $50,000
  const implementationCost = 50000
  const roi = (totalAnnualBenefit / implementationCost) * 100
  const paybackPeriod = implementationCost / (totalAnnualBenefit / 12) // in months

  return {
    ...simpleMetrics,
    currentCollectionCost,
    projectedCollectionCost,
    costSavings,
    writeOffReduction,
    totalAnnualBenefit,
    roi,
    paybackPeriod,
  }
}

// Generate verification code
export async function generateVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store in Supabase
    const supabase = await createClient()
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
    const username = process.env.CLICKSEND_USERNAME
    const apiKey = process.env.CLICKSEND_API_KEY
    const emailAddressId = process.env.CLICKSEND_EMAIL_ADDRESS_ID

    if (!username || !apiKey || !emailAddressId) {
      console.error("Missing ClickSend credentials")
      console.log("Verification code (for testing):", code)
      return {
        success: true,
        message: "Verification code generated (email not sent - missing credentials). Check console for code.",
      }
    }

    // Create Basic Auth token
    const authToken = Buffer.from(`${username}:${apiKey}`).toString("base64")

    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .code { font-size: 32px; font-weight: bold; color: #667eea; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; letter-spacing: 8px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Verification Code</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Thank you for using the Kuhlekt ROI Calculator. Your verification code is:</p>
            <div class="code">${code}</div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const response = await fetch("https://rest.clicksend.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`,
      },
      body: JSON.stringify({
        email_address_id: Number.parseInt(emailAddressId),
        to: [{ email, name: email }],
        subject: "Your Kuhlekt ROI Calculator Verification Code",
        body: emailBody,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ClickSend error:", errorText)
      console.log("Verification code (for testing):", code)
      return {
        success: true,
        message: "Verification code generated (email sending failed). Check console for code.",
      }
    }

    return { success: true, message: "Verification code sent successfully" }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return { success: false, message: "Failed to generate verification code" }
  }
}

// Verify code
export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    // Find the code
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .single()

    if (error || !data) {
      return { success: false, message: "Invalid or expired verification code" }
    }

    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
      return { success: false, message: "Verification code has expired" }
    }

    // Mark as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true, message: "Code verified successfully" }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, message: "Failed to verify code" }
  }
}

// Send ROI email
export async function sendROIEmail(
  email: string,
  results: SimpleROIResult | DetailedROIResult,
  isDetailed: boolean,
): Promise<{ success: boolean; message: string }> {
  try {
    const username = process.env.CLICKSEND_USERNAME
    const apiKey = process.env.CLICKSEND_API_KEY
    const emailAddressId = process.env.CLICKSEND_EMAIL_ADDRESS_ID

    if (!username || !apiKey || !emailAddressId) {
      console.error("Missing ClickSend credentials")
      return { success: false, message: "Email service not configured" }
    }

    // Create Basic Auth token
    const authToken = Buffer.from(`${username}:${apiKey}`).toString("base64")

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
    }

    const formatNumber = (value: number, decimals = 1) => {
      return value.toFixed(decimals)
    }

    let emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .metric { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; }
          .metric-label { color: #666; font-size: 14px; margin-bottom: 5px; }
          .metric-value { font-size: 24px; font-weight: bold; color: #667eea; }
          .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 10px 10px; }
          .cta { text-align: center; margin: 30px 0; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your ROI Calculator Results</h1>
          </div>
          <div class="content">
            <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
            
            <div class="metric">
              <div class="metric-label">Current DSO</div>
              <div class="metric-value">${formatNumber(results.currentDSO)} days</div>
            </div>
            
            <div class="metric">
              <div class="metric-label">Projected DSO (with Kuhlekt)</div>
              <div class="metric-value">${formatNumber(results.projectedDSO)} days</div>
            </div>
            
            <div class="metric">
              <div class="metric-label">DSO Reduction</div>
              <div class="metric-value">${formatNumber(results.dsoReduction)} days</div>
            </div>
            
            <div class="metric">
              <div class="metric-label">Cash Flow Improvement</div>
              <div class="metric-value">${formatCurrency(results.cashFlowImprovement)}</div>
            </div>
            
            <div class="metric">
              <div class="metric-label">Annual Savings</div>
              <div class="metric-value">${formatCurrency(results.annualSavings)}</div>
            </div>
    `

    if (isDetailed && "totalAnnualBenefit" in results) {
      emailBody += `
            <div class="metric">
              <div class="metric-label">Cost Savings</div>
              <div class="metric-value">${formatCurrency(results.costSavings)}</div>
            </div>
            
            <div class="metric">
              <div class="metric-label">Write-Off Reduction</div>
              <div class="metric-value">${formatCurrency(results.writeOffReduction)}</div>
            </div>
            
            <div class="metric">
              <div class="metric-label">Total Annual Benefit</div>
              <div class="metric-value">${formatCurrency(results.totalAnnualBenefit)}</div>
            </div>
            
            <div class="metric">
              <div class="metric-label">Return on Investment</div>
              <div class="metric-value">${formatNumber(results.roi)}%</div>
            </div>
            
            <div class="metric">
              <div class="metric-label">Payback Period</div>
              <div class="metric-value">${formatNumber(results.paybackPeriod)} months</div>
            </div>
      `
    }

    emailBody += `
            <div class="cta">
              <p>Ready to achieve these results?</p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://kuhlekt.com"}/demo" class="button">Schedule a Demo</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            <p>If you have any questions, please contact us at info@kuhlekt.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    const response = await fetch("https://rest.clicksend.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`,
      },
      body: JSON.stringify({
        email_address_id: Number.parseInt(emailAddressId),
        to: [{ email, name: email }],
        subject: "Your Kuhlekt ROI Calculator Results",
        body: emailBody,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ClickSend error:", errorText)
      return { success: false, message: "Failed to send email" }
    }

    return { success: true, message: "Results sent successfully" }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return { success: false, message: "Failed to send email" }
  }
}
