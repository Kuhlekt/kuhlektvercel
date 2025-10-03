import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

// In-memory storage for verification codes
// Format: { email: { code: string, expiresAt: number } }
const verificationCodes = new Map<string, { code: string; expiresAt: number }>()

// Initialize AWS SES client
const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

/**
 * Generate a random 6-digit verification code
 */
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Store a verification code for an email with 10-minute expiration
 */
function storeVerificationCode(email: string, code: string): void {
  const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes
  verificationCodes.set(email, { code, expiresAt })
  console.log("[v0] Verification code stored:", { email, expiresAt: new Date(expiresAt).toISOString() })
}

/**
 * Send verification email via AWS SES
 */
async function sendVerificationEmail(email: string, code: string): Promise<void> {
  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Kuhlekt</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid #e5e5e5;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a1a;">Kuhlekt</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #1a1a1a;">Verify Your Email</h2>
                    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #4a4a4a;">
                      Thank you for your interest in Kuhlekt's ROI Calculator. To complete your request, please use the verification code below:
                    </p>
                    
                    <!-- Verification Code -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                      <tr>
                        <td align="center" style="padding: 20px; background-color: #f8f8f8; border-radius: 8px;">
                          <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a1a1a; font-family: 'Courier New', monospace;">
                            ${code}
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.5; color: #6a6a6a;">
                      This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e5e5; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
                    <p style="margin: 0; font-size: 14px; color: #6a6a6a;">
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

  const textBody = `
Verify Your Email - Kuhlekt

Thank you for your interest in Kuhlekt's ROI Calculator.

Your verification code is: ${code}

This code will expire in 10 minutes. If you didn't request this code, please ignore this email.

© ${new Date().getFullYear()} Kuhlekt. All rights reserved.
  `

  const command = new SendEmailCommand({
    Source: process.env.AWS_SES_FROM_EMAIL || "noreply@kuhlekt.com",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "Verify Your Email - Kuhlekt",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: "UTF-8",
        },
        Text: {
          Data: textBody,
          Charset: "UTF-8",
        },
      },
    },
  })

  console.log("[v0] Sending verification email to:", email)

  try {
    const response = await sesClient.send(command)
    console.log("[v0] Email sent successfully:", { messageId: response.MessageId })
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    throw new Error("Failed to send verification email")
  }
}

/**
 * Send a verification code to an email address
 * This is the main function called by the API route
 */
export async function sendVerificationCode(email: string): Promise<void> {
  console.log("[v0] Generating verification code for:", email)

  const code = generateVerificationCode()
  storeVerificationCode(email, code)
  await sendVerificationEmail(email, code)

  console.log("[v0] Verification code process completed for:", email)
}

/**
 * Verify a code for an email
 */
export function verifyCode(email: string, code: string): boolean {
  const stored = verificationCodes.get(email)

  if (!stored) {
    console.log("[v0] No verification code found for email:", email)
    return false
  }

  if (Date.now() > stored.expiresAt) {
    console.log("[v0] Verification code expired for email:", email)
    verificationCodes.delete(email)
    return false
  }

  if (stored.code !== code) {
    console.log("[v0] Verification code mismatch for email:", email)
    return false
  }

  console.log("[v0] Verification code verified successfully for email:", email)
  verificationCodes.delete(email)
  return true
}
