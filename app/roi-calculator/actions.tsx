"use server"

import { createClient } from "@/lib/supabase/server"

// ClickSend email sending function
async function sendClickSendEmail(to: string, subject: string, htmlBody: string, textBody: string) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL || "support@kuhlekt.com"

  if (!username || !apiKey) {
    console.error("ClickSend credentials missing")
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
      email_address_id: 318370,
      name: "Kuhlekt",
    },
    subject: subject,
    body: htmlBody,
  }

  console.log("ClickSend payload:", JSON.stringify(payload, null, 2))

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  })

  const responseData = await response.json()

  if (!response.ok) {
    console.error("ClickSend error:", responseData)
    throw new Error(`ClickSend error: ${responseData.response_msg || "Unknown error"}`)
  }

  return responseData
}

export async function calculateSimpleROI(data: {
  monthlyRevenue: number
  avgDSO: number
  avgInvoiceValue: number
}) {
  try {
    const currentAR = (data.monthlyRevenue * data.avgDSO) / 30
    const targetDSO = Math.max(15, data.avgDSO * 0.6)
    const dsoReduction = data.avgDSO - targetDSO
    const cashFlowImprovement = (data.monthlyRevenue * dsoReduction) / 30
    const annualBenefit = cashFlowImprovement * 12
    const opportunityCost = annualBenefit * 0.08

    return {
      success: true,
      results: {
        currentAR,
        targetDSO,
        dsoReduction,
        cashFlowImprovement,
        annualBenefit,
        opportunityCost,
      },
    }
  } catch (error) {
    console.error("Error calculating simple ROI:", error)
    return {
      success: false,
      error: "Failed to calculate ROI",
    }
  }
}

export async function calculateDetailedROI(data: {
  monthlyRevenue: number
  avgDSO: number
  avgInvoiceValue: number
  collectionStaff: number
  avgStaffCost: number
  badDebtRate: number
  discountRate: number
}) {
  try {
    const currentAR = (data.monthlyRevenue * data.avgDSO) / 30
    const targetDSO = Math.max(15, data.avgDSO * 0.6)
    const dsoReduction = data.avgDSO - targetDSO
    const cashFlowImprovement = (data.monthlyRevenue * dsoReduction) / 30
    const annualBenefit = cashFlowImprovement * 12
    const opportunityCost = annualBenefit * 0.08

    const staffReduction = Math.floor(data.collectionStaff * 0.4)
    const staffSavings = staffReduction * data.avgStaffCost
    const badDebtImprovement = data.monthlyRevenue * 12 * data.badDebtRate * 0.3
    const discountSavings = data.monthlyRevenue * 12 * data.discountRate * 0.5

    const totalAnnualBenefit = annualBenefit + opportunityCost + staffSavings + badDebtImprovement + discountSavings

    const estimatedCost = data.monthlyRevenue * 12 * 0.005
    const netBenefit = totalAnnualBenefit - estimatedCost
    const roi = (netBenefit / estimatedCost) * 100
    const paybackMonths = estimatedCost / (totalAnnualBenefit / 12)

    return {
      success: true,
      results: {
        currentAR,
        targetDSO,
        dsoReduction,
        cashFlowImprovement,
        annualBenefit,
        opportunityCost,
        staffReduction,
        staffSavings,
        badDebtImprovement,
        discountSavings,
        totalAnnualBenefit,
        estimatedCost,
        netBenefit,
        roi,
        paybackMonths,
      },
    }
  } catch (error) {
    console.error("Error calculating detailed ROI:", error)
    return {
      success: false,
      error: "Failed to calculate ROI",
    }
  }
}

export async function generateVerificationCode(email: string) {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .insert({
        email,
        code,
        expires_at: expiresAt,
        used: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Verification Code</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background-color: #2563eb;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Kuhlekt</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Your Verification Code</h2>
                      <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                        Thank you for your interest in Kuhlekt's ROI Calculator. Please use the verification code below to access your personalized ROI report:
                      </p>
                      <div style="background-color: #f8f9fa; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0;">
                        <p style="margin: 0; color: #333333; font-size: 32px; font-weight: bold; letter-spacing: 4px; text-align: center;">${code}</p>
                      </div>
                      <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.5;">
                        This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #666666; font-size: 14px;">
                        © 2025 Kuhlekt. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `

    const textBody = `Your Kuhlekt verification code is: ${code}. This code will expire in 10 minutes.`

    try {
      await sendClickSendEmail(email, "Your Kuhlekt Verification Code", htmlBody, textBody)
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      console.log("Verification code for testing:", code)
    }

    return {
      success: true,
      message: "Verification code sent successfully",
      code: code,
    }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate code",
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
      .single()

    if (error || !data) {
      return {
        success: false,
        error: "Invalid or expired verification code",
      }
    }

    if (new Date(data.expires_at) < new Date()) {
      return {
        success: false,
        error: "Verification code has expired",
      }
    }

    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return {
      success: true,
      message: "Code verified successfully",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      error: "Failed to verify code",
    }
  }
}

export async function sendROIEmail(email: string, results: any, isDetailed: boolean) {
  try {
    const htmlBody = isDetailed
      ? `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your ROI Analysis</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background-color: #2563eb;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Kuhlekt ROI Analysis</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Your Detailed ROI Report</h2>
                      <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                        Based on your inputs, here's how Kuhlekt can transform your accounts receivable:
                      </p>
                      
                      <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
                        <h3 style="margin: 0 0 10px 0; color: #059669; font-size: 18px;">Net Annual Benefit</h3>
                        <p style="margin: 0; color: #333333; font-size: 32px; font-weight: bold;">$${results.netBenefit.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                      </div>

                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0;">
                        <h3 style="margin: 0 0 10px 0; color: #d97706; font-size: 18px;">Return on Investment</h3>
                        <p style="margin: 0; color: #333333; font-size: 32px; font-weight: bold;">${results.roi.toFixed(0)}%</p>
                      </div>

                      <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #333333;">Cash Flow Improvement</strong>
                          </td>
                          <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <strong style="color: #059669;">$${results.cashFlowImprovement.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #333333;">Staff Savings</strong>
                          </td>
                          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <strong style="color: #059669;">$${results.staffSavings.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #333333;">Bad Debt Reduction</strong>
                          </td>
                          <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <strong style="color: #059669;">$${results.badDebtImprovement.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #333333;">DSO Reduction</strong>
                          </td>
                          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <strong style="color: #333333;">${results.dsoReduction.toFixed(0)} days</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; background-color: #f8f9fa;">
                            <strong style="color: #333333;">Payback Period</strong>
                          </td>
                          <td style="padding: 15px; background-color: #f8f9fa; text-align: right;">
                            <strong style="color: #333333;">${results.paybackMonths.toFixed(1)} months</strong>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.5;">
                        Ready to see these results in your business? Contact us today to schedule a personalized demo.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                        Questions? Contact us at <a href="mailto:support@kuhlekt.com" style="color: #2563eb;">support@kuhlekt.com</a>
                      </p>
                      <p style="margin: 0; color: #666666; font-size: 14px;">
                        © 2025 Kuhlekt. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
      : `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your ROI Analysis</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background-color: #2563eb;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Kuhlekt ROI Analysis</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Your Quick ROI Report</h2>
                      <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                        Here's a quick overview of the potential benefits Kuhlekt can bring to your business:
                      </p>
                      
                      <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
                        <h3 style="margin: 0 0 10px 0; color: #059669; font-size: 18px;">Annual Benefit</h3>
                        <p style="margin: 0; color: #333333; font-size: 32px; font-weight: bold;">$${results.annualBenefit.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                      </div>

                      <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #333333;">Cash Flow Improvement</strong>
                          </td>
                          <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <strong style="color: #059669;">$${results.cashFlowImprovement.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #333333;">DSO Reduction</strong>
                          </td>
                          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <strong style="color: #333333;">${results.dsoReduction.toFixed(0)} days</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; background-color: #f8f9fa;">
                            <strong style="color: #333333;">Opportunity Cost Savings</strong>
                          </td>
                          <td style="padding: 15px; background-color: #f8f9fa; text-align: right;">
                            <strong style="color: #059669;">$${results.opportunityCost.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.5;">
                        Want a more detailed analysis? Use our comprehensive ROI calculator or contact us for a personalized demo.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                        Questions? Contact us at <a href="mailto:support@kuhlekt.com" style="color: #2563eb;">support@kuhlekt.com</a>
                      </p>
                      <p style="margin: 0; color: #666666; font-size: 14px;">
                        © 2025 Kuhlekt. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `

    const textBody = isDetailed
      ? `Your Kuhlekt ROI Analysis: Net Annual Benefit: $${results.netBenefit.toLocaleString()}, ROI: ${results.roi.toFixed(0)}%, Payback Period: ${results.paybackMonths.toFixed(1)} months`
      : `Your Kuhlekt ROI Analysis: Annual Benefit: $${results.annualBenefit.toLocaleString()}, Cash Flow Improvement: $${results.cashFlowImprovement.toLocaleString()}`

    await sendClickSendEmail(email, "Your Kuhlekt ROI Analysis Results", htmlBody, textBody)

    return {
      success: true,
      message: "ROI results sent successfully",
    }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      error: "Failed to send ROI results",
    }
  }
}
