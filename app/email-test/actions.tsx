"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(email: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Test Email</h1>
        </div>
        <div class="content">
          <p>This is a test email from Kuhlekt.</p>
          <p>If you received this, your email configuration is working correctly!</p>
        </div>
      </body>
    </html>
  `

  const textContent = `
Test Email from Kuhlekt

This is a test email from Kuhlekt.
If you received this, your email configuration is working correctly!
  `

  const result = await sendEmail({
    to: email,
    subject: "Test Email from Kuhlekt",
    text: textContent,
    html: htmlContent,
  })

  return result
}
