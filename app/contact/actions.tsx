"use server"

import { sendEmail } from "@/lib/aws-ses"

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  try {
    const subject = `New Contact Form Submission from ${data.name}`

    const text = `
New contact form submission:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Company: ${data.company || "Not provided"}

Message:
${data.message}
    `.trim()

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
    .field { margin: 15px 0; }
    .label { font-weight: 600; color: #667eea; }
    .value { margin-top: 5px; }
    .message { background: white; padding: 15px; border-radius: 5px; margin-top: 10px; }
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
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value">${data.email}</div>
      </div>
      <div class="field">
        <div class="label">Phone:</div>
        <div class="value">${data.phone || "Not provided"}</div>
      </div>
      <div class="field">
        <div class="label">Company:</div>
        <div class="value">${data.company || "Not provided"}</div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="message">${data.message.replace(/\n/g, "<br>")}</div>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim()

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "info@kuhlekt.com",
      subject,
      text,
      html,
    })

    if (result.success) {
      const confirmationResult = await sendEmail({
        to: data.email,
        subject: "Thank you for contacting Kuhlekt",
        text: `Dear ${data.name},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nBest regards,\nThe Kuhlekt Team`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You!</h1>
    </div>
    <div class="content">
      <p>Dear ${data.name},</p>
      <p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
      <p>Best regards,<br>The Kuhlekt Team</p>
    </div>
  </div>
</body>
</html>
        `.trim(),
      })
    }

    return result
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return {
      success: false,
      message: "Failed to submit contact form",
    }
  }
}
