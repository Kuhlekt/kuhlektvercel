"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(formData: FormData) {
  const email = formData.get("email") as string

  const subject = "Test Email from Kuhlekt"
  const text = "This is a test email to verify AWS SES integration."
  const html = `
    <h1>Test Email</h1>
    <p>This is a test email to verify AWS SES integration.</p>
    <p>If you received this, the email service is working correctly!</p>
  `

  const result = await sendEmail({ to: email, subject, text, html })
  return result
}
