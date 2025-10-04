"use server"

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

export async function submitContactForm(formData: {
  name: string
  email: string
  phone: string
  company: string
  message: string
}) {
  try {
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>Company:</strong> ${formData.company}</p>
      <p><strong>Message:</strong></p>
      <p>${formData.message}</p>
    `

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [process.env.AWS_SES_FROM_EMAIL!],
      },
      Message: {
        Subject: {
          Data: `Contact Form: ${formData.name} from ${formData.company}`,
        },
        Body: {
          Html: {
            Data: emailHtml,
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
