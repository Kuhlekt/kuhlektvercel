"use server"

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

export async function testEmail() {
  try {
    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: ["test@example.com"],
      },
      Message: {
        Subject: {
          Data: "Test Email",
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: "This is a test email",
            Charset: "UTF-8",
          },
          Html: {
            Data: "<p>This is a test email</p>",
            Charset: "UTF-8",
          },
        },
      },
    })

    await sesClient.send(command)

    return { success: true, message: "Test email sent successfully" }
  } catch (error) {
    console.error("Error:", error)
    return { success: false, message: "Failed to send test email" }
  }
}
