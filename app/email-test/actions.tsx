"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(to: string) {
  try {
    const result = await sendEmail({
      to,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email to verify AWS SES configuration.",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; }
              h1 { color: #4F46E5; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Test Email</h1>
              <p>This is a test email to verify AWS SES configuration.</p>
              <p>If you received this, the email service is working correctly!</p>
            </div>
          </body>
        </html>
      `,
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
