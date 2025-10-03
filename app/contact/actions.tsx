"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const message = formData.get("message") as string

    if (!name || !email || !message) {
      return {
        success: false,
        message: "Please fill in all required fields",
      }
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; }
          .content { padding: 20px; background: #f9fafb; }
          .field { margin: 15px 0; }
          .label { font-weight: bold; color: #1f2937; }
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

    const text = `
New Contact Form Submission

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ""}
Message: ${message}
    `

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `Contact Form: ${name}`,
      text,
      html,
    })

    return result
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "Failed to submit contact form",
    }
  }
}

export async function sendTestEmail(to: string) {
  try {
    const result = await sendEmail({
      to,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email.",
      html: "<p>This is a test email.</p>",
    })

    return result
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      message: "Failed to send test email",
    }
  }
}
