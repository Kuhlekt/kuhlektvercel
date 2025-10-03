"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const message = formData.get("message") as string

    const subject = `New Contact Form Submission from ${name}`
    const text = `
      Name: ${name}
      Email: ${email}
      Company: ${company}
      Message: ${message}
    `
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .field { margin: 15px 0; }
            .label { font-weight: bold; color: #4f46e5; }
            .value { margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>New Contact Form Submission</h2>
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
              <div class="value">${company}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${message}</div>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject,
      text,
      html,
    })

    return result
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return {
      success: false,
      message: "Failed to submit contact form",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function sendTestEmail(email: string) {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email to verify AWS SES configuration.",
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
              <p>This is a test email to verify your AWS SES configuration is working correctly.</p>
            </div>
          </body>
        </html>
      `,
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
