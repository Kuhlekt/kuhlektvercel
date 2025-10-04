"use server"

import { createClient } from "@/lib/supabase/server"

interface SimpleROIResult {
  monthlySavings: number
  annualSavings: number
  roi: number
  paybackMonths: number
}

interface DetailedROIResult {
  currentCosts: {
    laborCosts: number
    softwareCosts: number
    errorCosts: number
    opportunityCosts: number
    total: number
  }
  withKuhlekt: {
    laborCosts: number
    softwareCosts: number
    errorCosts: number
    opportunityCosts: number
    total: number
  }
  savings: {
    monthly: number
    annual: number
    threeYear: number
  }
  roi: {
    percentage: number
    paybackMonths: number
  }
}

export async function calculateSimpleROI(
  monthlyInvoices: number,
  avgProcessingTime: number,
  hourlyRate: number,
): Promise<SimpleROIResult> {
  const currentMonthlyCost = monthlyInvoices * (avgProcessingTime / 60) * hourlyRate
  const kuhlektMonthlyCost = monthlyInvoices * (5 / 60) * hourlyRate + 299
  const monthlySavings = currentMonthlyCost - kuhlektMonthlyCost
  const annualSavings = monthlySavings * 12
  const roi = (annualSavings / 3588) * 100
  const paybackMonths = 3588 / monthlySavings

  return {
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    roi: Math.round(roi),
    paybackMonths: Math.round(paybackMonths * 10) / 10,
  }
}

export async function calculateDetailedROI(
  employees: number,
  avgSalary: number,
  hoursPerWeek: number,
  currentSoftwareCost: number,
  errorRate: number,
  avgInvoiceValue: number,
): Promise<DetailedROIResult> {
  const weeksPerYear = 52
  const annualLaborCost = employees * avgSalary * (hoursPerWeek / 40)
  const annualErrorCost = (errorRate / 100) * avgInvoiceValue * 12
  const annualOpportunityCost = employees * 10000

  const currentTotal = annualLaborCost + currentSoftwareCost + annualErrorCost + annualOpportunityCost

  const kuhlektLaborCost = annualLaborCost * 0.3
  const kuhlektSoftwareCost = 3588
  const kuhlektErrorCost = annualErrorCost * 0.1
  const kuhlektOpportunityCost = annualOpportunityCost * 0.5

  const kuhlektTotal = kuhlektLaborCost + kuhlektSoftwareCost + kuhlektErrorCost + kuhlektOpportunityCost

  const annualSavings = currentTotal - kuhlektTotal
  const monthlySavings = annualSavings / 12
  const threeYearSavings = annualSavings * 3

  const roi = (annualSavings / kuhlektSoftwareCost) * 100
  const paybackMonths = kuhlektSoftwareCost / monthlySavings

  return {
    currentCosts: {
      laborCosts: Math.round(annualLaborCost),
      softwareCosts: Math.round(currentSoftwareCost),
      errorCosts: Math.round(annualErrorCost),
      opportunityCosts: Math.round(annualOpportunityCost),
      total: Math.round(currentTotal),
    },
    withKuhlekt: {
      laborCosts: Math.round(kuhlektLaborCost),
      softwareCosts: Math.round(kuhlektSoftwareCost),
      errorCosts: Math.round(kuhlektErrorCost),
      opportunityCosts: Math.round(kuhlektOpportunityCost),
      total: Math.round(kuhlektTotal),
    },
    savings: {
      monthly: Math.round(monthlySavings),
      annual: Math.round(annualSavings),
      threeYear: Math.round(threeYearSavings),
    },
    roi: {
      percentage: Math.round(roi),
      paybackMonths: Math.round(paybackMonths * 10) / 10,
    },
  }
}

async function sendClickSendEmail(to: string, subject: string, body: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY

  if (!username || !apiKey) {
    console.error("ClickSend credentials missing")
    throw new Error("Email service not configured")
  }

  const authToken = Buffer.from(`${username}:${apiKey}`).toString("base64")

  const payload = {
    to: [
      {
        email: to,
        name: to.split("@")[0],
      },
    ],
    subject: subject,
    body: body,
  }

  console.log("Sending ClickSend email with payload:", JSON.stringify(payload, null, 2))

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authToken}`,
    },
    body: JSON.stringify(payload),
  })

  const responseData = await response.text()
  console.log("ClickSend response:", responseData)

  if (!response.ok) {
    throw new Error(
      `fetch to https://rest.clicksend.com/v3/email/send failed with status ${response.status} and body: ${responseData}`,
    )
  }

  return JSON.parse(responseData)
}

export async function generateVerificationCode(
  email: string,
): Promise<{ success: boolean; message: string; code?: string }> {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const supabase = await createClient()
    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt,
      used: false,
    })

    if (insertError) {
      console.error("Error inserting verification code:", insertError)
      throw insertError
    }

    try {
      await sendClickSendEmail(
        email,
        "Your Kuhlekt ROI Calculator Verification Code",
        `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">Your Verification Code</h2>
              <p>Thank you for using the Kuhlekt ROI Calculator.</p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="font-size: 36px; letter-spacing: 8px; margin: 0; color: #2563eb;">${code}</h1>
              </div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="font-size: 12px; color: #6b7280;">Kuhlekt - Accounts Receivable Management Software</p>
            </div>
          </body>
        </html>
        `,
      )
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      return { success: true, message: "Code generated but email failed to send", code }
    }

    return { success: true, message: "Verification code sent to your email", code }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return { success: false, message: error instanceof Error ? error.message : "Failed to generate verification code" }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
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
      return { success: false, message: "Invalid or expired verification code" }
    }

    const { error: updateError } = await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    if (updateError) {
      console.error("Error updating verification code:", updateError)
      return { success: false, message: "Failed to verify code" }
    }

    return { success: true, message: "Code verified successfully" }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, message: "Failed to verify code" }
  }
}

export async function sendROIEmail(
  email: string,
  results: SimpleROIResult | DetailedROIResult,
  isDetailed: boolean,
): Promise<{ success: boolean; message: string }> {
  try {
    let emailBody = ""

    if (isDetailed) {
      const detailedResults = results as DetailedROIResult
      emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Your Kuhlekt ROI Analysis</h2>
            <p>Thank you for calculating your potential ROI with Kuhlekt.</p>
            
            <h3 style="color: #1e40af; margin-top: 30px;">Current Annual Costs</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Labor Costs</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">$${detailedResults.currentCosts.laborCosts.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Software Costs</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">$${detailedResults.currentCosts.softwareCosts.toLocaleString()}</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Error Costs</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">$${detailedResults.currentCosts.errorCosts.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Opportunity Costs</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">$${detailedResults.currentCosts.opportunityCosts.toLocaleString()}</td>
              </tr>
              <tr style="background-color: #dbeafe; font-weight: bold;">
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Total</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">$${detailedResults.currentCosts.total.toLocaleString()}</td>
              </tr>
            </table>

            <h3 style="color: #1e40af; margin-top: 30px;">With Kuhlekt</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Labor Costs</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">$${detailedResults.withKuhlekt.laborCosts.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Software Costs</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">$${detailedResults.withKuhlekt.softwareCosts.toLocaleString()}</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Error Costs</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">$${detailedResults.withKuhlekt.errorCosts.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Opportunity Costs</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">$${detailedResults.withKuhlekt.opportunityCosts.toLocaleString()}</td>
              </tr>
              <tr style="background-color: #dcfce7; font-weight: bold;">
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Total</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">$${detailedResults.withKuhlekt.total.toLocaleString()}</td>
              </tr>
            </table>

            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">Your Savings</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px 0;">Monthly Savings:</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: bold;">$${detailedResults.savings.monthly.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">Annual Savings:</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: bold;">$${detailedResults.savings.annual.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">3-Year Savings:</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: bold;">$${detailedResults.savings.threeYear.toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #166534; margin-top: 0;">ROI Metrics</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px 0;">ROI Percentage:</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: bold; font-size: 24px; color: #166534;">${detailedResults.roi.percentage}%</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">Payback Period:</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: bold;">${detailedResults.roi.paybackMonths} months</td>
                </tr>
              </table>
            </div>

            <p>Ready to start saving? <a href="https://kuhlekt.com/demo" style="color: #2563eb;">Schedule a demo</a> to see Kuhlekt in action.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #6b7280;">Kuhlekt - Accounts Receivable Management Software</p>
          </div>
        </body>
      </html>
      `
    } else {
      const simpleResults = results as SimpleROIResult
      emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Your Kuhlekt ROI Calculation</h2>
            <p>Thank you for calculating your potential ROI with Kuhlekt.</p>
            
            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">Your Potential Savings</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 10px 0; font-size: 18px;">Monthly Savings:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 24px; color: #1e40af;">$${simpleResults.monthlySavings.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 18px;">Annual Savings:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 24px; color: #1e40af;">$${simpleResults.annualSavings.toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #166534; margin-top: 0;">ROI Metrics</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 10px 0; font-size: 18px;">ROI:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 32px; color: #166534;">${simpleResults.roi}%</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 18px;">Payback Period:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 24px; color: #166534;">${simpleResults.paybackMonths} months</td>
                </tr>
              </table>
            </div>

            <p>Ready to start saving? <a href="https://kuhlekt.com/demo" style="color: #2563eb;">Schedule a demo</a> to see Kuhlekt in action.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #6b7280;">Kuhlekt - Accounts Receivable Management Software</p>
          </div>
        </body>
      </html>
      `
    }

    await sendClickSendEmail(email, "Your Kuhlekt ROI Analysis Results", emailBody)

    return { success: true, message: "ROI results sent to your email" }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return { success: false, message: "Failed to send ROI results" }
  }
}
