"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function testEmail(formData: FormData) {
  try {
    const email = formData.get("email") as string

    if (!email) {
      return { success: false, message: "Email is required" }
    }

    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email from the Kuhlekt platform. If you received this, email is working correctly!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test Email</h2>
          <p>This is a test email from the Kuhlekt platform.</p>
          <p>If you received this, email is working correctly!</p>
        </div>
      `,
    })

    return result
  } catch (error) {
    console.error("Error in testEmail:", error)
    return {
      success: false,
      message: "Failed to send test email",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
