"use server"

import { createClient } from "@/lib/supabase/server"

interface SimpleROIResult {
  currentARDays: number
  projectedARDays: number
  currentRevenueLoss: number
  projectedRevenueLoss: number
  annualSavings: number
  roi: number
  paybackPeriod: number
}

interface DetailedROIResult extends SimpleROIResult {
  currentCosts: {
    staffCost: number
    systemCost: number
    latePaymentCost: number
    totalCost: number
  }
  projectedCosts: {
    staffCost: number
    systemCost: number
    latePaymentCost: number
    totalCost: number
  }
  improvements: {
    timeReduction: number
    errorReduction: number
    cashFlowImprovement: number
  }
}

export async function calculateSimpleROI(data: {
  monthlyRevenue: number
  currentDSO: number
  targetDSO: number
}): Promise<SimpleROIResult> {
  const { monthlyRevenue, currentDSO, targetDSO } = data

  const annualRevenue = monthlyRevenue * 12
  const currentARDays = currentDSO
  const projectedARDays = targetDSO

  const currentRevenueLoss = (annualRevenue * currentARDays) / 365
  const projectedRevenueLoss = (annualRevenue * projectedARDays) / 365
  const annualSavings = currentRevenueLoss - projectedRevenueLoss

  const implementationCost = 50000 // Example implementation cost
  const roi = ((annualSavings - implementationCost) / implementationCost) * 100
  const paybackPeriod = implementationCost / (annualSavings / 12)

  return {
    currentARDays,
    projectedARDays,
    currentRevenueLoss,
    projectedRevenueLoss,
    annualSavings,
    roi,
    paybackPeriod,
  }
}

export async function calculateDetailedROI(data: {
  annualRevenue: number
  currentDSO: number
  targetDSO: number
  arStaffCount: number
  avgStaffCost: number
  currentSystemCost: number
  latePaymentRate: number
}): Promise<DetailedROIResult> {
  const { annualRevenue, currentDSO, targetDSO, arStaffCount, avgStaffCost, currentSystemCost, latePaymentRate } = data

  // Calculate current costs
  const currentStaffCost = arStaffCount * avgStaffCost
  const currentLatePaymentCost = annualRevenue * (latePaymentRate / 100) * 0.02
  const currentTotalCost = currentStaffCost + currentSystemCost + currentLatePaymentCost

  // Calculate projected costs (assuming automation reduces staff needs by 40%)
  const projectedStaffCost = currentStaffCost * 0.6
  const projectedSystemCost = 35000 // Annual cost for Kuhlekt
  const projectedLatePaymentCost = currentLatePaymentCost * 0.3 // 70% reduction
  const projectedTotalCost = projectedStaffCost + projectedSystemCost + projectedLatePaymentCost

  // Calculate improvements
  const timeReduction = 60 // 60% time reduction
  const errorReduction = 75 // 75% error reduction
  const cashFlowImprovement = ((currentDSO - targetDSO) / currentDSO) * 100

  // Calculate ROI metrics
  const currentARDays = currentDSO
  const projectedARDays = targetDSO
  const currentRevenueLoss = (annualRevenue * currentARDays) / 365
  const projectedRevenueLoss = (annualRevenue * projectedARDays) / 365
  const annualSavings = currentTotalCost - projectedTotalCost + (currentRevenueLoss - projectedRevenueLoss)

  const implementationCost = 50000
  const roi = ((annualSavings - implementationCost) / implementationCost) * 100
  const paybackPeriod = implementationCost / (annualSavings / 12)

  return {
    currentARDays,
    projectedARDays,
    currentRevenueLoss,
    projectedRevenueLoss,
    annualSavings,
    roi,
    paybackPeriod,
    currentCosts: {
      staffCost: currentStaffCost,
      systemCost: currentSystemCost,
      latePaymentCost: currentLatePaymentCost,
      totalCost: currentTotalCost,
    },
    projectedCosts: {
      staffCost: projectedStaffCost,
      systemCost: projectedSystemCost,
      latePaymentCost: projectedLatePaymentCost,
      totalCost: projectedTotalCost,
    },
    improvements: {
      timeReduction,
      errorReduction,
      cashFlowImprovement,
    },
  }
}

export async function generateVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

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

    // Send email via ClickSend using Basic Auth
    const username = process.env.CLICKSEND_USERNAME
    const apiKey = process.env.CLICKSEND_API_KEY

    if (!username || !apiKey) {
      console.error("ClickSend credentials missing")
      console.log("Verification code for testing:", code)
      return { success: true, message: "Verification code generated (email disabled for testing)" }
    }

    // Create Basic Auth token
    const authToken = Buffer.from(`${username}:${apiKey}`).toString("base64")

    const emailPayload = {
      to: [
        {
          email: email,
          name: email.split("@")[0],
        },
      ],
      from: {
        email_address_id: Number.parseInt(process.env.CLICKSEND_EMAIL_ADDRESS_ID || "0"),
        name: "Kuhlekt",
      },
      subject: "Your Verification Code",
      body: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Code</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background-color: #1e40af; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Kuhlekt ROI Calculator</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 20px;">Your Verification Code</h2>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
                          Thank you for using the Kuhlekt ROI Calculator. Please use the verification code below to receive your ROI analysis:
                        </p>
                        <div style="background-color: #f8f9fa; border: 2px solid #1e40af; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 30px 0;">
                          <span style="font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 8px;">${code}</span>
                        </div>
                        <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0;">
                          This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #999999; font-size: 12px; margin: 0;">
                          © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    }

    const response = await fetch("https://rest.clicksend.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`,
      },
      body: JSON.stringify(emailPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ClickSend API error:", response.status, errorText)
      console.log("Verification code for testing:", code)
      return { success: true, message: "Verification code generated (email delivery failed but code saved)" }
    }

    return { success: true, message: "Verification code sent to your email" }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return { success: false, message: "An error occurred while generating verification code" }
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
      .gte("expires_at", new Date().toISOString())
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
    console.error("Error verifying code:", error)
    return { success: false, message: "An error occurred while verifying code" }
  }
}

export async function sendROIEmail(
  email: string,
  calculationType: "simple" | "detailed",
  results: SimpleROIResult | DetailedROIResult,
): Promise<{ success: boolean; message: string }> {
  try {
    const username = process.env.CLICKSEND_USERNAME
    const apiKey = process.env.CLICKSEND_API_KEY

    if (!username || !apiKey) {
      console.error("ClickSend credentials missing")
      return { success: false, message: "Email service not configured" }
    }

    // Create Basic Auth token
    const authToken = Buffer.from(`${username}:${apiKey}`).toString("base64")

    const isDetailed = calculationType === "detailed"
    const detailedResults = isDetailed ? (results as DetailedROIResult) : null

    const emailBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your ROI Analysis</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background-color: #1e40af; padding: 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Your ROI Analysis Results</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 20px;">Key Metrics</h2>
                      
                      <table width="100%" cellpadding="10" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
                            <strong style="color: #333333;">Annual Savings:</strong><br>
                            <span style="color: #10b981; font-size: 24px; font-weight: bold;">$${results.annualSavings.toLocaleString()}</span>
                          </td>
                        </tr>
                        <tr><td style="height: 10px;"></td></tr>
                        <tr>
                          <td style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
                            <strong style="color: #333333;">ROI:</strong><br>
                            <span style="color: #1e40af; font-size: 24px; font-weight: bold;">${results.roi.toFixed(1)}%</span>
                          </td>
                        </tr>
                        <tr><td style="height: 10px;"></td></tr>
                        <tr>
                          <td style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
                            <strong style="color: #333333;">Payback Period:</strong><br>
                            <span style="color: #333333; font-size: 20px; font-weight: bold;">${results.paybackPeriod.toFixed(1)} months</span>
                          </td>
                        </tr>
                      </table>

                      ${
                        detailedResults
                          ? `
                      <h2 style="color: #333333; margin: 30px 0 20px 0; font-size: 20px;">Detailed Analysis</h2>
                      
                      <h3 style="color: #666666; margin: 20px 0 10px 0; font-size: 16px;">Current Costs</h3>
                      <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 20px;">
                        <tr>
                          <td style="color: #666666; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Staff Cost:</td>
                          <td style="color: #333333; padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">$${detailedResults.currentCosts.staffCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style="color: #666666; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">System Cost:</td>
                          <td style="color: #333333; padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">$${detailedResults.currentCosts.systemCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style="color: #666666; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Late Payment Cost:</td>
                          <td style="color: #333333; padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">$${detailedResults.currentCosts.latePaymentCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style="color: #333333; padding: 8px 0; font-weight: bold;">Total:</td>
                          <td style="color: #333333; padding: 8px 0; text-align: right; font-weight: bold;">$${detailedResults.currentCosts.totalCost.toLocaleString()}</td>
                        </tr>
                      </table>

                      <h3 style="color: #666666; margin: 20px 0 10px 0; font-size: 16px;">Projected Costs with Kuhlekt</h3>
                      <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 20px;">
                        <tr>
                          <td style="color: #666666; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Staff Cost:</td>
                          <td style="color: #333333; padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">$${detailedResults.projectedCosts.staffCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style="color: #666666; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">System Cost:</td>
                          <td style="color: #333333; padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">$${detailedResults.projectedCosts.systemCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style="color: #666666; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Late Payment Cost:</td>
                          <td style="color: #333333; padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">$${detailedResults.projectedCosts.latePaymentCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style="color: #10b981; padding: 8px 0; font-weight: bold;">Total:</td>
                          <td style="color: #10b981; padding: 8px 0; text-align: right; font-weight: bold;">$${detailedResults.projectedCosts.totalCost.toLocaleString()}</td>
                        </tr>
                      </table>

                      <h3 style="color: #666666; margin: 20px 0 10px 0; font-size: 16px;">Key Improvements</h3>
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #666666; padding: 8px 0;">Time Reduction:</td>
                          <td style="color: #10b981; padding: 8px 0; text-align: right; font-weight: bold;">${detailedResults.improvements.timeReduction}%</td>
                        </tr>
                        <tr>
                          <td style="color: #666666; padding: 8px 0;">Error Reduction:</td>
                          <td style="color: #10b981; padding: 8px 0; text-align: right; font-weight: bold;">${detailedResults.improvements.errorReduction}%</td>
                        </tr>
                        <tr>
                          <td style="color: #666666; padding: 8px 0;">Cash Flow Improvement:</td>
                          <td style="color: #10b981; padding: 8px 0; text-align: right; font-weight: bold;">${detailedResults.improvements.cashFlowImprovement.toFixed(1)}%</td>
                        </tr>
                      </table>
                      `
                          : ""
                      }

                      <div style="margin-top: 40px; padding: 20px; background-color: #eff6ff; border-left: 4px solid #1e40af; border-radius: 4px;">
                        <p style="color: #1e40af; margin: 0; font-weight: bold;">Ready to see these results in your business?</p>
                        <p style="color: #666666; margin: 10px 0 0 0;">Schedule a demo with our team to learn how Kuhlekt can transform your accounts receivable process.</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #999999; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
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

    const emailPayload = {
      to: [
        {
          email: email,
          name: email.split("@")[0],
        },
      ],
      from: {
        email_address_id: Number.parseInt(process.env.CLICKSEND_EMAIL_ADDRESS_ID || "0"),
        name: "Kuhlekt",
      },
      subject: "Your ROI Analysis Results",
      body: emailBody,
    }

    const response = await fetch("https://rest.clicksend.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`,
      },
      body: JSON.stringify(emailPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ClickSend API error:", response.status, errorText)
      return { success: false, message: "Failed to send ROI results email" }
    }

    return { success: true, message: "ROI results sent to your email" }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return { success: false, message: "An error occurred while sending ROI results" }
  }
}
