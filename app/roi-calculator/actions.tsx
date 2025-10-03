"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ROIData {
  companyName: string
  email: string
  annualRevenue: number
  currentDSO: number
  targetDSO: number
  industryType: string
}

export async function sendROIReport(data: ROIData) {
  try {
    const supabase = await createClient()

    const emailSubject = `ROI Analysis Report for ${data.companyName}`
    const emailText = `Dear ${data.companyName},

Thank you for your interest in Kuhlekt's AR automation platform.

Here are your ROI results:
- Annual Revenue: $${data.annualRevenue.toLocaleString()}
- Current DSO: ${data.currentDSO} days
- Target DSO: ${data.targetDSO} days
- Industry: ${data.industryType}

Our team will be in touch shortly to discuss how we can help optimize your accounts receivable process.

Best regards,
The Kuhlekt Team`

    const emailHtml = `
      <h2>ROI Analysis Report</h2>
      <p>Dear ${data.companyName},</p>
      <p>Thank you for your interest in Kuhlekt's AR automation platform.</p>
      <h3>Your ROI Results:</h3>
      <ul>
        <li><strong>Annual Revenue:</strong> $${data.annualRevenue.toLocaleString()}</li>
        <li><strong>Current DSO:</strong> ${data.currentDSO} days</li>
        <li><strong>Target DSO:</strong> ${data.targetDSO} days</li>
        <li><strong>Industry:</strong> ${data.industryType}</li>
      </ul>
      <p>Our team will be in touch shortly to discuss how we can help optimize your accounts receivable process.</p>
      <p>Best regards,<br>The Kuhlekt Team</p>
    `

    const result = await sendEmail({
      to: data.email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    })

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to send email",
      }
    }

    return {
      success: true,
      message: "ROI report sent successfully",
    }
  } catch (error) {
    console.error("Error in sendROIReport:", error)
    return {
      success: false,
      message: "An error occurred while sending the report",
    }
  }
}

export async function generateVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: deleteError } = await supabase.from("verification_codes").delete().eq("email", email)

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt,
      attempts: 0,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      return {
        success: false,
        message: "Failed to generate verification code",
      }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
      html: `<p>Your verification code is: <strong>${code}</strong></p><p>This code will expire in 10 minutes.</p>`,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send verification email",
      }
    }

    return {
      success: true,
      message: "Verification code sent successfully",
    }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      message: "An error occurred",
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("verification_codes").select("*").eq("email", email).single()

    if (error || !data) {
      return {
        success: false,
        message: "Invalid verification code",
      }
    }

    if (new Date(data.expires_at) < new Date()) {
      return {
        success: false,
        message: "Verification code has expired",
      }
    }

    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many failed attempts",
      }
    }

    if (data.code !== code) {
      await supabase
        .from("verification_codes")
        .update({ attempts: data.attempts + 1 })
        .eq("email", email)

      return {
        success: false,
        message: "Invalid verification code",
      }
    }

    await supabase.from("verification_codes").delete().eq("email", email)

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      message: "An error occurred",
    }
  }
}
