"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(email: string) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Test Email</h1>
            </div>
            <div class="content">
              <p>This is a test email from Kuhlekt.</p>
              <p>If you're seeing this, the email system is working correctly!</p>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email from Kuhlekt. If you're seeing this, the email system is working correctly!",
      html: htmlContent,
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
