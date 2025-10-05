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
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailParams) {
  const toAddresses = Array.isArray(to) ? to : [to]
  const fromEmail = process.env.AWS_SES_FROM_EMAIL || "noreply@kuhlekt.com"

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

  try {
    const command = new SendEmailCommand(params)
    const response = await sesClient.send(command)
    console.log("Email sent successfully:", response.MessageId)
    return { success: true, messageId: response.MessageId }
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
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

    await sendEmail(testEmail)
    return { success: true, message: "AWS SES connection successful" }
  } catch (error) {
    console.error("AWS SES connection test failed:", error)
    return { success: false, message: "AWS SES connection failed", error }
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
