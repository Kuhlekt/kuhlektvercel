"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  if (!name || !email || !message) {
    return { success: false, message: "Missing required fields" }
  }

  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: `Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `<h2>Contact Form Submission</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
  })

  return result
}

export async function sendTestEmail(email: string) {
  const result = await sendEmail({
    to: email,
    subject: "Test Email",
    text: "This is a test email from the contact form.",
    html: "<h1>Test Email</h1><p>This is a test email from the contact form.</p>",
  })

  return result
}
