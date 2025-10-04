"use server"

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

export async function submitContactForm(data: {
  name: string
  email: string
  phone: string
  company: string
  message: string
}) {
  try {
    const emailContent = `
      New Contact Form Submission
      
      Name: ${data.name}
      Email: ${data.email}
      Phone: ${data.phone}
      Company: ${data.company}
      
      Message:
      ${data.message}
    `

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL || "",
      Destination: {
        ToAddresses: [process.env.ADMIN_EMAIL || ""],
      },
      Message: {
        Subject: {
          Data: `New Contact Form: ${data.company}`,
        },
        Body: {
          Text: {
            Data: emailContent,
          },
        },
      },
    })

    await sesClient.send(command)

    return { success: true }
  } catch (error) {
    console.error("Error sending contact form email:", error)
    return { success: false, error: "Failed to send message" }
  }
}
