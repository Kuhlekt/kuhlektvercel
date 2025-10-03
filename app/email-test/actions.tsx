"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function testEmailSend(to: string) {
  try {
    const result = await sendEmail({
      to,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email to verify AWS SES configuration.",
      html: "<h1>Test Email</h1><p>This is a test email to verify AWS SES configuration.</p>",
    })

    return result
  } catch (error) {
    console.error("Error in testEmailSend:", error)
    return { success: false, message: "Failed to send test email", error: String(error) }
  }
}
