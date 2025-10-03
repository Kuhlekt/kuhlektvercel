"use server"

import { sendEmail } from "@/lib/aws-ses"

interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
}

export async function submitContactForm(data: ContactFormData) {
  try {
    const emailResult = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `New Contact Form Submission from ${data.name}`,
      text: `
Name: ${data.name}
Email: ${data.email}
Company: ${data.company || "N/A"}
Phone: ${data.phone || "N/A"}

Message:
${data.message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Company:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.company || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.phone || "N/A"}</td>
            </tr>
          </table>
          <div style="margin-top: 20px;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
        </div>
      `,
    })

    return emailResult
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "Failed to send message",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function sendTestEmail(to: string) {
  try {
    const result = await sendEmail({
      to,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email from your Kuhlekt application.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test Email</h2>
          <p>This is a test email from your Kuhlekt application.</p>
          <p>If you received this, your email configuration is working correctly!</p>
        </div>
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
