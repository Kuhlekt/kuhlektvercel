import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

interface EmailParams {
  to: string | string[]
  subject: string
  html?: string
  text: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  message?: string
  error?: any
}

export async function sendEmail({ to, subject, html, text }: EmailParams): Promise<EmailResult> {
  console.log("=== AWS SES sendEmail ===")
  console.log("Checking environment variables...")

  const fromEmail = process.env.AWS_SES_FROM_EMAIL
  const region = process.env.AWS_SES_REGION || "us-east-1"
  const hasAccessKey = !!process.env.AWS_SES_ACCESS_KEY_ID
  const hasSecretKey = !!process.env.AWS_SES_SECRET_ACCESS_KEY

  console.log("From email:", fromEmail)
  console.log("Region:", region)
  console.log("Has access key:", hasAccessKey)
  console.log("Has secret key:", hasSecretKey)

  if (!fromEmail) {
    console.error("✗ Missing AWS_SES_FROM_EMAIL!")
    return {
      success: false,
      message: "Missing AWS_SES_FROM_EMAIL environment variable",
    }
  }

  if (!hasAccessKey || !hasSecretKey) {
    console.error("✗ Missing AWS credentials!")
    return {
      success: false,
      message: "Missing AWS SES credentials (AWS_SES_ACCESS_KEY_ID or AWS_SES_SECRET_ACCESS_KEY)",
    }
  }

  const toAddresses = Array.isArray(to) ? to : [to]
  console.log("Sending to:", toAddresses)
  console.log("Subject:", subject)
  console.log("Has HTML:", !!html)
  console.log("Has text:", !!text)

  const params = {
    Source: fromEmail,
    Destination: {
      ToAddresses: toAddresses,
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        ...(html && {
          Html: {
            Data: html,
            Charset: "UTF-8",
          },
        }),
        Text: {
          Data: text,
          Charset: "UTF-8",
        },
      },
    },
  }

  try {
    console.log("Creating SES command...")
    const command = new SendEmailCommand(params)

    console.log("Sending email via AWS SES...")
    const response = await sesClient.send(command)

    console.log("✓ Email sent successfully!")
    console.log("Message ID:", response.MessageId)

    return {
      success: true,
      messageId: response.MessageId,
      message: "Email sent successfully",
    }
  } catch (error) {
    console.error("=== AWS SES Error ===")
    console.error("Error sending email:", error)

    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      error: error,
    }
  }
}

export async function sendEmailWithSES({ to, subject, html, text }: EmailParams): Promise<EmailResult> {
  return sendEmail({ to, subject, html, text })
}

export async function testAWSSESConnection(): Promise<EmailResult> {
  try {
    const testEmail = {
      to: process.env.ADMIN_EMAIL || "test@example.com",
      subject: "AWS SES Connection Test",
      html: "<p>This is a test email to verify AWS SES configuration.</p>",
      text: "This is a test email to verify AWS SES configuration.",
    }

    const result = await sendEmail(testEmail)
    return result
  } catch (error) {
    console.error("AWS SES connection test failed:", error)
    return {
      success: false,
      message: "AWS SES connection failed",
      error,
    }
  }
}

export async function validateSESConfiguration() {
  const requiredEnvVars = ["AWS_SES_ACCESS_KEY_ID", "AWS_SES_SECRET_ACCESS_KEY", "AWS_SES_REGION", "AWS_SES_FROM_EMAIL"]

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    return {
      valid: false,
      message: `Missing required environment variables: ${missingVars.join(", ")}`,
      missingVars,
    }
  }

  return {
    valid: true,
    message: "All required AWS SES environment variables are configured",
  }
}
