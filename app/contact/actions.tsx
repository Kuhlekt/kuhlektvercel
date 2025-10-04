"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  const emailResult = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: `Contact Form: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
  })

  return emailResult
}

export async function sendTestEmail(email: string) {
  const emailResult = await sendEmail({
    to: email,
    subject: "Test Email",
    text: "This is a test email.",
    html: "<p>This is a test email.</p>",
  })

  return emailResult
}
