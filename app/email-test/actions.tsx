"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(to: string, subject: string, message: string) {
  try {
    const result = await sendEmail({
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`,
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
