"use server"

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

export async function sendTestEmail(toEmail: string) {
  try {
    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL || "",
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Subject: {
          Data: "Test Email from Kuhlekt",
        },
        Body: {
          Text: {
            Data: "This is a test email to verify AWS SES configuration.",
          },
        },
      },
    })

    await sesClient.send(command)

    return { success: true, message: "Test email sent successfully" }
  } catch (error) {
    console.error("Error sending test email:", error)
    return { success: false, error: "Failed to send test email" }
  }
}
