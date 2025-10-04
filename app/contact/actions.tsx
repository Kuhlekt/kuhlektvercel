"use server"

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

export async function sendContactEmail(data: {
  name: string
  email: string
  phone: string
  company: string
  message: string
}) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 30px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .field { margin: 15px 0; }
          .label { font-weight: 600; color: #4b5563; }
          .value { color: #111827; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data.phone}</div>
            </div>
            <div class="field">
              <div class="label">Company:</div>
              <div class="value">${data.company}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${data.message}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [process.env.AWS_SES_FROM_EMAIL!],
      },
      Message: {
        Subject: {
          Data: `New Contact Form: ${data.name} from ${data.company}`,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlContent,
            Charset: "UTF-8",
          },
        },
      },
    })

    await sesClient.send(command)

    return { success: true }
  } catch (error) {
    console.error("Error sending contact email:", error)
    return { success: false, error: "Failed to send email" }
  }
}
