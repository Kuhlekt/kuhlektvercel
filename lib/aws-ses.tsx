import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

export interface SendEmailParams {
  to: string
  subject: string
  html: string
  text: string
}

export interface SendEmailResult {
  success: boolean
  messageId?: string
  message?: string
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  try {
    console.log("[AWS SES] Sending email to:", params.to)
    console.log("[AWS SES] Subject:", params.subject)

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL || "",
      Destination: {
        ToAddresses: [params.to],
      },
      Message: {
        Subject: {
          Data: params.subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: params.html,
            Charset: "UTF-8",
          },
          Text: {
            Data: params.text,
            Charset: "UTF-8",
          },
        },
      },
    })

    const response = await sesClient.send(command)
    console.log("[AWS SES] Email sent successfully. MessageId:", response.MessageId)

    return {
      success: true,
      messageId: response.MessageId,
      message: "Email sent successfully",
    }
  } catch (error) {
    console.error("[AWS SES] Error sending email:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}

// Export alias for backward compatibility
export const sendEmailWithSES = sendEmail

// Validation function
export function validateSESConfiguration(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!process.env.AWS_SES_ACCESS_KEY_ID) {
    errors.push("AWS_SES_ACCESS_KEY_ID is not set")
  }
  if (!process.env.AWS_SES_SECRET_ACCESS_KEY) {
    errors.push("AWS_SES_SECRET_ACCESS_KEY is not set")
  }
  if (!process.env.AWS_SES_REGION) {
    errors.push("AWS_SES_REGION is not set")
  }
  if (!process.env.AWS_SES_FROM_EMAIL) {
    errors.push("AWS_SES_FROM_EMAIL is not set")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Test connection function
export async function testAWSSESConnection(): Promise<SendEmailResult> {
  const validation = validateSESConfiguration()

  if (!validation.valid) {
    return {
      success: false,
      message: `Configuration errors: ${validation.errors.join(", ")}`,
    }
  }

  try {
    // Send a test email to the from address
    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: "AWS SES Connection Test",
      html: "<h1>Test Email</h1><p>This is a test email to verify AWS SES configuration.</p>",
      text: "Test Email\n\nThis is a test email to verify AWS SES configuration.",
    })

    return result
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to test connection",
    }
  }
}
