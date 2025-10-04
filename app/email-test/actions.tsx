"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(to: string) {
  return await sendEmail({
    to,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email to verify AWS SES configuration.",
    html: "<p>This is a test email to verify AWS SES configuration.</p>",
  })
}
