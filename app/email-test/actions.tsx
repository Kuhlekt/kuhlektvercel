"use server"

import { sendEmail } from "@/lib/aws-ses"

interface TestEmailParams {
  to: string
  subject: string
  message: string
}

export async function testEmailSend({ to, subject, message }: TestEmailParams) {
  try {
    console.log("[Email Test] Starting email test")
    console.log("[Email Test] To:", to)
    console.log("[Email Test] Subject:", subject)

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #f9fafb;
              border-radius: 8px;
              padding: 30px;
              border: 2px solid #0891b2;
            }
            .header {
              background: #0891b2;
              color: white;
              padding: 20px;
              border-radius: 6px;
              text-align: center;
              margin-bottom: 20px;
            }
            .message {
              background: white;
              padding: 20px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🧪 Test Email</h1>
            </div>
            <div class="message">
              <p>${message}</p>
            </div>
            <div class="footer">
              <p><strong>Kuhlekt</strong> - Email System Test</p>
              <p>Sent at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await sendEmail({
      to,
      subject,
      html,
      text: message,
    })

    if (!result.success) {
      console.error("[Email Test] Failed to send email:", result.message)
      return {
        success: false,
        message: result.message || "Failed to send test email",
      }
    }

    console.log("[Email Test] Email sent successfully")
    console.log("[Email Test] Message ID:", result.messageId)

    return {
      success: true,
      message: `Email sent successfully! Message ID: ${result.messageId}`,
    }
  } catch (error) {
    console.error("[Email Test] Exception:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
