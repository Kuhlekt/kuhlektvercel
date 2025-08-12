import { sendEmailWithSES } from "./aws-ses"

interface EmailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  from?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const { to, subject, text, html, from } = options

  // Convert array to single recipient for now (AWS SES direct API limitation)
  const recipient = Array.isArray(to) ? to[0] : to

  const result = await sendEmailWithSES({
    to: recipient,
    subject,
    text: text || "",
    html,
  })

  if (!result.success) {
    throw new Error(result.message || "Failed to send email")
  }
}

export async function testAWSSES(): Promise<boolean> {
  try {
    const result = await sendEmailWithSES({
      to: process.env.AWS_SES_FROM_EMAIL || "test@kuhlekt.com",
      subject: "AWS SES Test Email",
      text: "This is a test email to verify AWS SES configuration.",
      html: "<p>This is a test email to verify AWS SES configuration.</p>",
    })
    return result.success
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
