"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(formData: FormData) {
  const email = formData.get("email") as string

  const result = await sendEmail({
    to: email,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email to verify AWS SES integration is working correctly.",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Test Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">Test Email</h2>
          <p>This is a test email to verify AWS SES integration is working correctly.</p>
          <p style="color: #4CAF50; font-weight: bold;">✓ If you're reading this, the integration is working!</p>
        </div>
      </body>
      </html>
    `,
  })

  return result
}
