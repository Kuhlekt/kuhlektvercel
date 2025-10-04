"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function testEmail(formData: FormData) {
  try {
    const toEmail = formData.get("email") as string

    if (!toEmail) {
      return {
        success: false,
        message: "Please provide an email address",
      }
    }

    const result = await sendEmail({
      to: toEmail,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email from the Kuhlekt platform. If you received this, the email service is working correctly!",
      html: `
        <h2>Test Email from Kuhlekt</h2>
        <p>This is a test email from the Kuhlekt platform.</p>
        <p>If you received this, the email service is working correctly!</p>
        <p>Best regards,<br>The Kuhlekt Team</p>
      `,
    })

    return result
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      message: "Failed to send test email",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
