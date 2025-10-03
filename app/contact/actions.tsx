"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `

  const textContent = `New Contact Form Submission\nName: ${name}\nEmail: ${email}\nMessage: ${message}`

  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: "New Contact Form Submission",
    text: textContent,
    html: htmlContent,
  })

  return result
}

export async function sendTestEmail(email: string) {
  const result = await sendEmail({
    to: email,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email",
    html: "<p>This is a test email</p>",
  })

  return result
}
