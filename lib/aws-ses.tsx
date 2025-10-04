import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

interface SendEmailParams {
  to: string | string[]
  subject: string
  htmlBody: string
  textBody?: string
}

export async function sendEmail({ to, subject, htmlBody, textBody }: SendEmailParams) {
  const toAddresses = Array.isArray(to) ? to : [to]

  const params = {
    Source: process.env.AWS_SES_FROM_EMAIL || "",
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
          Data: htmlBody,
          Charset: "UTF-8",
        },
        ...(textBody && {
          Text: {
            Data: textBody,
            Charset: "UTF-8",
          },
        }),
      },
    },
  }

  try {
    const command = new SendEmailCommand(params)
    const response = await sesClient.send(command)
    return { success: true, messageId: response.MessageId }
  } catch (error) {
    console.error("Error sending email via SES:", error)
    throw error
  }
}

export async function testAWSSESConnection() {
  try {
    const testEmail = process.env.AWS_SES_FROM_EMAIL || ""

    const result = await sendEmail({
      to: testEmail,
      subject: "AWS SES Connection Test",
      htmlBody: "<p>This is a test email to verify AWS SES connection.</p>",
      textBody: "This is a test email to verify AWS SES connection.",
    })

    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("AWS SES connection test failed:", error)
    return { success: false, error: String(error) }
  }
}

export async function validateSESConfiguration() {
  const requiredVars = ["AWS_SES_ACCESS_KEY_ID", "AWS_SES_SECRET_ACCESS_KEY", "AWS_SES_REGION", "AWS_SES_FROM_EMAIL"]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    return {
      valid: false,
      error: `Missing required environment variables: ${missing.join(", ")}`,
    }
  }

  return { valid: true }
}
