"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const message = formData.get("message") as string

  const subject = `Contact Form Submission from ${name}`
  const text = `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nMessage: ${message}`
  const html = `
    <h1>Contact Form Submission</h1>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Company:</strong> ${company}</p>
    <p><strong>Message:</strong> ${message}</p>
  `

  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject,
    text,
    html,
  })
  return result
}
