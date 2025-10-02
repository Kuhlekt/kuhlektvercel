import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

// In-memory store for verification codes (in production, use Redis or database)
const verificationStore = new Map<
  string,
  {
    code: string
    timestamp: number
    data: any
  }
>()

// Code expiration time (10 minutes)
const CODE_EXPIRATION_MS = 10 * 60 * 1000

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Clean up expired codes
function cleanupExpiredCodes() {
  const now = Date.now()
  for (const [email, data] of verificationStore.entries()) {
    if (now - data.timestamp > CODE_EXPIRATION_MS) {
      verificationStore.delete(email)
      console.log(`[v0] Cleaned up expired code for ${email}`)
    }
  }
}

export async function sendVerificationCode(data: {
  name: string
  email: string
  company?: string
  phone: string
  calculatorType: string
  inputs: any
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("[v0] Starting verification code send process")
    console.log("[v0] Email:", data.email)
    console.log("[v0] Calculator type:", data.calculatorType)

    // Clean up expired codes first
    cleanupExpiredCodes()

    // Generate verification code
    const code = generateVerificationCode()
    console.log("[v0] Generated verification code:", code)

    // Store the code with user data
    verificationStore.set(data.email.toLowerCase(), {
      code,
      timestamp: Date.now(),
      data,
    })
    console.log("[v0] Stored verification code in memory")

    // Prepare email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .code-box { background: white; border: 2px solid #06b6d4; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 36px; font-weight: bold; color: #06b6d4; letter-spacing: 8px; font-family: monospace; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Kuhlekt ROI Calculator</h1>
              <p style="margin: 10px 0 0 0;">Email Verification</p>
            </div>
            <div class="content">
              <p>Hi ${data.name},</p>
              <p>Thank you for using our ROI Calculator! To view your personalized results, please verify your email address using the code below:</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              
              <p><strong>This code will expire in 10 minutes.</strong></p>
              
              <p>If you didn't request this code, you can safely ignore this email.</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
Hi ${data.name},

Thank you for using our ROI Calculator! To view your personalized results, please verify your email address using the code below:

Verification Code: ${code}

This code will expire in 10 minutes.

If you didn't request this code, you can safely ignore this email.

© ${new Date().getFullYear()} Kuhlekt. All rights reserved.
    `

    // Send email via AWS SES
    console.log("[v0] Preparing to send email via AWS SES")
    console.log("[v0] From email:", process.env.AWS_SES_FROM_EMAIL)
    console.log("[v0] To email:", data.email)

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [data.email],
      },
      Message: {
        Subject: {
          Data: "Your Kuhlekt ROI Calculator Verification Code",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: emailHtml,
            Charset: "UTF-8",
          },
          Text: {
            Data: emailText,
            Charset: "UTF-8",
          },
        },
      },
    })

    const response = await sesClient.send(command)
    console.log("[v0] SES response:", response)
    console.log("[v0] Email sent successfully!")

    return { success: true }
  } catch (error) {
    console.error("[v0] Error sending verification code:", error)
    console.error("[v0] Error details:", JSON.stringify(error, null, 2))
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
    console.log("[v0] Starting code verification")
    console.log("[v0] Email:", email)
    console.log("[v0] Code:", code)

    // Clean up expired codes first
    cleanupExpiredCodes()

    const stored = verificationStore.get(email.toLowerCase())
    console.log("[v0] Stored data found:", !!stored)

    if (!stored) {
      console.log("[v0] No verification code found for this email")
      return {
        success: false,
        error: "No verification code found. Please request a new code.",
      }
    }

    // Check if code has expired
    const now = Date.now()
    if (now - stored.timestamp > CODE_EXPIRATION_MS) {
      verificationStore.delete(email.toLowerCase())
      console.log("[v0] Code has expired")
      return {
        success: false,
        error: "Verification code has expired. Please request a new code.",
      }
    }

    // Verify the code
    if (stored.code !== code) {
      console.log("[v0] Code mismatch")
      return {
        success: false,
        error: "Invalid verification code. Please try again.",
      }
    }

    console.log("[v0] Code verified successfully!")

    // Return the stored data and remove from store
    const userData = stored.data
    verificationStore.delete(email.toLowerCase())

    return {
      success: true,
      data: userData,
    }
  } catch (error) {
    console.error("[v0] Error verifying code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify code",
    }
  }
}
