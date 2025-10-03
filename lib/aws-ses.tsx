import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

// Initialize SES client
const getSESClient = () => {
  const region = process.env.AWS_SES_REGION
  const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing AWS SES credentials. Please check your environment variables.")
  }

  return new SESClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
}

interface SendEmailResult {
  success: boolean
  messageId?: string
  message?: string
}

export async function sendEmail({ to, subject, html, text, from }: SendEmailParams): Promise<SendEmailResult> {
  try {
    console.log("[AWS SES] Preparing to send email")
    console.log("[AWS SES] To:", to)
    console.log("[AWS SES] Subject:", subject)

    const fromEmail = from || process.env.AWS_SES_FROM_EMAIL

    if (!fromEmail) {
      console.error("[AWS SES] Missing FROM email address")
      return {
        success: false,
        message: "Missing FROM email address in configuration",
      }
    }

    console.log("[AWS SES] From:", fromEmail)

    const sesClient = getSESClient()

    const recipients = Array.isArray(to) ? to : [to]

    const params = {
      Source: fromEmail,
      Destination: {
        ToAddresses: recipients,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: html,
            Charset: "UTF-8",
          },
          ...(text && {
            Text: {
              Data: text,
              Charset: "UTF-8",
            },
          }),
        },
      },
    }

    console.log("[AWS SES] Sending email command...")
    const command = new SendEmailCommand(params)
    const response = await sesClient.send(command)

    console.log("[AWS SES] Email sent successfully")
    console.log("[AWS SES] Message ID:", response.MessageId)

    return {
      success: true,
      messageId: response.MessageId,
      message: "Email sent successfully",
    }
  } catch (error) {
    console.error("[AWS SES] Error sending email:", error)

    if (error instanceof Error) {
      console.error("[AWS SES] Error name:", error.name)
      console.error("[AWS SES] Error message:", error.message)
      console.error("[AWS SES] Error stack:", error.stack)
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred while sending email",
    }
  }
}

// Export an alias for backward compatibility
export const sendEmailWithSES = sendEmail

// Test AWS SES connection
export async function testAWSSESConnection(): Promise<SendEmailResult> {
  try {
    const testEmail = process.env.AWS_SES_FROM_EMAIL
    if (!testEmail) {
      return {
        success: false,
        message: "Missing FROM email address in environment variables",
      }
    }

    return await sendEmail({
      to: testEmail,
      subject: "AWS SES Test Email",
      html: "<h1>Test Email</h1><p>This is a test email from AWS SES.</p>",
      text: "This is a test email from AWS SES.",
    })
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Validate SES configuration
export async function validateSESConfiguration(): Promise<{ valid: boolean; message: string }> {
  try {
    const region = process.env.AWS_SES_REGION
    const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY
    const fromEmail = process.env.AWS_SES_FROM_EMAIL

    if (!region) {
      return { valid: false, message: "Missing AWS_SES_REGION environment variable" }
    }
    if (!accessKeyId) {
      return { valid: false, message: "Missing AWS_SES_ACCESS_KEY_ID environment variable" }
    }
    if (!secretAccessKey) {
      return { valid: false, message: "Missing AWS_SES_SECRET_ACCESS_KEY environment variable" }
    }
    if (!fromEmail) {
      return { valid: false, message: "Missing AWS_SES_FROM_EMAIL environment variable" }
    }

    return { valid: true, message: "All AWS SES configuration variables are present" }
  } catch (error) {
    return {
      valid: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
