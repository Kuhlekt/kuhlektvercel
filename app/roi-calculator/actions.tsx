"use server"

import { createClient } from "@/lib/supabase/server"

interface SimpleROIInputs {
  monthlyRevenue: number
  currentDSO: number
  targetDSO: number
}

interface DetailedROIInputs {
  annualRevenue: number
  currentDSO: number
  invoiceVolume: number
  avgInvoiceValue: number
  collectionCosts: number
}

interface ROIResult {
  annualSavings: number
  cashFlowImprovement: number
  timeToROI: number
  details: {
    currentCashCycle: number
    improvedCashCycle: number
    workingCapitalGain: number
    efficiencyGain: number
  }
}

export async function calculateSimpleROI(inputs: SimpleROIInputs): Promise<ROIResult> {
  const { monthlyRevenue, currentDSO, targetDSO } = inputs

  const dsoReduction = currentDSO - targetDSO
  const dailyRevenue = monthlyRevenue / 30
  const cashFlowImprovement = dailyRevenue * dsoReduction
  const annualSavings = cashFlowImprovement * 12

  return {
    annualSavings,
    cashFlowImprovement,
    timeToROI: 3, // months
    details: {
      currentCashCycle: currentDSO,
      improvedCashCycle: targetDSO,
      workingCapitalGain: cashFlowImprovement,
      efficiencyGain: (dsoReduction / currentDSO) * 100,
    },
  }
}

export async function calculateDetailedROI(inputs: DetailedROIInputs): Promise<ROIResult> {
  const { annualRevenue, currentDSO, invoiceVolume, avgInvoiceValue, collectionCosts } = inputs

  const targetDSO = Math.max(currentDSO * 0.6, 15) // 40% improvement or 15 days minimum
  const dsoReduction = currentDSO - targetDSO

  const dailyRevenue = annualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoReduction

  const automationSavings = collectionCosts * 0.7 // 70% reduction in collection costs
  const annualSavings = cashFlowImprovement * 12 + automationSavings

  return {
    annualSavings,
    cashFlowImprovement,
    timeToROI: 4, // months
    details: {
      currentCashCycle: currentDSO,
      improvedCashCycle: targetDSO,
      workingCapitalGain: cashFlowImprovement,
      efficiencyGain: (dsoReduction / currentDSO) * 100,
    },
  }
}

async function sendClickSendEmail(to: string, subject: string, body: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "noreply@kuhlekt.com"
  const emailAddressId = Number.parseInt(process.env.CLICKSEND_EMAIL_ADDRESS_ID || "0")

  if (!username || !apiKey) {
    throw new Error("ClickSend credentials not configured")
  }

  if (!emailAddressId || emailAddressId === 0) {
    throw new Error("ClickSend email address ID not configured")
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
      email_address_id: emailAddressId,
      name: "Kuhlekt",
    },
    subject,
    body,
  }

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Failed to send email via ClickSend: ${response.status} ${response.statusText} - ${errorBody}`)
  }

  return await response.json()
}

export async function generateVerificationCode(email: string) {
  try {
    const supabase = await createClient()

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Store in database
    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      throw new Error("Failed to generate verification code")
    }

    // Send email with code
    const emailSubject = "Your Kuhlekt ROI Calculator Verification Code"
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Your Verification Code</h2>
            <p>Thank you for using the Kuhlekt ROI Calculator!</p>
            <p>Your verification code is:</p>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${code}
            </div>
            <p>This code will expire in 15 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #6b7280;">
              © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
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
      return { success: false, error: "Invalid or expired verification code" }
    }

    // Mark code as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify code",
    }
  }
}

export async function sendROIEmail(
  email: string,
  name: string,
  company: string,
  roiData: ROIResult,
  inputs: SimpleROIInputs | DetailedROIInputs,
) {
  try {
    const emailSubject = `Your Kuhlekt ROI Analysis - ${company}`
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Your ROI Analysis Results</h1>
            <p>Hi ${name},</p>
            <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Key Findings</h2>
              <p><strong>Annual Savings:</strong> $${roiData.annualSavings.toLocaleString()}</p>
              <p><strong>Cash Flow Improvement:</strong> $${roiData.cashFlowImprovement.toLocaleString()}</p>
              <p><strong>Time to ROI:</strong> ${roiData.timeToROI} months</p>
            </div>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Detailed Analysis</h2>
              <p><strong>Current Cash Cycle:</strong> ${roiData.details.currentCashCycle} days</p>
              <p><strong>Improved Cash Cycle:</strong> ${roiData.details.improvedCashCycle} days</p>
              <p><strong>Working Capital Gain:</strong> $${roiData.details.workingCapitalGain.toLocaleString()}</p>
              <p><strong>Efficiency Gain:</strong> ${roiData.details.efficiencyGain.toFixed(1)}%</p>
            </div>

            <p>Ready to transform your accounts receivable process? Our team is here to help you achieve these results.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://kuhlekt.com/demo" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Schedule a Demo</a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #6b7280;">
              © ${new Date().getFullYear()} Kuhlekt. All rights reserved.<br>
              This analysis is based on the information you provided and industry benchmarks.
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
