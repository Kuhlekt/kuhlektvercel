"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function testEmail(email: string) {
  try {
    console.log("[Email Test] Testing email to:", email)

    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: #0891b2;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px;
              }
              .content {
                padding: 20px;
                background: #f9fafb;
                margin-top: 20px;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Test Email</h1>
              </div>
              <div class="content">
                <p>This is a test email from Kuhlekt.</p>
                <p>If you received this, your email configuration is working correctly!</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: "This is a test email from Kuhlekt. If you received this, your email configuration is working correctly!",
    })

    console.log("[Email Test] Result:", result)

    return result
  } catch (error) {
    console.error("[Email Test] Error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
