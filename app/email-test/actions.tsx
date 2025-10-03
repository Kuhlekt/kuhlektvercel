"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(email: string) {
  return await sendEmail({
    to: email,
    subject: "Test Email",
    text: "This is a test email",
    html: "<h1>Test Email</h1><p>This is a test email</p>",
  })
}
