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
  from?: string
}

export async function sendEmail({ to, subject, html, text, from }: EmailParams) {
  const fromEmail = from || process.env.AWS_SES_FROM_EMAIL || "noreply@kuhlekt.com"

  const toAddresses = Array.isArray(to) ? to : [to]

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
    return { success: true, messageId: response.MessageId }
  } catch (error) {
    console.error("Error sending email via SES:", error)
    throw error
  }
}

// Export as alias for compatibility
export const sendEmailWithSES = sendEmail
