"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  const result = await sendEmail({
    to: "contact@example.com",
    subject: `Contact form from ${name}`,
    text: message,
    html: `<p>${message}</p>`,
  })

  return result
}

export async function sendTestEmail(email: string) {
  return await sendEmail({
    to: email,
    subject: "Test Email",
    text: "This is a test",
    html: "<p>This is a test</p>",
  })
}
