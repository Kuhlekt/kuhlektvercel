"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(formData: FormData) {
  try {
    const email = formData.get("email") as string

    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email from Kuhlekt.",
      html: "<h1>Test Email</h1><p>This is a test email from Kuhlekt.</p>",
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
