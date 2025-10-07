import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

let sesClient: SESClient | null = null

function getSESClient() {
  if (!sesClient) {
    console.log("=== Initializing SES Client ===")

    const region = process.env.AWS_SES_REGION || "us-east-1"
    const hasAccessKey = !!process.env.AWS_SES_ACCESS_KEY_ID
    const hasSecretKey = !!process.env.AWS_SES_SECRET_ACCESS_KEY

    console.log("Region:", region)
    console.log("Has access key:", hasAccessKey)
    console.log("Has secret key:", hasSecretKey)

    if (!hasAccessKey || !hasSecretKey) {
      console.error("✗ Missing AWS credentials!")
      throw new Error("Missing AWS SES credentials")
    }

    sesClient = new SESClient({
      region,
      credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
      },
    })

    console.log("✓ SES Client initialized")
  }

  return sesClient
}

interface EmailParams {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailParams) {
  console.log("=== AWS SES sendEmail START ===")
  console.log("Timestamp:", new Date().toISOString())

  try {
    const fromEmail = process.env.AWS_SES_FROM_EMAIL || "noreply@kuhlekt.com"
    console.log("From email:", fromEmail)

    const client = getSESClient()
    console.log("✓ Got SES client")

    const toAddresses = Array.isArray(to) ? to : [to]
    console.log("To addresses:", toAddresses)
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

    console.log("Creating SendEmailCommand...")
    const command = new SendEmailCommand(params)

    console.log("Sending email via AWS SES...")
    const response = await client.send(command)

    console.log("✓✓ Email sent successfully!")
    console.log("Message ID:", response.MessageId)
    console.log("Response metadata:", response.$metadata)

    return {
      success: true,
      messageId: response.MessageId,
      message: "Email sent successfully",
    }
  } catch (error) {
    console.error("=== AWS SES Error ===")
    console.error("Error type:", typeof error)
    console.error("Error:", error)

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

export async function sendEmailWithSES({ to, subject, html, text }: EmailParams) {
  return sendEmail({ to, subject, html, text })
}

export async function testAWSSESConnection() {
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
