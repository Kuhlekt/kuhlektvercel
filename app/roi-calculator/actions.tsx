"use server"

import { createClient } from "@/lib/supabase/server"

export interface SimpleROIResult {
  currentAnnualRevenue: number
  estimatedDSOReduction: number
  averageDSO: number
  newDSO: number
  cashFlowImprovement: number
  annualSavings: number
}

export interface DetailedROIResult extends SimpleROIResult {
  staffCostSavings: number
  collectionRateImprovement: number
  totalAnnualBenefit: number
  implementationCost: number
  netFirstYearBenefit: number
  paybackPeriod: number
  threeYearROI: number
}

async function sendClickSendEmail(to: string, subject: string, body: string): Promise<void> {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "support@kuhlekt.com"

  if (!username || !apiKey) {
    throw new Error("ClickSend credentials not configured")
  }

  const auth = Buffer.from(`${username}:${apiKey}`).toString("base64")

  // Get email_address_id from ClickSend API first
  const emailsResponse = await fetch("https://rest.clicksend.com/v3/email/addresses", {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  })

  if (!emailsResponse.ok) {
    throw new Error("Failed to fetch email addresses from ClickSend")
  }

  const emailsData = await emailsResponse.json()
  const emailAddress = emailsData.data?.data?.find((addr: any) => addr.email_address === fromEmail)

  if (!emailAddress) {
    throw new Error(`Email address ${fromEmail} not found in ClickSend account`)
  }

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: [
        {
          email_address: to,
          name: to.split("@")[0],
        },
      ],
      from: {
        email_address_id: emailAddress.email_address_id,
        name: "Kuhlekt",
      },
      subject: subject,
      body: body,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`ClickSend API error: ${JSON.stringify(error)}`)
  }
}

export async function calculateSimpleROI(formData: FormData): Promise<SimpleROIResult> {
  const currentAnnualRevenue = Number.parseFloat(formData.get("currentAnnualRevenue") as string) || 0
  const averageDSO = Number.parseFloat(formData.get("averageDSO") as string) || 0
  const estimatedDSOReduction = Number.parseFloat(formData.get("estimatedDSOReduction") as string) || 0

  const newDSO = averageDSO - estimatedDSOReduction
  const dailyRevenue = currentAnnualRevenue / 365
  const cashFlowImprovement = dailyRevenue * estimatedDSOReduction
  const annualSavings = cashFlowImprovement * 0.05

  return {
    currentAnnualRevenue,
    estimatedDSOReduction,
    averageDSO,
    newDSO,
    cashFlowImprovement,
    annualSavings,
  }
}

export async function calculateDetailedROI(formData: FormData): Promise<DetailedROIResult> {
  const simpleResult = await calculateSimpleROI(formData)

  const arStaffCount = Number.parseFloat(formData.get("arStaffCount") as string) || 0
  const avgStaffCost = Number.parseFloat(formData.get("avgStaffCost") as string) || 0
  const currentCollectionRate = Number.parseFloat(formData.get("currentCollectionRate") as string) || 0

  const staffCostSavings = arStaffCount * avgStaffCost * 0.3
  const collectionRateImprovement =
    (simpleResult.currentAnnualRevenue * (currentCollectionRate + 5)) / 100 -
    (simpleResult.currentAnnualRevenue * currentCollectionRate) / 100
  const totalAnnualBenefit = simpleResult.annualSavings + staffCostSavings + collectionRateImprovement
  const implementationCost = 50000
  const netFirstYearBenefit = totalAnnualBenefit - implementationCost
  const paybackPeriod = implementationCost / (totalAnnualBenefit / 12)
  const threeYearROI = ((totalAnnualBenefit * 3 - implementationCost) / implementationCost) * 100

  return {
    ...simpleResult,
    staffCostSavings,
    collectionRateImprovement,
    totalAnnualBenefit,
    implementationCost,
    netFirstYearBenefit,
    paybackPeriod,
    threeYearROI,
  }
}

export async function generateVerificationCode(
  email: string,
): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    const emailBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .code { font-size: 32px; font-weight: bold; color: #007bff; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Your Verification Code</h2>
            <p>Thank you for your interest in Kuhlekt's ROI Calculator.</p>
            <p>Your verification code is:</p>
            <div class="code">${code}</div>
            <p>This code will expire in 10 minutes.</p>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, "Your Kuhlekt Verification Code", emailBody)

    return { success: true, code }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate verification code",
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .single()

    if (fetchError || !data) {
      throw new Error("Invalid or expired verification code")
    }

    if (new Date(data.expires_at) < new Date()) {
      throw new Error("Verification code has expired")
    }

    const { error: updateError } = await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    if (updateError) {
      throw new Error("Failed to update verification code")
    }

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
  results: SimpleROIResult | DetailedROIResult,
  isDetailed: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const emailBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .result { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .label { font-weight: bold; color: #555; }
            .value { font-size: 20px; color: #007bff; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Your ROI Calculation Results</h2>
            <p>Thank you for using Kuhlekt's ROI Calculator. Here are your results:</p>
            
            <div class="result">
              <div class="label">Current Annual Revenue:</div>
              <div class="value">$${results.currentAnnualRevenue.toLocaleString()}</div>
            </div>
            
            <div class="result">
              <div class="label">Current DSO:</div>
              <div class="value">${results.averageDSO} days</div>
            </div>
            
            <div class="result">
              <div class="label">New DSO:</div>
              <div class="value">${results.newDSO} days</div>
            </div>
            
            <div class="result">
              <div class="label">Cash Flow Improvement:</div>
              <div class="value">$${results.cashFlowImprovement.toLocaleString()}</div>
            </div>
            
            <div class="result">
              <div class="label">Annual Savings:</div>
              <div class="value">$${results.annualSavings.toLocaleString()}</div>
            </div>
            
            ${
              isDetailed
                ? `
              <div class="result">
                <div class="label">Staff Cost Savings:</div>
                <div class="value">$${(results as DetailedROIResult).staffCostSavings.toLocaleString()}</div>
              </div>
              
              <div class="result">
                <div class="label">Total Annual Benefit:</div>
                <div class="value">$${(results as DetailedROIResult).totalAnnualBenefit.toLocaleString()}</div>
              </div>
              
              <div class="result">
                <div class="label">Three Year ROI:</div>
                <div class="value">${(results as DetailedROIResult).threeYearROI.toFixed(1)}%</div>
              </div>
            `
                : ""
            }
            
            <div class="footer">
              <p>Want to learn more? Contact us at support@kuhlekt.com</p>
              <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, "Your Kuhlekt ROI Calculation Results", emailBody)

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}
