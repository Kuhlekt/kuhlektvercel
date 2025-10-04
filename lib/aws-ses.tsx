"use server"

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

// Initialize SES client
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
  text: string
  html: string
}

export async function sendEmail({ to, subject, text, html }: EmailParams) {
  try {
    const fromEmail = process.env.AWS_SES_FROM_EMAIL

    if (!fromEmail) {
      throw new Error("AWS_SES_FROM_EMAIL environment variable is not set")
    }

    const command = new SendEmailCommand({
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
          Text: {
            Data: text,
            Charset: "UTF-8",
          },
          Html: {
            Data: html,
            Charset: "UTF-8",
          },
        },
      },
    })

    const response = await sesClient.send(command)
    console.log("Email sent successfully:", response.MessageId)
    return { success: true, messageId: response.MessageId }
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

// Alias for backwards compatibility
export const sendEmailWithSES = sendEmail

export async function testAWSSESConnection() {
  try {
    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: "Test Email",
      text: "This is a test email",
      html: "<p>This is a test email</p>",
    })
    return { success: true, result }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function validateSESConfiguration() {
  const required = ["AWS_SES_ACCESS_KEY_ID", "AWS_SES_SECRET_ACCESS_KEY", "AWS_SES_REGION", "AWS_SES_FROM_EMAIL"]

  const missing = required.filter((key) => !process.env[key])

  return {
    isValid: missing.length === 0,
    missing,
    configured: required.filter((key) => process.env[key]),
  }
}
