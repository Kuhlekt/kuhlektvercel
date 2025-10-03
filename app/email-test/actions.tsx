"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(email: string) {
  try {
    if (!email) {
      return { success: false, message: "Email is required" }
    }

    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email from Kuhlekt. If you received this, the email system is working correctly!",
      html: "<h2>Test Email</h2><p>This is a test email from Kuhlekt. If you received this, the email system is working correctly!</p>",
    })

    return result
  } catch (error) {
    console.error("Error in sendTestEmail:", error)
    return {
      success: false,
      message: "Failed to send test email",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
