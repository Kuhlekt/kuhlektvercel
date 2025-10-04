"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(to: string): Promise<{ success: boolean; message: string }> {
  try {
    const result = await sendEmail({
      to,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email to verify that the email service is working correctly.",
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Test Email</h1>
    </div>
    <div class="content">
      <p>This is a test email to verify that the email service is working correctly.</p>
      <p>If you received this email, the AWS SES integration is functioning properly.</p>
    </div>
  </div>
</body>
</html>
      `.trim(),
    })

    return result
  } catch (error) {
    console.error("Error in sendTestEmail:", error)
    return {
      success: false,
      message: "Failed to send test email",
    }
  }
}
