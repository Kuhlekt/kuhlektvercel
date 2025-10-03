"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const message = formData.get("message") as string

  const subject = `New Contact Form Submission from ${name}`
  const text = `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`
  const html = `<h2>New Contact Form Submission</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Company:</strong> ${company}</p><p><strong>Message:</strong></p><p>${message}</p>`

  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject,
    text,
    html,
  })

  return result
}

export async function sendTestEmail(to: string) {
  const subject = "Test Email from Kuhlekt"
  const text = "This is a test email from Kuhlekt."
  const html = "<h1>Test Email</h1><p>This is a test email from Kuhlekt.</p>"

  const result = await sendEmail({ to, subject, text, html })
  return result
}
