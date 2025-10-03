"use server"

import { sendEmail } from "@/lib/aws-ses"

interface ContactFormData {
  name: string
  email: string
  company: string
  phone: string
  message: string
}

export async function submitContactForm(data: ContactFormData) {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; }
            .content { padding: 20px; background: #f9f9f9; }
            .field { margin: 15px 0; }
            .label { font-weight: bold; color: #4F46E5; }
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
                <div>${data.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div>${data.email}</div>
              </div>
              <div class="field">
                <div class="label">Company:</div>
                <div>${data.company}</div>
              </div>
              <div class="field">
                <div class="label">Phone:</div>
                <div>${data.phone}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div>${data.message}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
      New Contact Form Submission
      
      Name: ${data.name}
      Email: ${data.email}
      Company: ${data.company}
      Phone: ${data.phone}
      Message: ${data.message}
    `

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `New Contact Form: ${data.name} from ${data.company}`,
      text: emailText,
      html: emailHtml,
    })

    return result
  } catch (error) {
    console.error("Error in submitContactForm:", error)
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
      text: "This is a test email to verify AWS SES configuration.",
      html: "<h1>Test Email</h1><p>This is a test email to verify AWS SES configuration.</p>",
    })

    return result
  } catch (error) {
    console.error("Error in sendTestEmail:", error)
    return {
      success: false,
      message: "Failed to send test email",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
