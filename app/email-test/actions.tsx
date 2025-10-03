"use server"

import { sendEmail, validateSESConfiguration } from "@/lib/aws-ses"

export async function sendTestEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const validation = await validateSESConfiguration()

    if (!validation.valid) {
      return {
        success: false,
        message: `Configuration issues: ${validation.issues.join(", ")}`,
      }
    }

    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email to verify AWS SES integration.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Email</h2>
          <p>This is a test email to verify AWS SES integration is working correctly.</p>
          <p style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #0ea5e9;">
            ✅ If you're reading this, the email configuration is working!
          </p>
        </div>
      `,
    })

    return result
  } catch (error) {
    console.error("Error in sendTestEmail action:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send test email",
    }
  }
}
