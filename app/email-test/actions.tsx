"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(formData: FormData) {
  try {
    const to = formData.get("to") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    if (!to || !subject || !message) {
      return {
        success: false,
        message: "All fields are required",
      }
    }

    const text = message
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Test Email from Kuhlekt</h1>
            </div>
            <div class="content">
              <p>${message}</p>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await sendEmail({
      to,
      subject,
      text,
      html,
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
