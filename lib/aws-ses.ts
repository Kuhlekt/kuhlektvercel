"use server"

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

export interface EmailParams {
  to: string
  subject: string
  text: string
  html: string
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: EmailParams): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    if (!process.env.AWS_SES_ACCESS_KEY_ID || !process.env.AWS_SES_SECRET_ACCESS_KEY) {
      return {
        success: false,
        message: "Email service not configured",
        error: "Missing AWS SES credentials",
      }
    }

    if (!process.env.AWS_SES_FROM_EMAIL) {
      return {
        success: false,
        message: "Email service not configured",
        error: "Missing from email address",
      }
    }

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL,
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

    await sesClient.send(command)

    return {
      success: true,
      message: "Email sent successfully",
    }
  } catch (error) {
    console.error("Error sending email via SES:", error)
    return {
      success: false,
      message: "Failed to send email",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export const sendEmailWithSES = sendEmail

export async function testAWSSESConnection(): Promise<{ success: boolean; message: string }> {
  try {
    if (!process.env.AWS_SES_ACCESS_KEY_ID || !process.env.AWS_SES_SECRET_ACCESS_KEY) {
      return {
        success: false,
        message: "AWS SES credentials not configured",
      }
    }

    return {
      success: true,
      message: "AWS SES configuration looks valid",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function validateSESConfiguration(): Promise<{ valid: boolean; issues: string[] }> {
  const issues: string[] = []

  if (!process.env.AWS_SES_ACCESS_KEY_ID) {
    issues.push("AWS_SES_ACCESS_KEY_ID is not set")
  }
  if (!process.env.AWS_SES_SECRET_ACCESS_KEY) {
    issues.push("AWS_SES_SECRET_ACCESS_KEY is not set")
  }
  if (!process.env.AWS_SES_REGION) {
    issues.push("AWS_SES_REGION is not set")
  }
  if (!process.env.AWS_SES_FROM_EMAIL) {
    issues.push("AWS_SES_FROM_EMAIL is not set")
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}
