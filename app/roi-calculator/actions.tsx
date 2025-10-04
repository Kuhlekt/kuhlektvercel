"use server"

import { createClient } from "@/lib/supabase/server"

interface SimpleROICalculation {
  currentDSO: number
  targetDSO: number
  annualRevenue: number
  dsoImprovement: number
  dsoImprovementPercentage: number
  cashReleased: number
  monthlyBenefit: number
  threeYearBenefit: number
}

interface DetailedROICalculation {
  currentMetrics: {
    dso: number
    collectionEffectiveness: number
    badDebtRatio: number
    costPerInvoice: number
  }
  projectedMetrics: {
    dso: number
    collectionEffectiveness: number
    badDebtRatio: number
    costPerInvoice: number
  }
  improvements: {
    dsoReduction: number
    dsoReductionPercentage: number
    ceIncrease: number
    badDebtReduction: number
    costSavingsPerInvoice: number
  }
  financialImpact: {
    cashReleased: number
    annualSavings: number
    badDebtRecovery: number
    totalFirstYearBenefit: number
    threeYearBenefit: number
    roi: number
    paybackPeriod: number
  }
}

export async function calculateSimpleROI(
  currentDSO: number,
  targetDSO: number,
  annualRevenue: number,
): Promise<SimpleROICalculation> {
  const dsoImprovement = currentDSO - targetDSO
  const dsoImprovementPercentage = (dsoImprovement / currentDSO) * 100
  const dailyRevenue = annualRevenue / 365
  const cashReleased = dailyRevenue * dsoImprovement
  const monthlyBenefit = cashReleased / 12
  const threeYearBenefit = cashReleased * 3

  return {
    currentDSO,
    targetDSO,
    annualRevenue,
    dsoImprovement,
    dsoImprovementPercentage,
    cashReleased,
    monthlyBenefit,
    threeYearBenefit,
  }
}

export async function calculateDetailedROI(
  annualRevenue: number,
  currentDSO: number,
  currentCE: number,
  currentBadDebt: number,
  monthlyInvoiceVolume: number,
  currentCostPerInvoice: number,
  estimatedImplementationCost: number,
): Promise<DetailedROICalculation> {
  // Projected improvements with Kuhlekt
  const projectedDSO = Math.max(currentDSO * 0.6, 15) // 40% improvement, minimum 15 days
  const projectedCE = Math.min(currentCE * 1.25, 98) // 25% improvement, max 98%
  const projectedBadDebt = currentBadDebt * 0.5 // 50% reduction
  const projectedCostPerInvoice = currentCostPerInvoice * 0.4 // 60% cost reduction

  // Calculate improvements
  const dsoReduction = currentDSO - projectedDSO
  const dsoReductionPercentage = (dsoReduction / currentDSO) * 100
  const ceIncrease = projectedCE - currentCE
  const badDebtReduction = currentBadDebt - projectedBadDebt
  const costSavingsPerInvoice = currentCostPerInvoice - projectedCostPerInvoice

  // Financial impact calculations
  const dailyRevenue = annualRevenue / 365
  const cashReleased = dailyRevenue * dsoReduction
  const annualInvoiceVolume = monthlyInvoiceVolume * 12
  const annualSavings = costSavingsPerInvoice * annualInvoiceVolume
  const badDebtRecovery = (annualRevenue * badDebtReduction) / 100
  const totalFirstYearBenefit = cashReleased + annualSavings + badDebtRecovery
  const threeYearBenefit = (annualSavings + badDebtRecovery) * 3 + cashReleased
  const roi = ((threeYearBenefit - estimatedImplementationCost) / estimatedImplementationCost) * 100
  const paybackPeriod = estimatedImplementationCost / (totalFirstYearBenefit / 12)

  return {
    currentMetrics: {
      dso: currentDSO,
      collectionEffectiveness: currentCE,
      badDebtRatio: currentBadDebt,
      costPerInvoice: currentCostPerInvoice,
    },
    projectedMetrics: {
      dso: projectedDSO,
      collectionEffectiveness: projectedCE,
      badDebtRatio: projectedBadDebt,
      costPerInvoice: projectedCostPerInvoice,
    },
    improvements: {
      dsoReduction,
      dsoReductionPercentage,
      ceIncrease,
      badDebtReduction,
      costSavingsPerInvoice,
    },
    financialImpact: {
      cashReleased,
      annualSavings,
      badDebtRecovery,
      totalFirstYearBenefit,
      threeYearBenefit,
      roi,
      paybackPeriod,
    },
  }
}

async function sendClickSendEmail(to: string, subject: string, body: string): Promise<void> {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "noreply@kuhlekt.com"

  if (!username || !apiKey) {
    throw new Error("ClickSend credentials not configured")
  }

  // First, fetch the list of verified email addresses to get the email_address_id
  const listResponse = await fetch("https://rest.clicksend.com/v3/email/addresses", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${username}:${apiKey}`).toString("base64"),
    },
  })

  if (!listResponse.ok) {
    const errorText = await listResponse.text()
    throw new Error(`Failed to fetch email addresses: ${listResponse.status} - ${errorText}`)
  }

  const listData = await listResponse.json()

  // Find the matching email address
  const emailAddress = listData.data?.data?.find(
    (addr: any) => addr.email_address.toLowerCase() === fromEmail.toLowerCase(),
  )

  if (!emailAddress) {
    throw new Error(`Email address ${fromEmail} not found in verified addresses. Please verify it in ClickSend first.`)
  }

  const emailAddressId = emailAddress.email_address_id

  // Now send the email with the correct email_address_id
  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${username}:${apiKey}`).toString("base64"),
    },
    body: JSON.stringify({
      to: [{ email: to, name: "" }],
      from: {
        email_address_id: emailAddressId,
        name: "Kuhlekt",
      },
      subject: subject,
      body: body,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to send email via ClickSend: ${response.status} - ${errorText}`)
  }
}

export async function generateVerificationCode(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in database with 10-minute expiration
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return { success: false, error: "Failed to generate verification code" }
    }

    // Send verification code via ClickSend
    const emailSubject = "Your Kuhlekt ROI Calculator Verification Code"
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Your Verification Code</h2>
            <p>Thank you for using the Kuhlekt ROI Calculator.</p>
            <p>Your verification code is:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
              ${code}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="font-size: 12px; color: #6b7280;">
              This is an automated message from Kuhlekt. Please do not reply to this email.
            </p>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, emailSubject, emailBody)

    return { success: true }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send verification code",
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Find valid, unused code
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

    // Mark code as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, error: "Failed to verify code" }
  }
}

export async function sendROIEmail(
  email: string,
  companyName: string,
  contactName: string,
  roiData: DetailedROICalculation,
): Promise<{ success: boolean; error?: string }> {
  try {
    const emailSubject = `Your Kuhlekt ROI Analysis Report - ${companyName}`
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">
              ROI Analysis Report
            </h1>
            
            <p>Dear ${contactName},</p>
            <p>Thank you for your interest in Kuhlekt's Accounts Receivable Management Solution. Below is your personalized ROI analysis for ${companyName}.</p>
            
            <h2 style="color: #1e40af; margin-top: 30px;">Current Performance Metrics</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Days Sales Outstanding (DSO)</strong></td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${roiData.currentMetrics.dso.toFixed(1)} days</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Collection Effectiveness</strong></td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${roiData.currentMetrics.collectionEffectiveness.toFixed(1)}%</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Bad Debt Ratio</strong></td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${roiData.currentMetrics.badDebtRatio.toFixed(2)}%</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Cost Per Invoice</strong></td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">$${roiData.currentMetrics.costPerInvoice.toFixed(2)}</td>
              </tr>
            </table>

            <h2 style="color: #1e40af; margin-top: 30px;">Projected Performance with Kuhlekt</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #dbeafe;">
                <td style="padding: 12px; border: 1px solid #93c5fd;"><strong>Days Sales Outstanding (DSO)</strong></td>
                <td style="padding: 12px; border: 1px solid #93c5fd;">${roiData.projectedMetrics.dso.toFixed(1)} days</td>
                <td style="padding: 12px; border: 1px solid #93c5fd; color: #059669;"><strong>↓ ${roiData.improvements.dsoReduction.toFixed(1)} days (${roiData.improvements.dsoReductionPercentage.toFixed(1)}%)</strong></td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Collection Effectiveness</strong></td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${roiData.projectedMetrics.collectionEffectiveness.toFixed(1)}%</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; color: #059669;"><strong>↑ ${roiData.improvements.ceIncrease.toFixed(1)}%</strong></td>
              </tr>
              <tr style="background-color: #dbeafe;">
                <td style="padding: 12px; border: 1px solid #93c5fd;"><strong>Bad Debt Ratio</strong></td>
                <td style="padding: 12px; border: 1px solid #93c5fd;">${roiData.projectedMetrics.badDebtRatio.toFixed(2)}%</td>
                <td style="padding: 12px; border: 1px solid #93c5fd; color: #059669;"><strong>↓ ${roiData.improvements.badDebtReduction.toFixed(2)}%</strong></td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Cost Per Invoice</strong></td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">$${roiData.projectedMetrics.costPerInvoice.toFixed(2)}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; color: #059669;"><strong>↓ $${roiData.improvements.costSavingsPerInvoice.toFixed(2)}</strong></td>
              </tr>
            </table>

            <h2 style="color: #1e40af; margin-top: 30px;">Financial Impact</h2>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin: 20px 0;">
              <h3 style="margin-top: 0; font-size: 24px;">3-Year Total Benefit</h3>
              <p style="font-size: 48px; font-weight: bold; margin: 20px 0;">$${roiData.financialImpact.threeYearBenefit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Cash Released (One-Time)</strong></td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">$${roiData.financialImpact.cashReleased.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Annual Process Savings</strong></td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">$${roiData.financialImpact.annualSavings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Bad Debt Recovery (Annual)</strong></td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">$${roiData.financialImpact.badDebtRecovery.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>First Year Total Benefit</strong></td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; font-weight: bold;">$${roiData.financialImpact.totalFirstYearBenefit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
              </tr>
              <tr style="background-color: #dcfce7;">
                <td style="padding: 12px; border: 1px solid #86efac;"><strong>Return on Investment (ROI)</strong></td>
                <td style="padding: 12px; border: 1px solid #86efac; text-align: right; font-weight: bold; color: #059669;">${roiData.financialImpact.roi.toFixed(0)}%</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Payback Period</strong></td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; font-weight: bold;">${roiData.financialImpact.paybackPeriod.toFixed(1)} months</td>
              </tr>
            </table>

            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0;">
              <p style="margin: 0;"><strong>Note:</strong> This analysis is based on industry benchmarks and typical improvements seen with Kuhlekt implementations. Actual results may vary based on your specific circumstances.</p>
            </div>

            <h2 style="color: #1e40af; margin-top: 30px;">Next Steps</h2>
            <ol style="line-height: 2;">
              <li>Review this analysis with your finance team</li>
              <li>Schedule a personalized demo to see Kuhlekt in action</li>
              <li>Discuss implementation timeline and customization options</li>
              <li>Start your journey to improved cash flow and efficiency</li>
            </ol>

            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" 
                 style="display: inline-block; background-color: #2563eb; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">
                Schedule Your Demo
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0;">
            
            <p style="font-size: 14px; color: #6b7280;">
              Questions? Contact us at <a href="mailto:info@kuhlekt.com" style="color: #2563eb;">info@kuhlekt.com</a> or visit our website at <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #2563eb;">kuhlekt.com</a>
            </p>
            
            <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
              © ${new Date().getFullYear()} Kuhlekt. All rights reserved.<br>
              This email was sent to ${email} as part of your ROI analysis request.
            </p>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, emailSubject, emailBody)

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send ROI report",
    }
  }
}
