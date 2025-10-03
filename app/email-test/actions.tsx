"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(to: string) {
  return await sendEmail({
    to,
    subject: "Test Email",
    text: "This is a test email",
    html: "<p>This is a test email</p>",
  })
}
