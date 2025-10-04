"use server"

import { createClient } from "@supabase/supabase-js"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

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
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const { error } = await supabase.from("verification_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (error) {
      console.error("Error storing verification code:", error)
      return { success: false, error: "Failed to generate code" }
    }

    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Your Kuhlekt ROI Calculator Verification Code",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
              </head>
              <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0;">Verification Code</h1>
                  </div>
                  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
                    <p style="font-size: 16px; color: #374151; margin-bottom: 30px;">
                      Your verification code for the Kuhlekt ROI Calculator is:
                    </p>
                    <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
                      <p style="font-size: 36px; font-weight: bold; color: #0891b2; margin: 0; letter-spacing: 8px;">${code}</p>
                    </div>
                    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                      This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
                    </p>
                  </div>
                </div>
              </body>
              </html>
            `,
            Charset: "UTF-8",
          },
        },
      },
    }

    await sesClient.send(new SendEmailCommand(emailParams))

    return { success: true }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return { success: false, error: "Failed to send code" }
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

    let htmlContent = ""

    if (calculatorType === "simple") {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">Your ROI Analysis Results</h1>
            </div>
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb;">
              <p style="font-size: 16px; color: #374151;">Hi ${name},</p>
              <p style="font-size: 14px; color: #6b7280;">Thank you for using the Kuhlekt ROI Calculator. Here are your results:</p>
              
              <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="font-size: 14px; color: #0f766e; margin: 0 0 10px 0;">Estimated Annual Savings</p>
                <p style="font-size: 32px; font-weight: bold; color: #0891b2; margin: 0;">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>

              <div style="margin: 30px 0;">
                <h3 style="color: #374151; margin-bottom: 15px;">Key Metrics</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Current DSO</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #374151;">${results.currentDSO} days</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">New DSO</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #0891b2;">${results.newDSO?.toFixed(0)} days</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Cash Released</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #059669;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    } else {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">Your Detailed ROI Analysis</h1>
            </div>
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb;">
              <p style="font-size: 16px; color: #374151;">Hi ${name},</p>
              <p style="font-size: 14px; color: #6b7280;">Thank you for using the Kuhlekt ROI Calculator. Here are your detailed results:</p>
              
              <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="font-size: 14px; color: #0f766e; margin: 0 0 10px 0;">Total Annual Benefit</p>
                <p style="font-size: 32px; font-weight: bold; color: #0891b2; margin: 0;">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p style="font-size: 14px; color: #6b7280; margin: 10px 0 0 0;">ROI: ${results.roi?.toFixed(0)}% | Payback: ${results.paybackMonths?.toFixed(1)} months</p>
              </div>

              <div style="margin: 30px 0;">
                <h3 style="color: #374151; margin-bottom: 15px;">Savings Breakdown</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Labour Cost Savings</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #059669;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Interest Savings</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #059669;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Bad Debt Reduction</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #059669;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0; color: #6b7280;">Working Capital Released</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #059669;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: `Your Kuhlekt ROI Analysis Results - ${company}`,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlContent,
            Charset: "UTF-8",
          },
        },
      },
    }

    await sesClient.send(new SendEmailCommand(emailParams))

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return { success: false, error: "Failed to send email" }
  }
}
