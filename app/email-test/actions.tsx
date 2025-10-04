"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function testEmail(formData: FormData) {
  try {
    const toEmail = formData.get("email") as string

    const result = await sendEmail({
      to: toEmail,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email to verify AWS SES integration.",
      html: "<h2>Test Email</h2><p>This is a test email to verify AWS SES integration.</p>",
    })

    if (result.success) {
      return { success: true, message: "Test email sent successfully!" }
    } else {
      return { success: false, message: result.message, error: result.error }
    }
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      message: "Failed to send test email",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
