"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIData {
  email: string
  annualRevenue: number
  currentDSO: number
  avgInvoiceValue: number
  monthlyInvoices: number
}

export async function sendROIReport(data: ROIData) {
  try {
    const targetDSO = Math.max(data.currentDSO - 15, 30)
    const dsoReduction = data.currentDSO - targetDSO
    const daysImprovement = dsoReduction
    const annualSavings = (data.annualRevenue / 365) * daysImprovement
    const monthlySavings = annualSavings / 12

    const emailHtml = `
      <h2>Your ROI Calculator Results</h2>
      <p>Based on your inputs:</p>
      <ul>
        <li>Annual Revenue: $${data.annualRevenue.toLocaleString()}</li>
        <li>Current DSO: ${data.currentDSO} days</li>
        <li>Target DSO: ${targetDSO} days</li>
        <li>Average Invoice Value: $${data.avgInvoiceValue.toLocaleString()}</li>
        <li>Monthly Invoices: ${data.monthlyInvoices}</li>
      </ul>
      <h3>Potential Impact:</h3>
      <ul>
        <li>DSO Reduction: ${dsoReduction} days</li>
        <li>Annual Savings: $${annualSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
        <li>Monthly Savings: $${monthlySavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
      </ul>
    `

    const emailText = `Your ROI Calculator Results\n\nBased on your inputs:\nAnnual Revenue: $${data.annualRevenue.toLocaleString()}\nCurrent DSO: ${data.currentDSO} days\nTarget DSO: ${targetDSO} days\nAverage Invoice Value: $${data.avgInvoiceValue.toLocaleString()}\nMonthly Invoices: ${data.monthlyInvoices}\n\nPotential Impact:\nDSO Reduction: ${dsoReduction} days\nAnnual Savings: $${annualSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nMonthly Savings: $${monthlySavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    const result = await sendEmail({
      to: data.email,
      subject: "Your Kuhlekt ROI Calculator Results",
      text: emailText,
      html: emailHtml,
    })

    if (!result.success) {
      return { success: false, message: result.message || "Failed to send email" }
    }

    return { success: true, message: "ROI report sent successfully" }
  } catch (error) {
    console.error("Error in sendROIReport:", error)
    return { success: false, message: "An error occurred while sending the report" }
  }
}

export async function generateVerificationCode(email: string) {
  try {
    const supabase = await createClient()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const { error: deleteError } = await supabase.from("verification_codes").delete().eq("email", email)

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      return { success: false, message: "Failed to generate verification code" }
    }

    const emailHtml = `
      <h2>Your Verification Code</h2>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `

    const emailText = `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`

    const result = await sendEmail({
      to: email,
      subject: "Your Kuhlekt Verification Code",
      text: emailText,
      html: emailHtml,
    })

    if (!result.success) {
      return { success: false, message: "Failed to send verification code" }
    }

    return { success: true, message: "Verification code sent" }
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
    return { success: false, message: "An error occurred" }
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("verification_codes").select("*").eq("email", email).single()

    if (error || !data) {
      return { success: false, message: "Invalid or expired code" }
    }

    if (data.attempts >= 3) {
      return { success: false, message: "Too many attempts. Please request a new code." }
    }

    if (new Date(data.expires_at) < new Date()) {
      await supabase.from("verification_codes").delete().eq("email", email)
      return { success: false, message: "Code has expired" }
    }

    if (data.code !== code) {
      await supabase
        .from("verification_codes")
        .update({ attempts: data.attempts + 1 })
        .eq("email", email)
      return { success: false, message: "Invalid code" }
    }

    await supabase.from("verification_codes").delete().eq("email", email)

    return { success: true, message: "Code verified successfully" }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return { success: false, message: "An error occurred during verification" }
  }
}
