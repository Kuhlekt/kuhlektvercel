"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const companyName = formData.get("companyName") as string
  const monthlySales = formData.get("monthlySales") as string
  const dso = formData.get("dso") as string
  const badDebtRate = formData.get("badDebtRate") as string
  const collectionCost = formData.get("collectionCost") as string

  const savings = calculateSavings({
    monthlySales: Number.parseFloat(monthlySales),
    dso: Number.parseFloat(dso),
    badDebtRate: Number.parseFloat(badDebtRate),
    collectionCost: Number.parseFloat(collectionCost),
  })

  const htmlContent = generateEmailHTML(companyName, savings)
  const textContent = generateEmailText(companyName, savings)

  const result = await sendEmail({
    to: email,
    subject: `Your Kuhlekt ROI Analysis for ${companyName}`,
    text: textContent,
    html: htmlContent,
  })

  return result
}

export async function generateVerificationCode(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  try {
    const supabase = await createClient()

    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (error) {
      console.error("Error storing verification code:", error)
      return { success: false, message: "Failed to generate verification code" }
    }

    const result = await sendEmail({
      to: email,
      subject: "Your Kuhlekt Verification Code",
      text: `Your verification code is: ${code}

This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Verification Code</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
            ${code}
          </div>
          <p style="color: #666; margin-top: 20px;">This code will expire in 10 minutes.</p>
        </div>
      `,
    })

    return result
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
    return { success: false, message: "Failed to generate verification code" }
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
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return { success: false, message: "Invalid or expired verification code" }
    }

    if (data.attempts >= 3) {
      return { success: false, message: "Too many attempts. Please request a new code." }
    }

    await supabase
      .from("verification_codes")
      .update({ attempts: data.attempts + 1 })
      .eq("id", data.id)

    await supabase.from("verification_codes").delete().eq("email", email)

    return { success: true, message: "Verification successful" }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return { success: false, message: "Verification failed" }
  }
}

function calculateSavings(data: {
  monthlySales: number
  dso: number
  badDebtRate: number
  collectionCost: number
}) {
  const annualSales = data.monthlySales * 12
  const currentBadDebt = annualSales * (data.badDebtRate / 100)
  const improvedBadDebt = annualSales * 0.005
  const badDebtSavings = currentBadDebt - improvedBadDebt

  const targetDSO = Math.max(30, data.dso * 0.7)
  const dsoReduction = data.dso - targetDSO
  const cashFlowImprovement = (annualSales / 365) * dsoReduction

  const currentCollectionCost = data.collectionCost * 12
  const improvedCollectionCost = currentCollectionCost * 0.4
  const collectionSavings = currentCollectionCost - improvedCollectionCost

  const totalSavings = badDebtSavings + cashFlowImprovement + collectionSavings

  return {
    badDebtSavings,
    cashFlowImprovement,
    collectionSavings,
    totalSavings,
    targetDSO,
    dsoReduction,
  }
}

function generateEmailHTML(companyName: string, savings: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Kuhlekt ROI Analysis</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1a1a2e; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #ffffff; margin: 0;">Your ROI Analysis</h1>
        <p style="color: #cccccc; margin-top: 10px;">${companyName}</p>
      </div>
      
      <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1a1a2e; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">Potential Annual Savings</h2>
        
        <div style="margin: 20px 0; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
          <h3 style="color: #4CAF50; font-size: 36px; margin: 0;">$${savings.totalSavings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h3>
          <p style="color: #666; margin-top: 5px;">Total Estimated Annual Savings</p>
        </div>

        <h3 style="color: #1a1a2e; margin-top: 30px;">Breakdown:</h3>
        
        <div style="margin: 15px 0; padding: 15px; border-left: 4px solid #4CAF50; background-color: #f9f9f9;">
          <strong style="color: #1a1a2e;">Bad Debt Reduction:</strong>
          <p style="margin: 5px 0 0 0; color: #4CAF50; font-size: 24px; font-weight: bold;">$${savings.badDebtSavings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
        </div>

        <div style="margin: 15px 0; padding: 15px; border-left: 4px solid #2196F3; background-color: #f9f9f9;">
          <strong style="color: #1a1a2e;">Cash Flow Improvement:</strong>
          <p style="margin: 5px 0 0 0; color: #2196F3; font-size: 24px; font-weight: bold;">$${savings.cashFlowImprovement.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">DSO reduction: ${savings.dsoReduction.toFixed(0)} days</p>
        </div>

        <div style="margin: 15px 0; padding: 15px; border-left: 4px solid #FF9800; background-color: #f9f9f9;">
          <strong style="color: #1a1a2e;">Collection Cost Savings:</strong>
          <p style="margin: 5px 0 0 0; color: #FF9800; font-size: 24px; font-weight: bold;">$${savings.collectionSavings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #e8f5e9; border-radius: 8px;">
          <h3 style="color: #2e7d32; margin-top: 0;">Ready to Unlock These Savings?</h3>
          <p style="color: #1b5e20; margin-bottom: 15px;">Schedule a personalized demo to see how Kuhlekt can transform your accounts receivable process.</p>
          <a href="https://kuhlekt.com/demo" style="display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Schedule Demo</a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
          <p>This analysis is based on the information you provided and industry benchmarks. Actual results may vary.</p>
          <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateEmailText(companyName: string, savings: any) {
  return `
Your Kuhlekt ROI Analysis - ${companyName}

POTENTIAL ANNUAL SAVINGS: $${savings.totalSavings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}

Breakdown:

Bad Debt Reduction: $${savings.badDebtSavings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}

Cash Flow Improvement: $${savings.cashFlowImprovement.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
(DSO reduction: ${savings.dsoReduction.toFixed(0)} days)

Collection Cost Savings: $${savings.collectionSavings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}

Ready to Unlock These Savings?
Schedule a personalized demo: https://kuhlekt.com/demo

This analysis is based on the information you provided and industry benchmarks. Actual results may vary.

© ${new Date().getFullYear()} Kuhlekt. All rights reserved.
  `.trim()
}
