"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(formData: FormData) {
  try {
    const to = formData.get("to") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    const emailResult = await sendEmail({
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: emailResult.message,
        error: emailResult.error,
      }
    }

    return {
      success: true,
      message: "Test email sent successfully",
    }
  } catch (error) {
    console.error("Error in sendTestEmail:", error)
    return {
      success: false,
      message: "Failed to send test email",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
