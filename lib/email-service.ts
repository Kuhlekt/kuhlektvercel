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
  from?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const { to, subject, text, html, from } = options

  const fromEmail = from || process.env.AWS_SES_FROM_EMAIL || "noreply@kuhlekt.com"
  const recipients = Array.isArray(to) ? to : [to]

  try {
    const command = new SendEmailCommand({
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
    })

    const result = await sesClient.send(command)
    console.log("Email sent successfully:", result.MessageId)
  } catch (error) {
    console.error("Error sending email:", error)
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
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

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Welcome to Kuhlekt!",
    html: `
      <h1>Welcome to Kuhlekt, ${name}!</h1>
      <p>Thank you for joining our AR automation platform.</p>
      <p>We're excited to help you transform your accounts receivable process.</p>
      <p>Best regards,<br>The Kuhlekt Team</p>
    `,
    text: `Welcome to Kuhlekt, ${name}! Thank you for joining our AR automation platform. We're excited to help you transform your accounts receivable process. Best regards, The Kuhlekt Team`,
  })
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${resetToken}`

  await sendEmail({
    to: email,
    subject: "Password Reset Request - Kuhlekt",
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your Kuhlekt account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this reset, please ignore this email.</p>
      <p>Best regards,<br>The Kuhlekt Team</p>
    `,
    text: `You requested a password reset for your Kuhlekt account. Visit this link to reset your password: ${resetUrl}. This link will expire in 1 hour. If you didn't request this reset, please ignore this email.`,
  })
}

export async function sendContactFormEmail(
  name: string,
  email: string,
  company: string,
  message: string,
): Promise<void> {
  await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "contact@kuhlekt.com",
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
    text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\nMessage: ${message}`,
  })
}
