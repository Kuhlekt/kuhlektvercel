"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const message = formData.get("message") as string

  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: `Contact Form: ${name} from ${company}`,
    text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nMessage: ${message}`,
    html: `<h2>Contact Form Submission</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Company:</strong> ${company}</p><p><strong>Message:</strong> ${message}</p>`,
  })

  return result
}

export async function sendTestEmail(email: string) {
  const result = await sendEmail({
    to: email,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email.",
    html: "<h1>Test Email</h1><p>This is a test email from Kuhlekt.</p>",
  })

  return result
}
