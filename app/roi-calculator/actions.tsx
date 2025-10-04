"use server"

import { createClient } from "@/lib/supabase/server"

// ROI Calculation Functions
export async function calculateSimpleROI(formData: FormData) {
  const monthlyInvoiceVolume = Number.parseFloat(formData.get("monthlyInvoiceVolume") as string)
  const averageInvoiceValue = Number.parseFloat(formData.get("averageInvoiceValue") as string)
  const currentDSO = Number.parseFloat(formData.get("currentDSO") as string)

  // Simple ROI calculations
  const annualRevenue = monthlyInvoiceVolume * averageInvoiceValue * 12
  const targetDSO = Math.max(currentDSO * 0.7, 30) // 30% improvement or minimum 30 days
  const dsoReduction = currentDSO - targetDSO
  const cashFlowImprovement = (annualRevenue / 365) * dsoReduction
  const estimatedAnnualSavings = cashFlowImprovement * 0.05 // 5% cost of capital

  return {
    monthlyInvoiceVolume,
    averageInvoiceValue,
    currentDSO,
    targetDSO,
    dsoReduction,
    cashFlowImprovement,
    estimatedAnnualSavings,
    annualRevenue,
  }
}

export async function calculateDetailedROI(formData: FormData) {
  const monthlyInvoiceVolume = Number.parseFloat(formData.get("monthlyInvoiceVolume") as string)
  const averageInvoiceValue = Number.parseFloat(formData.get("averageInvoiceValue") as string)
  const currentDSO = Number.parseFloat(formData.get("currentDSO") as string)
  const arTeamSize = Number.parseFloat(formData.get("arTeamSize") as string)
  const averageArSalary = Number.parseFloat(formData.get("averageArSalary") as string)
  const collectionRate = Number.parseFloat(formData.get("collectionRate") as string)

  // Detailed ROI calculations
  const annualRevenue = monthlyInvoiceVolume * averageInvoiceValue * 12
  const targetDSO = Math.max(currentDSO * 0.7, 30)
  const dsoReduction = currentDSO - targetDSO
  const cashFlowImprovement = (annualRevenue / 365) * dsoReduction
  const estimatedAnnualSavings = cashFlowImprovement * 0.05

  // Staff efficiency gains
  const currentArCost = arTeamSize * averageArSalary
  const expectedEfficiencyGain = 0.4 // 40% efficiency improvement
  const potentialStaffSavings = currentArCost * expectedEfficiencyGain

  // Collection improvements
  const targetCollectionRate = Math.min(collectionRate + 5, 98) // 5% improvement, max 98%
  const collectionImprovement = targetCollectionRate - collectionRate
  const additionalCollections = (annualRevenue * collectionImprovement) / 100

  // Total benefits
  const totalAnnualBenefit = estimatedAnnualSavings + potentialStaffSavings + additionalCollections

  // Estimated implementation cost (conservative estimate)
  const estimatedImplementationCost = 50000
  const roi = ((totalAnnualBenefit - estimatedImplementationCost) / estimatedImplementationCost) * 100
  const paybackPeriod = estimatedImplementationCost / (totalAnnualBenefit / 12)

  return {
    monthlyInvoiceVolume,
    averageInvoiceValue,
    currentDSO,
    targetDSO,
    dsoReduction,
    cashFlowImprovement,
    estimatedAnnualSavings,
    annualRevenue,
    arTeamSize,
    averageArSalary,
    currentArCost,
    potentialStaffSavings,
    collectionRate,
    targetCollectionRate,
    collectionImprovement,
    additionalCollections,
    totalAnnualBenefit,
    estimatedImplementationCost,
    roi,
    paybackPeriod,
  }
}

// Verification Code Functions
export async function generateVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

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
      return { success: false, message: "Failed to generate verification code" }
    }

    // Send email via ClickSend
    const clicksendUsername = process.env.CLICKSEND_USERNAME
    const clicksendApiKey = process.env.CLICKSEND_API_KEY
    const clicksendEmailAddressId = process.env.CLICKSEND_EMAIL_ADDRESS_ID

    if (!clicksendUsername || !clicksendApiKey || !clicksendEmailAddressId) {
      console.error("ClickSend credentials not configured")
      console.log("Verification code (for testing):", code)
      return { success: true, message: "Verification code generated (email not configured)" }
    }

    const authToken = Buffer.from(`${clicksendUsername}:${clicksendApiKey}`).toString("base64")

    const emailPayload = {
      from: {
        email_address_id: Number.parseInt(clicksendEmailAddressId),
        name: "Kuhlekt",
      },
      to: [
        {
          email: email,
          name: email.split("@")[0],
        },
      ],
      subject: "Your ROI Calculator Verification Code",
      body: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code { font-size: 32px; font-weight: bold; color: #667eea; text-align: center; padding: 20px; background: white; border-radius: 5px; margin: 20px 0; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verification Code</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for using the Kuhlekt ROI Calculator. Your verification code is:</p>
              <div class="code">${code}</div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
              <div class="footer">
                <p>© 2025 Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    const emailResponse = await fetch("https://rest.clicksend.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`,
      },
      body: JSON.stringify(emailPayload),
    })

    const emailData = await emailResponse.text()

    if (!emailResponse.ok) {
      console.error("ClickSend API error:", emailResponse.status, emailData)
      console.log("Verification code (for testing):", code)
      return { success: true, message: "Verification code generated (email delivery pending)" }
    }

    return { success: true, message: "Verification code sent successfully" }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return { success: false, message: "An error occurred while generating verification code" }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    // Get the verification code
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .single()

    if (error || !data) {
      return { success: false, message: "Invalid verification code" }
    }

    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
      return { success: false, message: "Verification code has expired" }
    }

    // Mark as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true, message: "Verification successful" }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, message: "An error occurred during verification" }
  }
}

// Email ROI Results Function
export async function sendROIEmail(
  email: string,
  results: any,
  calculationType: "simple" | "detailed",
): Promise<{ success: boolean; message: string }> {
  try {
    const clicksendUsername = process.env.CLICKSEND_USERNAME
    const clicksendApiKey = process.env.CLICKSEND_API_KEY
    const clicksendEmailAddressId = process.env.CLICKSEND_EMAIL_ADDRESS_ID

    if (!clicksendUsername || !clicksendApiKey || !clicksendEmailAddressId) {
      console.error("ClickSend credentials not configured")
      return { success: false, message: "Email service not configured" }
    }

    const authToken = Buffer.from(`${clicksendUsername}:${clicksendApiKey}`).toString("base64")

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }

    const formatNumber = (value: number, decimals = 0) => {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value)
    }

    let emailBody = ""

    if (calculationType === "simple") {
      emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .metric { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #667eea; }
            .metric-label { color: #666; font-size: 14px; margin-bottom: 5px; }
            .metric-value { font-size: 24px; font-weight: bold; color: #667eea; }
            .highlight { background: #667eea; color: white; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis Results</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
              
              <div class="metric">
                <div class="metric-label">Annual Revenue</div>
                <div class="metric-value">${formatCurrency(results.annualRevenue)}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Current DSO</div>
                <div class="metric-value">${formatNumber(results.currentDSO)} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Target DSO</div>
                <div class="metric-value">${formatNumber(results.targetDSO)} days</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">DSO Reduction</div>
                <div class="metric-value">${formatNumber(results.dsoReduction)} days</div>
              </div>
              
              <div class="highlight">
                <div class="metric-label" style="color: white;">Cash Flow Improvement</div>
                <div class="metric-value" style="color: white; font-size: 32px;">${formatCurrency(results.cashFlowImprovement)}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Estimated Annual Savings</div>
                <div class="metric-value">${formatCurrency(results.estimatedAnnualSavings)}</div>
              </div>
              
              <p style="margin-top: 30px;">Ready to unlock these savings? Contact us to learn how Kuhlekt can help optimize your accounts receivable.</p>
              
              <div class="footer">
                <p>© 2025 Kuhlekt. All rights reserved.</p>
                <p><a href="https://kuhlekt.com">Visit our website</a></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    } else {
      emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .section { margin: 20px 0; }
            .section-title { font-size: 20px; font-weight: bold; color: #667eea; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
            .metric { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
            .metric-label { color: #666; font-size: 14px; margin-bottom: 5px; }
            .metric-value { font-size: 20px; font-weight: bold; color: #667eea; }
            .highlight { background: #667eea; color: white; padding: 25px; border-radius: 5px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Detailed ROI Analysis</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for using the Kuhlekt ROI Calculator. Here is your comprehensive analysis:</p>
              
              <div class="section">
                <div class="section-title">Business Overview</div>
                <div class="metric">
                  <div class="metric-label">Annual Revenue</div>
                  <div class="metric-value">${formatCurrency(results.annualRevenue)}</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Monthly Invoice Volume</div>
                  <div class="metric-value">${formatNumber(results.monthlyInvoiceVolume)}</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Average Invoice Value</div>
                  <div class="metric-value">${formatCurrency(results.averageInvoiceValue)}</div>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">Cash Flow Impact</div>
                <div class="metric">
                  <div class="metric-label">Current DSO</div>
                  <div class="metric-value">${formatNumber(results.currentDSO)} days</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Target DSO</div>
                  <div class="metric-value">${formatNumber(results.targetDSO)} days</div>
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
                  <div class="metric-label">Annual Savings (5% cost of capital)</div>
                  <div class="metric-value">${formatCurrency(results.estimatedAnnualSavings)}</div>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">Operational Efficiency</div>
                <div class="metric">
                  <div class="metric-label">AR Team Size</div>
                  <div class="metric-value">${formatNumber(results.arTeamSize)}</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Current AR Cost</div>
                  <div class="metric-value">${formatCurrency(results.currentArCost)}</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Potential Staff Savings (40% efficiency gain)</div>
                  <div class="metric-value">${formatCurrency(results.potentialStaffSavings)}</div>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">Collection Performance</div>
                <div class="metric">
                  <div class="metric-label">Current Collection Rate</div>
                  <div class="metric-value">${formatNumber(results.collectionRate, 1)}%</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Target Collection Rate</div>
                  <div class="metric-value">${formatNumber(results.targetCollectionRate, 1)}%</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Additional Collections</div>
                  <div class="metric-value">${formatCurrency(results.additionalCollections)}</div>
                </div>
              </div>
              
              <div class="highlight">
                <div class="metric-label" style="color: white;">Total Annual Benefit</div>
                <div class="metric-value" style="color: white; font-size: 36px;">${formatCurrency(results.totalAnnualBenefit)}</div>
              </div>
              
              <div class="section">
                <div class="section-title">Investment Analysis</div>
                <div class="metric">
                  <div class="metric-label">Estimated Implementation Cost</div>
                  <div class="metric-value">${formatCurrency(results.estimatedImplementationCost)}</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Return on Investment (ROI)</div>
                  <div class="metric-value">${formatNumber(results.roi, 1)}%</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Payback Period</div>
                  <div class="metric-value">${formatNumber(results.paybackPeriod, 1)} months</div>
                </div>
              </div>
              
              <p style="margin-top: 30px;">Ready to transform your accounts receivable? Contact us today to discuss how Kuhlekt can help you achieve these results.</p>
              
              <div class="footer">
                <p>© 2025 Kuhlekt. All rights reserved.</p>
                <p><a href="https://kuhlekt.com">Visit our website</a></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const emailPayload = {
      from: {
        email_address_id: Number.parseInt(clicksendEmailAddressId),
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
    }

    const emailResponse = await fetch("https://rest.clicksend.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`,
      },
      body: JSON.stringify(emailPayload),
    })

    const emailData = await emailResponse.text()

    if (!emailResponse.ok) {
      console.error("ClickSend API error:", emailResponse.status, emailData)
      return { success: false, message: "Failed to send ROI results email" }
    }

    return { success: true, message: "ROI results sent successfully" }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return { success: false, message: "An error occurred while sending ROI results" }
  }
}
