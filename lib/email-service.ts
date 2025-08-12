import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  const fromEmail = process.env.AWS_SES_FROM_EMAIL || "noreply@kuhlekt.com"

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
        ...(html && {
          Html: {
            Data: html,
            Charset: "UTF-8",
          },
        }),
      },
    },
  })

  try {
    const response = await sesClient.send(command)
    console.log("Email sent successfully:", response.MessageId)
    return response
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}
