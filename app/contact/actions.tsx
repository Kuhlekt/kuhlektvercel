"use server"

import { sendEmail } from "@/lib/aws-ses"

interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
  recaptchaToken: string
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 20px; }
            .field { margin: 15px 0; }
            .label { font-weight: bold; color: #1e40af; }
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
                <div class="value">${formData.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${formData.email}</div>
              </div>
              ${
                formData.company
                  ? `
              <div class="field">
                <div class="label">Company:</div>
                <div class="value">${formData.company}</div>
              </div>
              `
                  : ""
              }
              ${
                formData.phone
                  ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${formData.phone}</div>
              </div>
              `
                  : ""
              }
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${formData.message}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
${formData.company ? `Company: ${formData.company}` : ""}
${formData.phone ? `Phone: ${formData.phone}` : ""}

Message:
${formData.message}
    `

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `New Contact Form Submission from ${formData.name}`,
      text: textContent,
      html: htmlContent,
    })

    return result
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "Failed to submit contact form",
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
