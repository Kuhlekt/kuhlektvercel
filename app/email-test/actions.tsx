"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(to: string) {
  const result = await sendEmail({
    to,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email to verify AWS SES is configured correctly.",
    html: "<p>This is a test email to verify AWS SES is configured correctly.</p>",
  })

  return result
}
