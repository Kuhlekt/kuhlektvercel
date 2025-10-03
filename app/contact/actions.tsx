"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: `Contact Form: ${name}`,
    text: `From: ${name} (${email})\n\n${message}`,
    html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
  })

  return result
}

export async function sendTestEmail() {
  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: "Test Email",
    text: "This is a test email",
    html: "<p>This is a test email</p>",
  })

  return result
}
