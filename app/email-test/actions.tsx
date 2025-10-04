"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(email: string) {
  const emailResult = await sendEmail({
    to: email,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email to verify AWS SES configuration.",
    html: "<h1>Test Email</h1><p>This is a test email to verify AWS SES configuration.</p>",
  })

  return emailResult
}
