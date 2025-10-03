"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const phone = formData.get("phone") as string
  const message = formData.get("message") as string

  const html = `
    <html>
      <body>
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </body>
    </html>
  `

  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: `New Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nPhone: ${phone}\nMessage: ${message}`,
    html,
  })

  return result
}

export async function sendTestEmail() {
  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: "Test Email from Kuhlekt",
    text: "This is a test email from the Kuhlekt contact form.",
    html: "<html><body><h1>Test Email</h1><p>This is a test email from the Kuhlekt contact form.</p></body></html>",
  })

  return result
}
