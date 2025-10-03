"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { success: false, message: "Email is required" }
  }

  const result = await sendEmail({
    to: email,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email from Kuhlekt to verify AWS SES is working correctly.",
    html: "<h1>Test Email</h1><p>This is a test email from Kuhlekt to verify AWS SES is working correctly.</p>",
  })

  return result
}
