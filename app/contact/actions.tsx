"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: {
  name: string
  email: string
  company: string
  message: string
}) {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Company:</strong> ${formData.company}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
      </body>
    </html>
  `

  const textContent = `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Message: ${formData.message}
  `

  return await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: `New Contact Form Submission from ${formData.name}`,
    text: textContent,
    html: htmlContent,
  })
}

export async function sendTestEmail(to: string) {
  return await sendEmail({
    to,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email to verify AWS SES configuration.",
    html: "<p>This is a test email to verify AWS SES configuration.</p>",
  })
}
