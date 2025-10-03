"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(email: string) {
  if (!email) {
    return { success: false, message: "Email address is required" }
  }

  const result = await sendEmail({
    to: email,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email to verify AWS SES configuration.",
    html: "<h1>Test Email</h1><p>This is a test email to verify AWS SES configuration.</p><p>If you received this, your email service is working correctly!</p>",
  })

  return result
}
