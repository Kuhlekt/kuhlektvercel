"use server"

import { createClient } from "@/lib/supabase/server"

// ROI Calculation Functions
export async function calculateSimpleROI(formData: {
  currentRevenue: number
  averageDSO: number
  averageInvoiceValue: number
}) {
  const { currentRevenue, averageDSO, averageInvoiceValue } = formData

  // Calculate potential improvements
  const dsoReduction = Math.round(averageDSO * 0.3) // 30% reduction
  const newDSO = averageDSO - dsoReduction

  // Calculate cash flow improvement
  const dailyRevenue = currentRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction

  // Calculate collection rate improvement (assume 5% improvement)
  const collectionRateImprovement = currentRevenue * 0.05

  // Total annual savings
  const annualSavings = cashFlowImprovement + collectionRateImprovement

  // ROI calculation (assume $50k annual cost)
  const annualCost = 50000
  const roi = ((annualSavings - annualCost) / annualCost) * 100
  const paybackPeriod = annualCost / (annualSavings / 12)

  return {
    dsoReduction,
    newDSO,
    cashFlowImprovement: Math.round(cashFlowImprovement),
    collectionRateImprovement: Math.round(collectionRateImprovement),
    annualSavings: Math.round(annualSavings),
    roi: Math.round(roi),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
  }
}

export async function calculateDetailedROI(formData: {
  currentRevenue: number
  averageDSO: number
  averageInvoiceValue: number
  collectionCosts: number
  badDebtRate: number
  invoiceVolume: number
}) {
  const { currentRevenue, averageDSO, averageInvoiceValue, collectionCosts, badDebtRate, invoiceVolume } = formData

  // Calculate DSO improvement
  const dsoReduction = Math.round(averageDSO * 0.35) // 35% reduction for detailed
  const newDSO = averageDSO - dsoReduction

  // Calculate cash flow improvement
  const dailyRevenue = currentRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction

  // Calculate collection cost savings (assume 40% reduction)
  const collectionCostSavings = collectionCosts * 0.4

  // Calculate bad debt reduction (assume 30% improvement)
  const badDebtAmount = currentRevenue * (badDebtRate / 100)
  const badDebtReduction = badDebtAmount * 0.3

  // Calculate efficiency gains from automation
  const timeSpentPerInvoice = 15 // minutes
  const timeSavingsPerInvoice = timeSpentPerInvoice * 0.7 // 70% time saving
  const annualTimeSavings = (invoiceVolume * timeSavingsPerInvoice) / 60 // hours
  const costPerHour = 50
  const laborSavings = annualTimeSavings * costPerHour

  // Total annual savings
  const annualSavings = cashFlowImprovement + collectionCostSavings + badDebtReduction + laborSavings

  // ROI calculation
  const annualCost = 75000 // Higher tier for detailed analysis
  const roi = ((annualSavings - annualCost) / annualCost) * 100
  const paybackPeriod = annualCost / (annualSavings / 12)

  return {
    dsoReduction,
    newDSO,
    cashFlowImprovement: Math.round(cashFlowImprovement),
    collectionCostSavings: Math.round(collectionCostSavings),
    badDebtReduction: Math.round(badDebtReduction),
    laborSavings: Math.round(laborSavings),
    annualSavings: Math.round(annualSavings),
    roi: Math.round(roi),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
  }
}

// Helper function to send email via ClickSend
async function sendClickSendEmail(to: string, subject: string, htmlBody: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_EMAIL_ADDRESS_ID || "support@kuhlekt.com"

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
    body: htmlBody,
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
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error("ClickSend API error:", {
      status: response.status,
      body: errorBody,
    })
    throw new Error(
      `fetch to https://rest.clicksend.com/v3/email/send failed with status ${response.status} and body: ${errorBody}`,
    )
  }

  const result = await response.json()
  console.log("ClickSend response:", result)
  return result
}

// Generate and send verification code
export async function generateVerificationCode(email: string) {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const supabase = await createClient()

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      throw insertError
    }

    // Send verification email
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
            .code { font-size: 32px; font-weight: bold; color: #2563eb; text-align: center; letter-spacing: 5px; margin: 20px 0; padding: 15px; background-color: white; border-radius: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Verification Code</h1>
            </div>
            <div class="content">
              <p>Thank you for your interest in Kuhlekt's ROI Calculator!</p>
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
      await sendClickSendEmail(email, "Your Kuhlekt ROI Calculator Verification Code", htmlBody)
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      // Return code anyway for testing
      return { success: true, code, message: "Code generated but email failed" }
    }

    return { success: true, message: "Verification code sent successfully" }
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to generate verification code")
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
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return { success: false, message: "Invalid or expired code" }
    }

    // Mark code as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true, message: "Code verified successfully" }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, message: "Verification failed" }
  }
}

// Send ROI results via email
export async function sendROIEmail(email: string, results: any, isDetailed: boolean) {
  try {
    const htmlBody = isDetailed
      ? `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
            .result { margin: 15px 0; padding: 15px; background-color: white; border-radius: 5px; border-left: 4px solid #2563eb; }
            .result-label { font-weight: bold; color: #6b7280; }
            .result-value { font-size: 24px; color: #2563eb; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Detailed ROI Analysis</h1>
            </div>
            <div class="content">
              <p>Thank you for using Kuhlekt's ROI Calculator. Here are your detailed results:</p>
              
              <div class="result">
                <div class="result-label">DSO Reduction</div>
                <div class="result-value">${results.dsoReduction} days</div>
              </div>
              
              <div class="result">
                <div class="result-label">New DSO</div>
                <div class="result-value">${results.newDSO} days</div>
              </div>
              
              <div class="result">
                <div class="result-label">Cash Flow Improvement</div>
                <div class="result-value">$${results.cashFlowImprovement.toLocaleString()}</div>
              </div>
              
              <div class="result">
                <div class="result-label">Collection Cost Savings</div>
                <div class="result-value">$${results.collectionCostSavings.toLocaleString()}</div>
              </div>
              
              <div class="result">
                <div class="result-label">Bad Debt Reduction</div>
                <div class="result-value">$${results.badDebtReduction.toLocaleString()}</div>
              </div>
              
              <div class="result">
                <div class="result-label">Labor Savings</div>
                <div class="result-value">$${results.laborSavings.toLocaleString()}</div>
              </div>
              
              <div class="result">
                <div class="result-label">Total Annual Savings</div>
                <div class="result-value">$${results.annualSavings.toLocaleString()}</div>
              </div>
              
              <div class="result">
                <div class="result-label">ROI</div>
                <div class="result-value">${results.roi}%</div>
              </div>
              
              <div class="result">
                <div class="result-label">Payback Period</div>
                <div class="result-value">${results.paybackPeriod} months</div>
              </div>
              
              <p style="margin-top: 30px;">Ready to achieve these results? <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo">Schedule a demo</a> to learn more.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
      : `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
            .result { margin: 15px 0; padding: 15px; background-color: white; border-radius: 5px; border-left: 4px solid #2563eb; }
            .result-label { font-weight: bold; color: #6b7280; }
            .result-value { font-size: 24px; color: #2563eb; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis</h1>
            </div>
            <div class="content">
              <p>Thank you for using Kuhlekt's ROI Calculator. Here are your results:</p>
              
              <div class="result">
                <div class="result-label">DSO Reduction</div>
                <div class="result-value">${results.dsoReduction} days</div>
              </div>
              
              <div class="result">
                <div class="result-label">New DSO</div>
                <div class="result-value">${results.newDSO} days</div>
              </div>
              
              <div class="result">
                <div class="result-label">Cash Flow Improvement</div>
                <div class="result-value">$${results.cashFlowImprovement.toLocaleString()}</div>
              </div>
              
              <div class="result">
                <div class="result-label">Collection Rate Improvement</div>
                <div class="result-value">$${results.collectionRateImprovement.toLocaleString()}</div>
              </div>
              
              <div class="result">
                <div class="result-label">Total Annual Savings</div>
                <div class="result-value">$${results.annualSavings.toLocaleString()}</div>
              </div>
              
              <div class="result">
                <div class="result-label">ROI</div>
                <div class="result-value">${results.roi}%</div>
              </div>
              
              <div class="result">
                <div class="result-label">Payback Period</div>
                <div class="result-value">${results.paybackPeriod} months</div>
              </div>
              
              <p style="margin-top: 30px;">Ready to achieve these results? <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo">Schedule a demo</a> to learn more.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, "Your Kuhlekt ROI Calculator Results", htmlBody)

    return { success: true, message: "ROI results sent successfully" }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    throw new Error("Failed to send ROI results")
  }
}
