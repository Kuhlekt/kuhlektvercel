"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(to: string): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const result = await sendEmail({
      to,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email from the Kuhlekt platform.",
      html: "<h1>Test Email</h1><p>This is a test email from the Kuhlekt platform.</p>",
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
