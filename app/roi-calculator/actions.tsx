"use server"

import { createClient } from "@/lib/supabase/server"

// ROI Calculation Types
interface SimpleROIInputs {
  currentAR: number
  averageInvoiceValue: number
  collectionPeriod: number
}

interface DetailedROIInputs extends SimpleROIInputs {
  staffCost: number
  staffHours: number
  badDebtRate: number
  latePaymentRate: number
}

interface ROIResults {
  currentCosts: number
  projectedCosts: number
  annualSavings: number
  roi: number
  paybackPeriod: number
  additionalMetrics?: {
    timeRecovered: number
    reductionInBadDebt: number
    improvedCashFlow: number
  }
}

// Calculate Simple ROI
export async function calculateSimpleROI(inputs: SimpleROIInputs): Promise<ROIResults> {
  const { currentAR, averageInvoiceValue, collectionPeriod } = inputs

  // Simple ROI calculation
  const annualRevenue = (currentAR / collectionPeriod) * 365
  const currentCosts = annualRevenue * 0.03 // Assume 3% of revenue for manual collection
  const projectedCosts = 12000 // Annual subscription cost (example)
  const annualSavings = currentCosts - projectedCosts
  const roi = (annualSavings / projectedCosts) * 100
  const paybackPeriod = projectedCosts / (annualSavings / 12)

  return {
    currentCosts,
    projectedCosts,
    annualSavings,
    roi,
    paybackPeriod,
  }
}

// Calculate Detailed ROI
export async function calculateDetailedROI(inputs: DetailedROIInputs): Promise<ROIResults> {
  const { currentAR, averageInvoiceValue, collectionPeriod, staffCost, staffHours, badDebtRate, latePaymentRate } =
    inputs

  // Detailed ROI calculation
  const annualRevenue = (currentAR / collectionPeriod) * 365
  const manualCollectionCost = staffCost * staffHours * 52 // Annual staff cost
  const badDebtCost = currentAR * (badDebtRate / 100)
  const latePaymentCost = currentAR * (latePaymentRate / 100) * 0.02 // Assume 2% interest on late payments

  const currentCosts = manualCollectionCost + badDebtCost + latePaymentCost
  const projectedCosts = 12000 // Annual subscription cost
  const annualSavings = currentCosts - projectedCosts
  const roi = (annualSavings / projectedCosts) * 100
  const paybackPeriod = projectedCosts / (annualSavings / 12)

  // Additional metrics
  const timeRecovered = staffHours * 52 * 0.7 // Assume 70% time recovery
  const reductionInBadDebt = badDebtCost * 0.5 // Assume 50% reduction
  const improvedCashFlow = currentAR * 0.3 // Assume 30% improvement in cash flow

  return {
    currentCosts,
    projectedCosts,
    annualSavings,
    roi,
    paybackPeriod,
    additionalMetrics: {
      timeRecovered,
      reductionInBadDebt,
      improvedCashFlow,
    },
  }
}

// Generate Verification Code
export async function generateVerificationCode(
  email: string,
): Promise<{ success: boolean; message: string; code?: string }> {
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    // Store in Supabase
    const supabase = await createClient()
    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (insertError) {
      console.error("Supabase insert error:", insertError)
      return {
        success: false,
        message: `Failed to generate verification code: ${insertError.message}`,
        code, // Return code for testing even if DB insert fails
      }
    }

    // Send email via ClickSend
    if (process.env.CLICKSEND_USERNAME && process.env.CLICKSEND_API_KEY) {
      const auth = Buffer.from(`${process.env.CLICKSEND_USERNAME}:${process.env.CLICKSEND_API_KEY}`).toString("base64")

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .code-box { background: #f7fafc; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #667eea; }
            .content { padding: 20px; background: white; }
            .footer { text-align: center; padding: 20px; color: #718096; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Verification Code</h1>
            </div>
            <div class="content">
              <p>Thank you for your interest in our ROI Calculator!</p>
              <p>Please use the verification code below to access your results:</p>
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              <p><strong>This code will expire in 10 minutes.</strong></p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `

      const emailResponse = await fetch("https://rest.clicksend.com/v3/email/send", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address_id: process.env.CLICKSEND_EMAIL_ADDRESS_ID || "0",
          to: [{ email, name: email }],
          from: { email_address_id: process.env.CLICKSEND_EMAIL_ADDRESS_ID || "0" },
          subject: "Your ROI Calculator Verification Code",
          body: emailHtml,
        }),
      })

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text()
        console.error("ClickSend error:", errorText)
        console.log("Verification code (email failed):", code)
        return {
          success: true,
          message: "Verification code generated but email failed to send. Check console for code.",
          code,
        }
      }
    } else {
      console.log("Verification code (no email configured):", code)
      return {
        success: true,
        message: "Verification code generated. Check console for code (email not configured).",
        code,
      }
    }

    return { success: true, message: "Verification code sent to your email" }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to generate verification code",
    }
  }
}

// Verify Code
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
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !data) {
      return { success: false, message: "Invalid or expired verification code" }
    }

    // Mark as used
    const { error: updateError } = await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    if (updateError) {
      console.error("Error marking code as used:", updateError)
    }

    return { success: true, message: "Code verified successfully" }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to verify code",
    }
  }
}

// Send ROI Email
export async function sendROIEmail(
  email: string,
  results: ROIResults,
  isDetailed: boolean,
): Promise<{ success: boolean; message: string }> {
  try {
    if (!process.env.CLICKSEND_USERNAME || !process.env.CLICKSEND_API_KEY) {
      console.log("ROI Results (email not configured):", results)
      return { success: true, message: "Results calculated. Check console (email not configured)." }
    }

    const auth = Buffer.from(`${process.env.CLICKSEND_USERNAME}:${process.env.CLICKSEND_API_KEY}`).toString("base64")

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; background: white; }
          .metric { background: #f7fafc; border-left: 4px solid #667eea; padding: 15px; margin: 10px 0; }
          .metric-label { font-size: 14px; color: #718096; text-transform: uppercase; }
          .metric-value { font-size: 24px; font-weight: bold; color: #667eea; }
          .highlight { background: #e6fffa; border-left: 4px solid #38b2ac; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #718096; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your ROI Analysis Results</h1>
          </div>
          <div class="content">
            <p>Thank you for using our ROI Calculator. Here are your ${isDetailed ? "detailed" : "simple"} results:</p>
            
            <div class="metric">
              <div class="metric-label">Current Annual Costs</div>
              <div class="metric-value">${formatCurrency(results.currentCosts)}</div>
            </div>
            
            <div class="metric">
              <div class="metric-label">Projected Annual Costs with Kuhlekt</div>
              <div class="metric-value">${formatCurrency(results.projectedCosts)}</div>
            </div>
            
            <div class="highlight">
              <div class="metric-label">Annual Savings</div>
              <div class="metric-value">${formatCurrency(results.annualSavings)}</div>
            </div>
            
            <div class="metric">
              <div class="metric-label">Return on Investment</div>
              <div class="metric-value">${results.roi.toFixed(1)}%</div>
            </div>
            
            <div class="metric">
              <div class="metric-label">Payback Period</div>
              <div class="metric-value">${results.paybackPeriod.toFixed(1)} months</div>
            </div>
            
            ${
              isDetailed && results.additionalMetrics
                ? `
              <h3 style="margin-top: 30px; color: #667eea;">Additional Benefits</h3>
              
              <div class="metric">
                <div class="metric-label">Time Recovered (Hours/Year)</div>
                <div class="metric-value">${results.additionalMetrics.timeRecovered.toFixed(0)}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Reduction in Bad Debt</div>
                <div class="metric-value">${formatCurrency(results.additionalMetrics.reductionInBadDebt)}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Improved Cash Flow</div>
                <div class="metric-value">${formatCurrency(results.additionalMetrics.improvedCashFlow)}</div>
              </div>
            `
                : ""
            }
            
            <p style="margin-top: 30px;">Ready to transform your accounts receivable process? <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://kuhlekt.com"}" style="color: #667eea; text-decoration: none; font-weight: bold;">Get Started Today</a></p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Kuhlekt. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const emailResponse = await fetch("https://rest.clicksend.com/v3/email/send", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address_id: process.env.CLICKSEND_EMAIL_ADDRESS_ID || "0",
        to: [{ email, name: email }],
        from: { email_address_id: process.env.CLICKSEND_EMAIL_ADDRESS_ID || "0" },
        subject: "Your ROI Analysis Results - Kuhlekt",
        body: emailHtml,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error("ClickSend error:", errorText)
      return { success: false, message: "Failed to send ROI results email" }
    }

    return { success: true, message: "ROI results sent to your email" }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send ROI email",
    }
  }
}
