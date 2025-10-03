"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const message = formData.get("message") as string

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0066cc; color: white; padding: 20px; }
          .content { padding: 20px; background: #f9f9f9; }
          .field { margin: 15px 0; }
          .label { font-weight: bold; color: #666; }
          .value { margin-top: 5px; }
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
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <div class="label">Company:</div>
              <div class="value">${company || "Not provided"}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${message}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `

  const emailText = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Company: ${company || "Not provided"}
Message: ${message}
  `

  return await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "info@kuhlekt.com",
    subject: `New Contact Form Submission from ${name}`,
    text: emailText,
    html: emailHtml,
  })
}

export async function sendTestEmail() {
  return await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "info@kuhlekt.com",
    subject: "Test Email from Kuhlekt",
    text: "This is a test email to verify AWS SES configuration.",
    html: "<p>This is a test email to verify AWS SES configuration.</p>",
  })
}
