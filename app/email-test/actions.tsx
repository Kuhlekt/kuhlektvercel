"use server"

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

export async function sendTestEmail(formData: FormData) {
  try {
    const email = formData.get("email") as string

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Test Email from Kuhlekt",
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: "This is a test email to verify AWS SES integration is working correctly.",
            Charset: "UTF-8",
          },
          Html: {
            Data: "<h1>Test Email</h1><p>This is a test email to verify AWS SES integration is working correctly.</p>",
            Charset: "UTF-8",
          },
        },
      },
    })

    await sesClient.send(command)

    return { success: true, message: "Test email sent successfully" }
  } catch (error) {
    console.error("Error in sendTestEmail:", error)
    return { success: false, message: "Failed to send test email" }
  }
}
