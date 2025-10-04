"use server"

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

export async function sendTestEmail(email: string) {
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Test Email Successful</h1>
          </div>
          <div class="content">
            <p>This is a test email from Kuhlekt.</p>
            <p>If you're seeing this, the email service is working correctly!</p>
            <p>Sent at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Test Email from Kuhlekt",
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

    return { success: true, message: "Test email sent successfully!" }
  } catch (error) {
    console.error("Error sending test email:", error)
    return { success: false, error: "Failed to send test email" }
  }
}
