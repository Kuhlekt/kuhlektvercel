"use server"

import { createClient } from "@/lib/supabase/server"

interface ROIInputs {
  averageInvoiceValue: number
  monthlyInvoices: number
  currentDSO: number
  industryType: string
}

interface DetailedROI {
  currentAnnualRevenue: number
  projectedDSO: number
  dsoImprovement: number
  annualTimeSavings: number
  cashFlowImprovement: number
  costSavings: number
  totalAnnualBenefit: number
  implementationCost: number
  roi: number
  paybackPeriod: number
  fiveYearValue: number
}

export async function calculateDetailedROI(inputs: ROIInputs): Promise<DetailedROI> {
  const { averageInvoiceValue, monthlyInvoices, currentDSO, industryType } = inputs

  // Calculate current annual revenue
  const currentAnnualRevenue = averageInvoiceValue * monthlyInvoices * 12

  // Industry-specific DSO improvement factors
  const industryFactors: Record<string, number> = {
    manufacturing: 0.35,
    distribution: 0.4,
    services: 0.45,
    technology: 0.5,
    healthcare: 0.3,
    other: 0.35,
  }

  const improvementFactor = industryFactors[industryType] || 0.35

  // Calculate projected DSO
  const projectedDSO = Math.max(currentDSO * (1 - improvementFactor), 15)
  const dsoImprovement = currentDSO - projectedDSO

  // Calculate cash flow improvement
  const dailyRevenue = currentAnnualRevenue / 365
  const cashFlowImprovement = dailyRevenue * dsoImprovement

  // Calculate time savings (hours per year)
  const hoursPerInvoice = 0.5 // Average manual processing time
  const annualTimeSavings = monthlyInvoices * 12 * hoursPerInvoice * 0.7 // 70% reduction

  // Calculate cost savings
  const hourlyRate = 35 // Average AR staff hourly rate
  const costSavings = annualTimeSavings * hourlyRate

  // Total annual benefit
  const totalAnnualBenefit = cashFlowImprovement + costSavings

  // Implementation cost (typically 3-6 months of subscription)
  const monthlySubscription = 499
  const implementationCost = monthlySubscription * 4

  // ROI calculation
  const roi = ((totalAnnualBenefit - implementationCost) / implementationCost) * 100

  // Payback period in months
  const paybackPeriod = implementationCost / (totalAnnualBenefit / 12)

  // Five-year value
  const fiveYearValue = totalAnnualBenefit * 5 - implementationCost

  return {
    currentAnnualRevenue,
    projectedDSO,
    dsoImprovement,
    annualTimeSavings,
    cashFlowImprovement,
    costSavings,
    totalAnnualBenefit,
    implementationCost,
    roi,
    paybackPeriod,
    fiveYearValue,
  }
}

async function sendClickSendEmail(to: string, subject: string, body: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "noreply@kuhlekt.com"

  if (!username || !apiKey) {
    throw new Error("ClickSend credentials not configured")
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
    body: body,
  }

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
    throw new Error(
      `fetch to https://rest.clicksend.com/v3/email/send failed with status ${response.status} and body: ${errorBody}`,
    )
  }

  return response.json()
}

export async function generateVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store in database
    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (insertError) {
      console.error("Database insert error:", insertError)
      return { success: false, message: "Failed to generate verification code" }
    }

    // Send email with verification code
    const emailSubject = "Your Kuhlekt ROI Calculator Verification Code"
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Your Verification Code</h2>
            <p>Thank you for your interest in Kuhlekt's ROI Calculator.</p>
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

    return { success: true, message: "Verification code sent successfully" }
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send verification code",
    }
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
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return { success: false, message: "Invalid or expired verification code" }
    }

    // Mark code as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true, message: "Verification successful" }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return { success: false, message: "Verification failed" }
  }
}

export async function sendROIReport(
  email: string,
  roiData: DetailedROI,
  inputs: ROIInputs,
): Promise<{ success: boolean; message: string }> {
  try {
    const emailSubject = "Your Kuhlekt ROI Analysis Report"
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Your ROI Analysis Report</h1>
            
            <h2 style="color: #1e40af; margin-top: 30px;">Current Situation</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Annual Revenue:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">
                  $${roiData.currentAnnualRevenue.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Current DSO:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">
                  ${inputs.currentDSO} days
                </td>
              </tr>
            </table>

            <h2 style="color: #1e40af; margin-top: 30px;">Projected Improvements</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Projected DSO:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">
                  ${roiData.projectedDSO.toFixed(1)} days
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">DSO Improvement:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #059669;">
                  ${roiData.dsoImprovement.toFixed(1)} days
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Cash Flow Improvement:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #059669;">
                  $${roiData.cashFlowImprovement.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Annual Cost Savings:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #059669;">
                  $${roiData.costSavings.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Annual Time Savings:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #059669;">
                  ${roiData.annualTimeSavings.toFixed(0)} hours
                </td>
              </tr>
            </table>

            <h2 style="color: #1e40af; margin-top: 30px;">Financial Impact</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Total Annual Benefit:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #059669;">
                  $${roiData.totalAnnualBenefit.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Implementation Cost:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                  $${roiData.implementationCost.toLocaleString()}
                </td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 8px; font-weight: bold;">Return on Investment:</td>
                <td style="padding: 8px; text-align: right; font-weight: bold; font-size: 18px; color: #059669;">
                  ${roiData.roi.toFixed(0)}%
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Payback Period:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">
                  ${roiData.paybackPeriod.toFixed(1)} months
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">5-Year Value:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #059669;">
                  $${roiData.fiveYearValue.toLocaleString()}
                </td>
              </tr>
            </table>

            <div style="background-color: #eff6ff; padding: 20px; margin-top: 30px; border-left: 4px solid #2563eb;">
              <h3 style="margin-top: 0; color: #1e40af;">Ready to Transform Your AR Process?</h3>
              <p>Schedule a demo to see how Kuhlekt can deliver these results for your business.</p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" 
                 style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
                Schedule a Demo
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="font-size: 12px; color: #6b7280;">
              This ROI analysis is based on industry averages and your provided inputs. Actual results may vary.
            </p>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(email, emailSubject, emailBody)

    return { success: true, message: "ROI report sent successfully" }
  } catch (error) {
    console.error("Error in sendROIReport:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send ROI report",
    }
  }
}
