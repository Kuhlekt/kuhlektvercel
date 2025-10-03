"use server"

import { createClient } from "@/lib/supabase/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

interface EmailParams {
  to: string
  subject: string
  text: string
  html: string
}

async function sendEmailViaSES({
  to,
  subject,
  text,
  html,
}: EmailParams): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    if (!process.env.AWS_SES_ACCESS_KEY_ID || !process.env.AWS_SES_SECRET_ACCESS_KEY) {
      return {
        success: false,
        message: "Email service not configured",
        error: "Missing AWS SES credentials",
      }
    }

    if (!process.env.AWS_SES_FROM_EMAIL) {
      return {
        success: false,
        message: "Email service not configured",
        error: "Missing from email address",
      }
    }

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: text,
            Charset: "UTF-8",
          },
          Html: {
            Data: html,
            Charset: "UTF-8",
          },
        },
      },
    })

    await sesClient.send(command)

    return {
      success: true,
      message: "Email sent successfully",
    }
  } catch (error) {
    console.error("Error sending email via SES:", error)
    return {
      success: false,
      message: "Failed to send email",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

function generateVerificationCodeInternal(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function storeVerificationCode(email: string, code: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    const { error } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt,
      attempts: 0,
    })

    if (error) {
      console.error("Error storing verification code:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in storeVerificationCode:", error)
    return false
  }
}

export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const code = generateVerificationCodeInternal()
    const stored = await storeVerificationCode(email, code)

    if (!stored) {
      return {
        success: false,
        message: "Failed to store verification code. Please try again.",
      }
    }

    const emailResult = await sendEmailViaSES({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your Verification Code</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          <p>This code will expire in 15 minutes.</p>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification code. Please try again.",
      }
    }

    return {
      success: true,
      message: "Verification code sent successfully!",
    }
  } catch (error) {
    console.error("Error in sendVerificationCode:", error)
    return {
      success: false,
      message: "Failed to send verification code. Please try again.",
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
      .single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid verification code.",
      }
    }

    if (new Date(data.expires_at) < new Date()) {
      return {
        success: false,
        message: "Verification code has expired.",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      }
    }

    await supabase
      .from("verification_codes")
      .update({ attempts: data.attempts + 1 })
      .eq("id", data.id)

    return {
      success: true,
      message: "Email verified successfully!",
    }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      message: "Failed to verify code. Please try again.",
    }
  }
}

export async function calculateSimpleROI(data: any) {
  const annualRevenue = Number.parseFloat(data.annualRevenue) || 0
  const averageInvoiceValue = Number.parseFloat(data.averageInvoiceValue) || 0
  const currentDSO = Number.parseFloat(data.currentDSO) || 0

  const targetDSO = Math.max(currentDSO * 0.7, 30)
  const dsoReduction = currentDSO - targetDSO
  const daysImprovement = dsoReduction
  const cashFlowImprovement = (annualRevenue / 365) * daysImprovement
  const yearlyValue = cashFlowImprovement

  return {
    currentDSO,
    targetDSO,
    dsoReduction,
    cashFlowImprovement,
    yearlyValue,
    annualRevenue,
  }
}

export async function calculateDetailedROI(data: any) {
  const simpleROI = await calculateSimpleROI(data)

  const monthlyInvoices = Number.parseFloat(data.monthlyInvoices) || 0
  const hoursPerInvoice = Number.parseFloat(data.hoursPerInvoice) || 0
  const hourlyRate = Number.parseFloat(data.hourlyRate) || 0

  const currentMonthlyCost = monthlyInvoices * hoursPerInvoice * hourlyRate
  const automatedMonthlyCost = currentMonthlyCost * 0.3
  const monthlySavings = currentMonthlyCost - automatedMonthlyCost
  const yearlySavings = monthlySavings * 12

  const totalYearlyBenefit = simpleROI.yearlyValue + yearlySavings

  return {
    ...simpleROI,
    currentMonthlyCost,
    automatedMonthlyCost,
    monthlySavings,
    yearlySavings,
    totalYearlyBenefit,
  }
}

export async function sendROIEmail(email: string, results: any): Promise<{ success: boolean; message: string }> {
  try {
    const emailResult = await sendEmailViaSES({
      to: email,
      subject: "Your Kuhlekt ROI Analysis Results",
      text: `Your ROI Analysis Results\n\nCash Flow Improvement: $${results.cashFlowImprovement.toFixed(2)}\nYearly Value: $${results.yearlyValue.toFixed(2)}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your ROI Analysis Results</h2>
          <p><strong>Cash Flow Improvement:</strong> $${results.cashFlowImprovement.toFixed(2)}</p>
          <p><strong>Yearly Value:</strong> $${results.yearlyValue.toFixed(2)}</p>
        </div>
      `,
    })

    return emailResult
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      message: "Failed to send ROI report.",
    }
  }
}

export { generateVerificationCodeInternal as generateVerificationCode }
