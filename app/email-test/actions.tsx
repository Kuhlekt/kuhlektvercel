"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(email: string) {
  const result = await sendEmail({
    to: email,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email from Kuhlekt to verify AWS SES configuration.",
    html: `
      <!DOCTYPE html>
      <html>
        <body>
          <h2>Test Email from Kuhlekt</h2>
          <p>This is a test email to verify AWS SES configuration.</p>
          <p>If you received this, the email service is working correctly!</p>
        </body>
      </html>
    `,
  })

  return result
}
