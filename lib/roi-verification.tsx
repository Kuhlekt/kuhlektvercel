import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

// In-memory storage for verification codes
// In production, use Redis or a database
const verificationCodes = new Map<string, { code: string; expiresAt: number }>()

// Initialize AWS SES client
const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

// Generate a 6-digit verification code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send verification code via email
export async function sendVerificationCode(email: string): Promise<void> {
  console.log("[v0] Generating verification code for:", email)

  // Generate and store code
  const code = generateCode()
  const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

  verificationCodes.set(email, { code, expiresAt })

  console.log("[v0] Code generated and stored:", { email, code, expiresAt })

  // Send email via AWS SES
  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 40px 20px 40px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a1a;">Kuhlekt</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 40px 20px 40px;">
                    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1a1a1a;">Your Verification Code</h2>
                    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #666666;">
                      Use the code below to complete your ROI calculator submission:
                    </p>
                    <div style="background-color: #f8f8f8; border-radius: 8px; padding: 24px; text-align: center; margin: 0 0 24px 0;">
                      <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a1a1a; font-family: 'Courier New', monospace;">
                        ${code}
                      </div>
                    </div>
                    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 20px; color: #999999;">
                      This code will expire in 10 minutes.
                    </p>
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #999999;">
                      If you didn't request this code, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 40px 40px 40px; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; font-size: 12px; line-height: 18px; color: #999999; text-align: center;">
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
Your Kuhlekt Verification Code

Use the code below to complete your ROI calculator submission:

${code}

This code will expire in 10 minutes.

If you didn't request this code, you can safely ignore this email.

© ${new Date().getFullYear()} Kuhlekt. All rights reserved.
  `

  const command = new SendEmailCommand({
    Source: process.env.AWS_SES_FROM_EMAIL || "noreply@kuhlekt.com",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "Your Kuhlekt Verification Code",
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

  try {
    const response = await sesClient.send(command)
    console.log("[v0] Email sent successfully:", response.MessageId)
  } catch (error) {
    console.error("[v0] Failed to send email:", error)
    throw new Error("Failed to send verification email")
  }
}

// Verify the code
export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  console.log("[v0] Verifying code for:", email, "Code:", code)

  const stored = verificationCodes.get(email)

  if (!stored) {
    console.log("[v0] No code found for email:", email)
    return { success: false, error: "Invalid or expired code" }
  }

  console.log("[v0] Stored code:", stored.code, "Provided code:", code)
  console.log("[v0] Expires at:", new Date(stored.expiresAt).toISOString())
  console.log("[v0] Current time:", new Date().toISOString())

  // Check if code has expired
  if (Date.now() > stored.expiresAt) {
    console.log("[v0] Code has expired")
    verificationCodes.delete(email)
    return { success: false, error: "Code has expired" }
  }

  // Check if code matches
  if (stored.code !== code) {
    console.log("[v0] Code mismatch")
    return { success: false, error: "Invalid code" }
  }

  // Code is valid, remove it
  console.log("[v0] Code verified successfully")
  verificationCodes.delete(email)

  return { success: true }
}
