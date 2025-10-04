"use server"

import { sendEmail } from "@/lib/aws-ses"

export interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  try {
    const subject = `New Contact Form Submission from ${data.name}`

    const text = `
New contact form submission:

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || "N/A"}
Phone: ${data.phone || "N/A"}

Message:
${data.message}
    `

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
    .content { background: #f9fafb; padding: 20px; }
    .field { margin: 15px 0; padding: 10px; background: white; border-radius: 4px; }
    .label { font-weight: bold; color: #4b5563; }
    .value { color: #1f2937; margin-top: 5px; }
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
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value">${data.email}</div>
      </div>
      <div class="field">
        <div class="label">Company:</div>
        <div class="value">${data.company || "N/A"}</div>
      </div>
      <div class="field">
        <div class="label">Phone:</div>
        <div class="value">${data.phone || "N/A"}</div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="value">${data.message}</div>
      </div>
    </div>
  </div>
</body>
</html>
    `

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "info@kuhlekt.com",
      subject,
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
