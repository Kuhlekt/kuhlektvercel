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
  const params = {
    Source: process.env.AWS_SES_FROM_EMAIL || "noreply@kuhlekt.com",
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
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td align="center" style="padding: 40px 0;">
                      <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <tr>
                          <td style="padding: 40px 40px 20px 40px; text-align: center;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #000000;">Kuhlekt</h1>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0 40px 20px 40px;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                              Your verification code for the ROI Calculator is:
                            </p>
                            <div style="background-color: #f5f5f5; border-radius: 8px; padding: 24px; text-align: center; margin: 20px 0;">
                              <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #000000;">${code}</span>
                            </div>
                            <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 20px; color: #666666;">
                              This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 20px 40px 40px 40px; border-top: 1px solid #e5e5e5;">
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
          `,
          Charset: "UTF-8",
        },
      },
    },
  }

  try {
    console.log("[v0] Sending email via AWS SES to:", email)
    const command = new SendEmailCommand(params)
    const response = await sesClient.send(command)
    console.log("[v0] Email sent successfully:", response.MessageId)
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    throw new Error("Failed to send verification email")
  }
}

// Verify the code
export function verifyCode(email: string, code: string): boolean {
  console.log("[v0] Verifying code for:", email, "Code:", code)

  const stored = verificationCodes.get(email)

  if (!stored) {
    console.log("[v0] No code found for email:", email)
    return false
  }

  if (Date.now() > stored.expiresAt) {
    console.log("[v0] Code expired for email:", email)
    verificationCodes.delete(email)
    return false
  }

  if (stored.code !== code) {
    console.log("[v0] Code mismatch for email:", email)
    return false
  }

  console.log("[v0] Code verified successfully for email:", email)
  verificationCodes.delete(email)
  return true
}
