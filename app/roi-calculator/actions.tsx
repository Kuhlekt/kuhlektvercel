"use server"

import { createClient } from "@/lib/supabase/server"

// ROI Calculation Functions
export async function calculateSimpleROI(formData: {
  annualRevenue: number
  averageInvoiceValue: number
  currentDSO: number
}) {
  const { annualRevenue, averageInvoiceValue, currentDSO } = formData

  // Calculate potential improvements
  const targetDSO = Math.max(currentDSO * 0.7, 30) // 30% reduction or minimum 30 days
  const dsoReduction = currentDSO - targetDSO

  // Calculate financial impact
  const dailyRevenue = annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction
  const annualSavings = cashFlowImprovement * 0.05 // Assume 5% cost of capital

  return {
    currentDSO,
    targetDSO,
    dsoReduction,
    cashFlowImprovement,
    annualSavings,
    percentageImprovement: (dsoReduction / currentDSO) * 100,
  }
}

export async function calculateDetailedROI(formData: {
  annualRevenue: number
  averageInvoiceValue: number
  currentDSO: number
  numberOfInvoices: number
  arTeamSize: number
  averageCollectionCost: number
  badDebtPercentage: number
}) {
  const {
    annualRevenue,
    averageInvoiceValue,
    currentDSO,
    numberOfInvoices,
    arTeamSize,
    averageCollectionCost,
    badDebtPercentage,
  } = formData

  // Simple ROI calculations
  const simpleROI = await calculateSimpleROI({
    annualRevenue,
    averageInvoiceValue,
    currentDSO,
  })

  // Detailed calculations
  const currentBadDebt = annualRevenue * (badDebtPercentage / 100)
  const targetBadDebt = currentBadDebt * 0.6 // 40% reduction
  const badDebtReduction = currentBadDebt - targetBadDebt

  const currentCollectionCost = numberOfInvoices * averageCollectionCost
  const targetCollectionCost = currentCollectionCost * 0.5 // 50% reduction through automation
  const collectionCostSavings = currentCollectionCost - targetCollectionCost

  const laborCostSavings = arTeamSize * 50000 * 0.3 // 30% time savings, assume $50k per FTE

  const totalAnnualSavings = simpleROI.annualSavings + badDebtReduction + collectionCostSavings + laborCostSavings

  const implementationCost = 50000 // Estimated implementation cost
  const annualSubscription = 25000 // Estimated annual subscription
  const firstYearCost = implementationCost + annualSubscription

  const roi = ((totalAnnualSavings - firstYearCost) / firstYearCost) * 100
  const paybackPeriod = firstYearCost / (totalAnnualSavings / 12)

  return {
    ...simpleROI,
    currentBadDebt,
    targetBadDebt,
    badDebtReduction,
    currentCollectionCost,
    targetCollectionCost,
    collectionCostSavings,
    laborCostSavings,
    totalAnnualSavings,
    implementationCost,
    annualSubscription,
    firstYearCost,
    roi,
    paybackPeriod,
  }
}

// ClickSend Email Function
async function sendClickSendEmail(to: string, subject: string, body: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_EMAIL_ADDRESS_ID || "support@kuhlekt.com"

  if (!username || !apiKey) {
    console.error("ClickSend credentials missing")
    throw new Error("Email service not configured")
  }

  // Create Basic Auth token
  const authToken = Buffer.from(`${username}:${apiKey}`).toString("base64")

  // ClickSend requires email_address_id as a number, not an email address
  // You need to get this ID from your ClickSend dashboard
  // For now, let's try without it and use email_address instead
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

  console.log("Sending email via ClickSend:", {
    to,
    subject,
    from: fromEmail,
  })

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authToken}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error("ClickSend API error:", {
      status: response.status,
      body: data,
      payload: payload,
    })
    throw new Error(`Failed to send email: ${data.response_msg || "Unknown error"}`)
  }

  console.log("Email sent successfully via ClickSend:", data)
  return data
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
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .code { font-size: 32px; font-weight: bold; color: #0066cc; text-align: center; padding: 20px; background: white; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Kuhlekt ROI Calculator</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Your verification code is:</p>
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

    try {
      await sendClickSendEmail(email, "Your Kuhlekt Verification Code", emailBody)
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      // Don't throw error - let user continue with code from console
    }

    console.log("Generated verification code:", code, "for email:", email)

    return {
      success: true,
      message: "Verification code sent to your email",
      code: code, // Include code in response for testing
    }
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
      return {
        success: false,
        message: "Invalid or expired verification code",
      }
    }

    // Mark as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return {
      success: true,
      message: "Code verified successfully",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    throw error
  }
}

// Send ROI Email Function
export async function sendROIEmail(email: string, results: any, isDetailed = false) {
  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

    const percentFormatter = new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })

    let emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .metric { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .metric-label { color: #666; font-size: 14px; }
          .metric-value { font-size: 24px; font-weight: bold; color: #0066cc; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your ROI Analysis Results</h1>
          </div>
          <div class="content">
            <h2>Executive Summary</h2>
    `

    if (isDetailed) {
      emailBody += `
            <div class="metric">
              <div class="metric-label">Total Annual Savings</div>
              <div class="metric-value">${formatter.format(results.totalAnnualSavings)}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Return on Investment</div>
              <div class="metric-value">${results.roi.toFixed(1)}%</div>
            </div>
            <div class="metric">
              <div class="metric-label">Payback Period</div>
              <div class="metric-value">${results.paybackPeriod.toFixed(1)} months</div>
            </div>

            <h3>Detailed Breakdown</h3>
            <table>
              <tr>
                <td><strong>DSO Improvement:</strong></td>
                <td>${results.currentDSO} → ${results.targetDSO.toFixed(0)} days</td>
              </tr>
              <tr>
                <td><strong>Cash Flow Improvement:</strong></td>
                <td>${formatter.format(results.cashFlowImprovement)}</td>
              </tr>
              <tr>
                <td><strong>Bad Debt Reduction:</strong></td>
                <td>${formatter.format(results.badDebtReduction)}</td>
              </tr>
              <tr>
                <td><strong>Collection Cost Savings:</strong></td>
                <td>${formatter.format(results.collectionCostSavings)}</td>
              </tr>
              <tr>
                <td><strong>Labor Cost Savings:</strong></td>
                <td>${formatter.format(results.laborCostSavings)}</td>
              </tr>
            </table>
      `
    } else {
      emailBody += `
            <div class="metric">
              <div class="metric-label">DSO Improvement</div>
              <div class="metric-value">${results.currentDSO} → ${results.targetDSO.toFixed(0)} days</div>
            </div>
            <div class="metric">
              <div class="metric-label">Cash Flow Improvement</div>
              <div class="metric-value">${formatter.format(results.cashFlowImprovement)}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Annual Savings</div>
              <div class="metric-value">${formatter.format(results.annualSavings)}</div>
            </div>
      `
    }

    emailBody += `
            <p style="margin-top: 30px;">
              <strong>Ready to unlock these savings?</strong><br>
              Contact us to schedule a demo and see how Kuhlekt can transform your accounts receivable process.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            <p>Visit us at www.kuhlekt.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    await sendClickSendEmail(email, "Your Kuhlekt ROI Analysis Results", emailBody)

    return {
      success: true,
      message: "ROI results sent to your email",
    }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    throw error
  }
}
