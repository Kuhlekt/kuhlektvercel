"use server"

import { sendEmail } from "@/lib/aws-ses"

// In-memory store for verification codes
// In production, you might want to use Redis or a database
const verificationCodes = new Map<
  string,
  {
    code: string
    expiresAt: number
    data: any
  }
>()

// Clean up expired codes every 5 minutes
setInterval(
  () => {
    const now = Date.now()
    for (const [email, data] of verificationCodes.entries()) {
      if (data.expiresAt < now) {
        verificationCodes.delete(email)
      }
    }
  },
  5 * 60 * 1000,
)

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendVerificationCode(data: {
  name: string
  email: string
  company: string
  phone: string
  calculatorType: "simple" | "detailed"
  inputs: any
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Generate 6-digit code
    const code = generateCode()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store code with user data
    verificationCodes.set(data.email.toLowerCase(), {
      code,
      expiresAt,
      data,
    })

    // Send verification email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 40px 30px; border-radius: 0 0 8px 8px; }
            .code-box { background: white; border: 3px solid #0891b2; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
            .code { font-size: 48px; font-weight: bold; color: #0891b2; letter-spacing: 8px; font-family: 'Courier New', monospace; }
            .info-box { background: #ecfeff; border-left: 4px solid #0891b2; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🔐 Email Verification</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Kuhlekt ROI Calculator</p>
            </div>
            <div class="content">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.name},</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for using the Kuhlekt ROI Calculator! To view your personalized results, please verify your email address using the code below:
              </p>

              <div class="code-box">
                <div style="color: #6b7280; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</div>
                <div class="code">${code}</div>
                <div style="color: #6b7280; font-size: 12px; margin-top: 15px;">This code will expire in 10 minutes</div>
              </div>

              <div class="info-box">
                <p style="margin: 0; font-size: 14px;">
                  <strong>⏰ Important:</strong> This verification code is valid for 10 minutes only. If it expires, you can request a new code from the calculator.
                </p>
              </div>

              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                If you didn't request this code, you can safely ignore this email.
              </p>

              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 14px; color: #6b7280; margin: 5px 0;">
                  <strong>What happens next?</strong>
                </p>
                <ol style="font-size: 14px; color: #6b7280; margin: 10px 0; padding-left: 20px;">
                  <li>Enter the verification code in the calculator</li>
                  <li>View your personalized ROI analysis</li>
                  <li>Receive a detailed PDF report via email</li>
                </ol>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 5px 0;"><strong>Kuhlekt</strong> - Transforming Invoice-to-Cash</p>
              <p style="margin: 5px 0;">Visit us at <a href="https://kuhlekt.com" style="color: #0891b2; text-decoration: none;">kuhlekt.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail({
      to: data.email,
      subject: `Your Kuhlekt ROI Calculator Verification Code: ${code}`,
      html: emailHtml,
      text: `Your Kuhlekt ROI Calculator verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`,
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending verification code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send verification code",
    }
  }
}

export async function verifyCode(
  email: string,
  code: string,
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const stored = verificationCodes.get(email.toLowerCase())

    if (!stored) {
      return {
        success: false,
        error: "Verification code not found or expired. Please request a new code.",
      }
    }

    if (stored.expiresAt < Date.now()) {
      verificationCodes.delete(email.toLowerCase())
      return {
        success: false,
        error: "Verification code has expired. Please request a new code.",
      }
    }

    if (stored.code !== code) {
      return {
        success: false,
        error: "Invalid verification code. Please check and try again.",
      }
    }

    // Code is valid, return the stored data and clean up
    const userData = stored.data
    verificationCodes.delete(email.toLowerCase())

    return {
      success: true,
      data: userData,
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify code",
    }
  }
}
