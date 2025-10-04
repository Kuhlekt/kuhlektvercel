"use server"

import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY)

interface SimpleROIData {
  currentDSO: string
  averageInvoiceValue: string
  monthlyInvoices: string
  simpleDSOImprovement: string
  simpleCostOfCapital: string
}

interface DetailedROIData {
  implementationCost: string
  monthlyCost: string
  perAnnumDirectLabourCosts: string
  interestType: "loan" | "deposit"
  interestRate: string
  averageBadDebt: string
  currentBadDebts: string
  labourSavings: string
  dsoImprovement: string
  currentDSODays: string
  debtorsBalance: string
  averagePaymentTerms: "net30" | "net60" | "net90"
  numberOfDebtors: string
  numberOfCollectors: string
  projectedCustomerGrowth: string
}

export async function calculateSimpleROI(data: SimpleROIData) {
  const currentDSO = Number.parseFloat(data.currentDSO)
  const averageInvoiceValue = Number.parseFloat(data.averageInvoiceValue)
  const monthlyInvoices = Number.parseFloat(data.monthlyInvoices)
  const dsoImprovement = Number.parseFloat(data.simpleDSOImprovement) / 100
  const costOfCapital = Number.parseFloat(data.simpleCostOfCapital) / 100

  const annualRevenue = averageInvoiceValue * monthlyInvoices * 12
  const currentCashTied = (annualRevenue / 365) * currentDSO
  const newDSO = currentDSO * (1 - dsoImprovement)
  const newCashTied = (annualRevenue / 365) * newDSO
  const cashReleased = currentCashTied - newCashTied
  const annualSavings = cashReleased * costOfCapital

  return {
    currentDSO,
    newDSO,
    currentCashTied,
    cashReleased,
    annualSavings,
    dsoImprovement: dsoImprovement * 100,
  }
}

export async function calculateDetailedROI(data: DetailedROIData) {
  const implementationCost = Number.parseFloat(data.implementationCost)
  const monthlyCost = Number.parseFloat(data.monthlyCost)
  const annualCost = monthlyCost * 12
  const totalFirstYearCost = implementationCost + annualCost

  const perAnnumDirectLabourCosts = Number.parseFloat(data.perAnnumDirectLabourCosts)
  const labourSavings = Number.parseFloat(data.labourSavings) / 100
  const labourCostSavings = perAnnumDirectLabourCosts * labourSavings

  const currentDSODays = Number.parseFloat(data.currentDSODays)
  const dsoImprovement = Number.parseFloat(data.dsoImprovement) / 100
  const dsoReductionDays = currentDSODays * dsoImprovement
  const newDSODays = currentDSODays - dsoReductionDays

  const debtorsBalance = Number.parseFloat(data.debtorsBalance)
  const annualRevenue = (debtorsBalance / currentDSODays) * 365
  const workingCapitalReleased = (annualRevenue / 365) * dsoReductionDays

  const interestRate = Number.parseFloat(data.interestRate) / 100
  const interestSavings = workingCapitalReleased * interestRate

  const currentBadDebts = Number.parseFloat(data.currentBadDebts)
  const badDebtReduction = currentBadDebts * 0.5

  const totalAnnualBenefit = labourCostSavings + interestSavings + badDebtReduction

  const netAnnualBenefit = totalAnnualBenefit - annualCost
  const roi = (netAnnualBenefit / totalFirstYearCost) * 100
  const paybackMonths = totalFirstYearCost / (totalAnnualBenefit / 12)

  return {
    implementationCost,
    annualCost,
    totalFirstYearCost,
    labourCostSavings,
    dsoReductionDays,
    newDSODays,
    workingCapitalReleased,
    interestSavings,
    badDebtReduction,
    totalAnnualBenefit,
    netAnnualBenefit,
    roi,
    paybackMonths,
  }
}

export async function generateVerificationCode(email: string) {
  try {
    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store in Supabase
    const { error: insertError } = await supabase.from("verification_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      return { success: false, error: "Failed to generate code" }
    }

    // Send verification email using Resend
    try {
      await resend.emails.send({
        from: process.env.AWS_SES_FROM_EMAIL || "noreply@kuhlekt.com",
        to: email,
        subject: "Your Kuhlekt Verification Code",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Kuhlekt</h1>
              </div>
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #333; margin-top: 0;">Verification Code</h2>
                <p style="font-size: 16px; color: #666;">Your verification code is:</p>
                <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                  <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px;">${code}</span>
                </div>
                <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
                <p style="font-size: 14px; color: #999; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
              </div>
              <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
                <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </body>
          </html>
        `,
      })

      console.log(`Verification code sent to ${email}: ${code}`)
    } catch (emailError) {
      console.error("Error sending verification email:", emailError)
      // Still return success with code for testing even if email fails
      return { success: true, code, message: `Code generated but email failed. Code: ${code}` }
    }

    return { success: true, message: `Verification code sent to ${email}` }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return { success: false, error: "Failed to generate code" }
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("code", code)
      .eq("used", false)
      .single()

    if (error || !data) {
      return { success: false, error: "Invalid verification code" }
    }

    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
      return { success: false, error: "Verification code has expired" }
    }

    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return { success: true }
  } catch (error) {
    console.error("Error verifying code:", error)
    return { success: false, error: "Failed to verify code" }
  }
}

export async function sendROIEmail(emailData: {
  name: string
  email: string
  company: string
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}) {
  try {
    const { name, email, company, calculatorType, results } = emailData

    let emailContent = ""

    if (calculatorType === "simple") {
      emailContent = `
        <h2>Simple ROI Analysis Results</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Current DSO:</strong> ${results.currentDSO.toFixed(1)} days</p>
          <p><strong>New DSO:</strong> ${results.newDSO.toFixed(1)} days</p>
          <p><strong>DSO Improvement:</strong> ${results.dsoImprovement.toFixed(1)}%</p>
          <p><strong>Cash Tied Up:</strong> $${results.currentCashTied.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p><strong>Cash Released:</strong> $${results.cashReleased.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p style="font-size: 18px; color: #667eea;"><strong>Annual Savings:</strong> $${results.annualSavings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      `
    } else {
      emailContent = `
        <h2>Detailed ROI Analysis Results</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Investment Costs</h3>
          <p><strong>Implementation Cost:</strong> $${results.implementationCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p><strong>Annual Cost:</strong> $${results.annualCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p><strong>Total First Year Cost:</strong> $${results.totalFirstYearCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          
          <h3 style="margin-top: 20px;">Annual Benefits</h3>
          <p><strong>Labour Cost Savings:</strong> $${results.labourCostSavings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p><strong>Interest Savings:</strong> $${results.interestSavings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p><strong>Bad Debt Reduction:</strong> $${results.badDebtReduction.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p style="font-size: 18px; color: #667eea;"><strong>Total Annual Benefit:</strong> $${results.totalAnnualBenefit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          
          <h3 style="margin-top: 20px;">ROI Metrics</h3>
          <p><strong>Net Annual Benefit:</strong> $${results.netAnnualBenefit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p style="font-size: 18px; color: #667eea;"><strong>ROI:</strong> ${results.roi.toFixed(1)}%</p>
          <p><strong>Payback Period:</strong> ${results.paybackMonths.toFixed(1)} months</p>
        </div>
      `
    }

    await resend.emails.send({
      from: process.env.AWS_SES_FROM_EMAIL || "noreply@kuhlekt.com",
      to: email,
      subject: `Your Kuhlekt ROI Analysis Results - ${company}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Kuhlekt</h1>
              <p style="color: white; margin: 10px 0 0 0;">ROI Analysis Results</p>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Dear ${name},</p>
              <p>Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
              ${emailContent}
              <p style="margin-top: 30px;">These results demonstrate the potential value Kuhlekt can bring to ${company}. Our team would be happy to discuss these findings in more detail.</p>
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Schedule a Demo</a>
              </div>
            </div>
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
              <p>&copy; ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    })

    console.log(`ROI email sent to ${email}`)
    return { success: true, message: "ROI results sent successfully" }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return { success: false, error: "Failed to send email" }
  }
}
