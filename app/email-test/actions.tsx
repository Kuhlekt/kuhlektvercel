"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(email: string) {
  const result = await sendEmail({
    to: email,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email from the Kuhlekt platform.",
    html: "<p>This is a <strong>test email</strong> from the Kuhlekt platform.</p>",
  })

  return result
}
