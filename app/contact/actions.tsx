"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const message = formData.get("message") as string

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </body>
    </html>
  `

  const textContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Company: ${company}
Message: ${message}
  `

  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "contact@kuhlekt.com",
    subject: `New Contact Form Submission from ${name}`,
    text: textContent,
    html: htmlContent,
  })

  return result
}

export async function sendTestEmail(to: string) {
  const result = await sendEmail({
    to,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email to verify the email service is working correctly.",
    html: "<p>This is a test email to verify the email service is working correctly.</p>",
  })

  return result
}
