"use server"

import { sendEmail } from "@/lib/aws-ses"

interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
}

export async function submitContactForm(data: ContactFormData) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; }
            .content { padding: 20px; background-color: #f9f9f9; }
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
              ${
                data.company
                  ? `
              <div class="field">
                <div class="label">Company:</div>
                <div>${data.company}</div>
              </div>
              `
                  : ""
              }
              <div class="field">
                <div class="label">Message:</div>
                <div>${data.message}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.company ? `Company: ${data.company}` : ""}
Message: ${data.message}
    `

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `New Contact Form Submission from ${data.name}`,
      text: textContent,
      html: htmlContent,
    })

    if (!result.success) {
      throw new Error(result.error || "Failed to send email")
    }

    return { success: true }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit form",
    }
  }
}

export async function sendTestEmail(email: string) {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email to verify that email sending is working correctly.",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Test Email</h2>
              <p>This is a test email to verify that email sending is working correctly.</p>
            </div>
          </body>
        </html>
      `,
    })

    return result
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send test email",
    }
  }
}
