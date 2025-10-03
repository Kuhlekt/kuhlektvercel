"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const message = formData.get("message") as string

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .field { margin: 15px 0; }
          .label { font-weight: bold; color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>New Contact Form Submission</h2>
          <div class="field">
            <div class="label">Name:</div>
            <div>${name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div>${email}</div>
          </div>
          <div class="field">
            <div class="label">Company:</div>
            <div>${company}</div>
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
Company: ${company}
Message: ${message}
  `

  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: `New Contact Form: ${name} from ${company}`,
    text: textContent,
    html: htmlContent,
  })

  return result
}

export async function sendTestEmail(email: string) {
  const result = await sendEmail({
    to: email,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email to verify the email service is working correctly.",
    html: "<p>This is a test email to verify the email service is working correctly.</p>",
  })

  return result
}
