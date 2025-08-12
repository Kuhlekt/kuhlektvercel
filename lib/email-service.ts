import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

interface EmailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
}

export async function sendEmail({ to, subject, text, html }: EmailOptions): Promise<void> {
  const fromEmail = process.env.AWS_SES_FROM_EMAIL || "noreply@kuhlekt.com"

  // Convert single recipient to array
  const recipients = Array.isArray(to) ? to : [to]

  const params = {
    Source: fromEmail,
    Destination: {
      ToAddresses: recipients,
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Text: text
          ? {
              Data: text,
              Charset: "UTF-8",
            }
          : undefined,
        Html: html
          ? {
              Data: html,
              Charset: "UTF-8",
            }
          : undefined,
      },
    },
  }

  try {
    const command = new SendEmailCommand(params)
    await sesClient.send(command)
    console.log(`Email sent successfully to ${recipients.join(", ")}`)
  } catch (error) {
    console.error("Error sending email:", error)
    throw new Error("Failed to send email")
  }
}

export async function sendBulkEmail(emails: EmailOptions[]): Promise<void> {
  const promises = emails.map((email) => sendEmail(email))
  await Promise.all(promises)
}

export async function testAWSSES(): Promise<boolean> {
  try {
    await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "test@kuhlekt.com",
      subject: "AWS SES Test Email",
      text: "This is a test email to verify AWS SES configuration.",
      html: "<p>This is a test email to verify AWS SES configuration.</p>",
    })
    return true
  } catch (error) {
    console.error("AWS SES test failed:", error)
    return false
  }
}
