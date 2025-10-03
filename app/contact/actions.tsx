"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  if (!name || !email || !message) {
    return { success: false, message: "All fields are required" }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #4F46E5; color: white; padding: 20px; }
          .content { padding: 20px; }
          .field { margin: 15px 0; }
          .label { font-weight: bold; color: #4F46E5; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div>${name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div>${email}</div>
          </div>
          <div class="field">
            <div class="label">Message:</div>
            <div>${message}</div>
          </div>
        </div>
      </body>
    </html>
  `

  const textContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Message: ${message}
  `

  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: `Contact Form: ${name}`,
    text: textContent,
    html: htmlContent,
  })

  return result
}

export async function sendTestEmail(email: string) {
  const result = await sendEmail({
    to: email,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email from Kuhlekt.",
    html: "<h1>Test Email</h1><p>This is a test email from Kuhlekt.</p>",
  })

  return result
}
