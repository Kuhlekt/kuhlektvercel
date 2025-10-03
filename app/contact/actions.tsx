"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const message = formData.get("message") as string

  if (!name || !email || !message) {
    return { success: false, message: "Please fill in all required fields" }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin: 15px 0; }
        .label { font-weight: bold; color: #667eea; }
        .value { margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Contact Form Submission</h2>
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
          ${company ? `<div class="field"><div class="label">Company:</div><div class="value">${company}</div></div>` : ""}
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${message}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ""}
Message: ${message}
  `

  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: `New Contact Form Submission from ${name}`,
    text: textContent,
    html: htmlContent,
  })

  return result
}

export async function sendTestEmail() {
  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: "Test Email from Kuhlekt",
    text: "This is a test email to verify the email service is working correctly.",
    html: "<h1>Test Email</h1><p>This is a test email to verify the email service is working correctly.</p>",
  })

  return result
}
