"use server"

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

export async function submitContact(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const message = formData.get("message") as string

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Contact Form Submission",
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: `Thank you ${name}! We received your message: ${message}`,
            Charset: "UTF-8",
          },
          Html: {
            Data: `<p>Thank you ${name}! We received your message: ${message}</p>`,
            Charset: "UTF-8",
          },
        },
      },
    })

    await sesClient.send(command)

    return { success: true, message: "Contact form submitted successfully" }
  } catch (error) {
    console.error("Error:", error)
    return { success: false, message: "Failed to submit" }
  }
}
