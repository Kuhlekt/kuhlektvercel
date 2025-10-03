"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmailAction(to: string) {
  try {
    const result = await sendEmail({
      to,
      subject: "Test Email from Kuhlekt - Email Test Page",
      text: "This is a test email sent from the email test page.",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Test Email</h1>
              </div>
              <div class="content">
                <p>This is a test email sent from the Kuhlekt email test page.</p>
                <p>If you received this email, the email service is working correctly.</p>
              </div>
            </div>
          </body>
        </html>
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
