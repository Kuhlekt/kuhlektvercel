"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(to: string) {
  try {
    const result = await sendEmail({
      to,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email from Kuhlekt to verify AWS SES configuration.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Test Email</h1>
          <p>This is a test email from Kuhlekt to verify AWS SES configuration.</p>
          <p>If you received this email, your AWS SES is configured correctly!</p>
        </div>
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
