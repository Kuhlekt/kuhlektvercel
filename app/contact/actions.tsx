"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin: 15px 0; padding: 15px; background: white; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <strong>Name:</strong> ${name}
          </div>
          <div class="field">
            <strong>Email:</strong> ${email}
          </div>
          <div class="field">
            <strong>Subject:</strong> ${subject}
          </div>
          <div class="field">
            <strong>Message:</strong><br>${message}
          </div>
        </div>
        <div class="footer">
          <p>© 2025 Kuhlekt. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

© 2025 Kuhlekt. All rights reserved.
  `

  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: `Contact Form: ${subject}`,
    text: textContent,
    html: htmlContent,
  })

  return result
}

export async function sendTestEmail(email: string) {
  const result = await sendEmail({
    to: email,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email to verify AWS SES configuration.",
    html: "<p>This is a test email to verify AWS SES configuration.</p>",
  })

  return result
}
