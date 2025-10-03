"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(formData: FormData) {
  const to = formData.get("to") as string

  const result = await sendEmail({
    to,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email to verify AWS SES configuration.",
    html: "<h1>Test Email</h1><p>This is a test email to verify AWS SES configuration.</p>",
  })

  return result
}
