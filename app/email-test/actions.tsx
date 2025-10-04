"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email to verify AWS SES integration.",
      html: "<p>This is a test email to verify AWS SES integration.</p>",
    })

    return result
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      message: "Failed to send test email",
    }
  }
}
