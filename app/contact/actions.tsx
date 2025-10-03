"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const message = formData.get("message") as string

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4f46e5; color: white; padding: 20px; }
            .content { padding: 20px; background: #f9fafb; }
            .field { margin: 15px 0; }
            .label { font-weight: bold; color: #6b7280; }
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
          </div>
        </body>
      </html>
    `

    const text = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Company: ${company}
Message: ${message}
    `

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `New Contact Form Submission from ${name}`,
      text,
      html,
    })

    return result
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "Failed to submit form",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function sendTestEmail(to: string) {
  try {
    const result = await sendEmail({
      to,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email from Kuhlekt.",
      html: "<p>This is a test email from Kuhlekt.</p>",
    })

    return result
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      message: "Failed to send test email",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
