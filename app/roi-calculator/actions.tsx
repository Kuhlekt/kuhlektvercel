"use server"

import { createClient } from "@/lib/supabase/server"

// ==================== ROI CALCULATION FUNCTIONS ====================

export async function calculateSimpleROI(data: {
  annualRevenue: number
  averageInvoiceValue: number
  currentDSO: number
}) {
  const { annualRevenue, averageInvoiceValue, currentDSO } = data

  // Calculate metrics
  const monthlyRevenue = annualRevenue / 12
  const invoicesPerMonth = monthlyRevenue / averageInvoiceValue
  const targetDSO = Math.max(currentDSO * 0.6, 15) // 40% reduction, minimum 15 days
  const dsoReduction = currentDSO - targetDSO
  const daysImprovement = dsoReduction
  const cashFlowImprovement = (monthlyRevenue / 30) * daysImprovement
  const annualSavings = cashFlowImprovement * 12

  return {
    currentDSO,
    targetDSO: Math.round(targetDSO),
    dsoReduction: Math.round(dsoReduction),
    cashFlowImprovement: Math.round(cashFlowImprovement),
    annualSavings: Math.round(annualSavings),
    invoicesPerMonth: Math.round(invoicesPerMonth),
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  averageInvoiceValue: number
  currentDSO: number
  numberOfInvoices: number
  badDebtPercentage: number
  collectionCosts: number
}) {
  const { annualRevenue, averageInvoiceValue, currentDSO, numberOfInvoices, badDebtPercentage, collectionCosts } = data

  // Calculate DSO improvement
  const monthlyRevenue = annualRevenue / 12
  const targetDSO = Math.max(currentDSO * 0.6, 15)
  const dsoReduction = currentDSO - targetDSO
  const cashFlowImprovement = (monthlyRevenue / 30) * dsoReduction

  // Calculate bad debt reduction
  const currentBadDebt = (annualRevenue * badDebtPercentage) / 100
  const targetBadDebtPercentage = badDebtPercentage * 0.4 // 60% reduction
  const targetBadDebt = (annualRevenue * targetBadDebtPercentage) / 100
  const badDebtReduction = currentBadDebt - targetBadDebt

  // Calculate collection cost savings
  const currentCollectionCost = collectionCosts
  const targetCollectionCost = collectionCosts * 0.5 // 50% reduction through automation
  const collectionCostSavings = currentCollectionCost - targetCollectionCost

  // Calculate staff time savings
  const hoursPerInvoice = 0.5 // Current manual processing time
  const totalHoursCurrently = numberOfInvoices * hoursPerInvoice
  const automatedHoursPerInvoice = 0.1 // With Kuhlekt automation
  const totalHoursWithKuhlekt = numberOfInvoices * automatedHoursPerInvoice
  const hoursSaved = totalHoursCurrently - totalHoursWithKuhlekt
  const averageHourlyRate = 35
  const staffTimeSavings = hoursSaved * averageHourlyRate

  // Calculate total annual savings
  const annualSavings = cashFlowImprovement * 12 + badDebtReduction + collectionCostSavings + staffTimeSavings

  // Calculate ROI
  const kuhlektAnnualCost = 12000 // Estimated annual cost
  const netBenefit = annualSavings - kuhlektAnnualCost
  const roi = ((netBenefit / kuhlektAnnualCost) * 100).toFixed(1)
  const paybackMonths = (kuhlektAnnualCost / (annualSavings / 12)).toFixed(1)

  return {
    currentDSO,
    targetDSO: Math.round(targetDSO),
    dsoReduction: Math.round(dsoReduction),
    cashFlowImprovement: Math.round(cashFlowImprovement),
    currentBadDebt: Math.round(currentBadDebt),
    targetBadDebt: Math.round(targetBadDebt),
    badDebtReduction: Math.round(badDebtReduction),
    currentCollectionCost: Math.round(currentCollectionCost),
    targetCollectionCost: Math.round(targetCollectionCost),
    collectionCostSavings: Math.round(collectionCostSavings),
    hoursSaved: Math.round(hoursSaved),
    staffTimeSavings: Math.round(staffTimeSavings),
    annualSavings: Math.round(annualSavings),
    roi,
    paybackMonths,
    kuhlektAnnualCost,
  }
}

// ==================== EMAIL HELPER FUNCTION ====================

async function sendClickSendEmail(to: string, subject: string, body: string): Promise<boolean> {
  try {
    const username = process.env.CLICKSEND_USERNAME
    const apiKey = process.env.CLICKSEND_API_KEY
    const emailAddressId = process.env.CLICKSEND_EMAIL_ADDRESS_ID

    if (!username || !apiKey || !emailAddressId) {
      console.error("ClickSend credentials not configured")
      return false
    }

    // Create Basic Auth token
    const authToken = Buffer.from(`${username}:${apiKey}`).toString("base64")

    // Parse email_address_id as integer
    const emailAddressIdInt = Number.parseInt(emailAddressId, 10)

    if (isNaN(emailAddressIdInt)) {
      console.error("Invalid CLICKSEND_EMAIL_ADDRESS_ID - must be a number")
      return false
    }

    const response = await fetch("https://rest.clicksend.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`,
      },
      body: JSON.stringify({
        to: [
          {
            email: to,
            name: to.split("@")[0],
          },
        ],
        from: {
          email_address_id: emailAddressIdInt,
          name: "Kuhlekt",
        },
        subject: subject,
        body: body,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ClickSend API error:", response.status, errorText)
      return false
    }

    const result = await response.json()
    console.log("ClickSend success:", result)
    return true
  } catch (error) {
    console.error("Error sending email via ClickSend:", error)
    return false
  }
}

// ==================== VERIFICATION CODE FUNCTIONS ====================

export async function generateVerificationCode(email: string) {
  try {
    const supabase = await createClient()

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in database with 10 minute expiration
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      throw new Error("Failed to generate verification code")
    }

    // Send email via ClickSend
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">Your Verification Code</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb; border-radius: 10px; margin-top: 20px;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Thank you for your interest in Kuhlekt! Use the code below to verify your email and access your ROI report:
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #667eea;">
              <h2 style="font-size: 32px; letter-spacing: 8px; color: #667eea; margin: 0;">${code}</h2>
            </div>
            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
              This code will expire in 10 minutes.
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
            <p>© 2025 Kuhlekt. All rights reserved.</p>
          </div>
        </body>
      </html>
    `

    const emailSent = await sendClickSendEmail(email, "Your Kuhlekt Verification Code", emailBody)

    if (!emailSent) {
      console.warn("Email sending failed, but verification code was stored")
      // Still return success since code is in database
    }

    console.log(`Verification code generated for ${email}: ${code}`)

    return { success: true }
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
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
      return { success: false, error: "Invalid or expired code" }
    }

    // Mark code as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, error: "Verification failed" }
  }
}

// ==================== ROI EMAIL FUNCTION ====================

export async function sendROIEmail(email: string, results: any, isDetailed: boolean) {
  try {
    let emailBody = ""

    if (isDetailed) {
      emailBody = `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: white; margin: 0;">Your Detailed ROI Analysis</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #667eea;">Executive Summary</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="font-size: 24px; color: #10b981; margin: 10px 0;">
                  <strong>Annual Savings: $${results.annualSavings.toLocaleString()}</strong>
                </p>
                <p style="font-size: 20px; color: #667eea; margin: 10px 0;">
                  <strong>ROI: ${results.roi}%</strong>
                </p>
                <p style="font-size: 16px; color: #6b7280;">
                  Payback Period: ${results.paybackMonths} months
                </p>
              </div>

              <h3 style="color: #667eea;">DSO Improvement</h3>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p><strong>Current DSO:</strong> ${results.currentDSO} days</p>
                <p><strong>Target DSO:</strong> ${results.targetDSO} days</p>
                <p><strong>Improvement:</strong> ${results.dsoReduction} days</p>
                <p><strong>Monthly Cash Flow Impact:</strong> $${results.cashFlowImprovement.toLocaleString()}</p>
              </div>

              <h3 style="color: #667eea;">Bad Debt Reduction</h3>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p><strong>Current Bad Debt:</strong> $${results.currentBadDebt.toLocaleString()}</p>
                <p><strong>Target Bad Debt:</strong> $${results.targetBadDebt.toLocaleString()}</p>
                <p><strong>Annual Savings:</strong> $${results.badDebtReduction.toLocaleString()}</p>
              </div>

              <h3 style="color: #667eea;">Operational Efficiency</h3>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p><strong>Collection Cost Savings:</strong> $${results.collectionCostSavings.toLocaleString()}</p>
                <p><strong>Staff Time Saved:</strong> ${results.hoursSaved.toLocaleString()} hours/year</p>
                <p><strong>Staff Cost Savings:</strong> $${results.staffTimeSavings.toLocaleString()}</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Schedule a Demo
              </a>
            </div>
          </body>
        </html>
      `
    } else {
      emailBody = `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: white; margin: 0;">Your ROI Analysis</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #667eea;">Your Potential Savings</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="font-size: 24px; color: #10b981; margin: 10px 0;">
                  <strong>Annual Savings: $${results.annualSavings.toLocaleString()}</strong>
                </p>
                <p style="font-size: 16px; color: #6b7280;">
                  Monthly Cash Flow Improvement: $${results.cashFlowImprovement.toLocaleString()}
                </p>
              </div>

              <h3 style="color: #667eea;">DSO Improvement</h3>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p><strong>Current DSO:</strong> ${results.currentDSO} days</p>
                <p><strong>Target DSO:</strong> ${results.targetDSO} days</p>
                <p><strong>Improvement:</strong> ${results.dsoReduction} days faster</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Schedule a Demo
              </a>
            </div>
          </body>
        </html>
      `
    }

    const emailSent = await sendClickSendEmail(email, "Your Kuhlekt ROI Analysis Results", emailBody)

    if (!emailSent) {
      console.warn("Failed to send ROI email")
      return { success: false, error: "Failed to send email" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return { success: false, error: "Failed to send email" }
  }
}
