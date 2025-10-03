"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(formData: FormData) {
  const to = formData.get("to") as string

  if (!to) {
    return { success: false, message: "Email address is required" }
  }

  const result = await sendEmail({
    to,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email to verify AWS SES integration is working correctly.",
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Test Email</h1>
          <p>This is a test email to verify AWS SES integration is working correctly.</p>
          <p style="color: #666; font-size: 12px;">Sent from Kuhlekt</p>
        </body>
      </html>
    `,
  })

  return result
}
