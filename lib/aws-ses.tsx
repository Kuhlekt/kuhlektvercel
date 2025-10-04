import { SESClient, SendEmailCommand, GetAccountSendingEnabledCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

interface EmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailParams) {
  const fromEmail = process.env.AWS_SES_FROM_EMAIL || "noreply@kuhlekt.com"

  const params = {
    Source: fromEmail,
    Destination: {
      ToAddresses: [to],
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
        Text: text
          ? {
              Data: text,
              Charset: "UTF-8",
            }
          : undefined,
      },
    },
  }

  try {
    const command = new SendEmailCommand(params)
    const response = await sesClient.send(command)
    console.log("Email sent successfully:", response.MessageId)
    return { success: true, messageId: response.MessageId }
  } catch (error) {
    console.error("Error sending email with SES:", error)
    throw error
  }
}

// Export as alias for compatibility
export const sendEmailWithSES = sendEmail

export async function testAWSSESConnection() {
  try {
    const command = new GetAccountSendingEnabledCommand({})
    const response = await sesClient.send(command)
    console.log("SES Connection Test:", response)
    return { success: true, enabled: response.Enabled }
  } catch (error) {
    console.error("SES Connection Test Failed:", error)
    return { success: false, error: String(error) }
  }
}

export async function validateSESConfiguration() {
  const requiredEnvVars = ["AWS_SES_ACCESS_KEY_ID", "AWS_SES_SECRET_ACCESS_KEY", "AWS_SES_REGION", "AWS_SES_FROM_EMAIL"]

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    return {
      valid: false,
      error: `Missing required environment variables: ${missingVars.join(", ")}`,
    }
  }

  try {
    const testResult = await testAWSSESConnection()
    if (!testResult.success) {
      return {
        valid: false,
        error: "SES connection test failed",
      }
    }

    return {
      valid: true,
      message: "SES configuration is valid",
    }
  } catch (error) {
    return {
      valid: false,
      error: `Configuration validation error: ${String(error)}`,
    }
  }
}
