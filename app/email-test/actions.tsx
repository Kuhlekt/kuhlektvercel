"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(email: string) {
  const result = await sendEmail({
    to: email,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email to verify AWS SES integration.",
    html: "<h1>Test Email</h1><p>This is a test email to verify AWS SES integration.</p><p>If you received this, your email configuration is working correctly!</p>",
  })

  return result
}
