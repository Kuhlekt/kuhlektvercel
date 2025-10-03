"use server"

import { sendEmail } from "@/lib/aws-ses"

interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
}

export async function submitContactForm(data: ContactFormData): Promise<{
  success: boolean
  message: string
}> {
  try {
    const { name, email, company, phone, message } = data

    const emailResult = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `New Contact Form Submission from ${name}`,
      text: `
        New contact form submission:
        
        Name: ${name}
        Email: ${email}
        ${company ? `Company: ${company}` : ""}
        ${phone ? `Phone: ${phone}` : ""}
        
        Message:
        ${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send your message. Please try again.",
      }
    }

    const confirmationResult = await sendEmail({
      to: email,
      subject: "Thank you for contacting Kuhlekt",
      text: `
        Dear ${name},
        
        Thank you for contacting Kuhlekt. We have received your message and will get back to you as soon as possible.
        
        Best regards,
        The Kuhlekt Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for contacting Kuhlekt</h2>
          <p>Dear ${name},</p>
          <p>Thank you for contacting Kuhlekt. We have received your message and will get back to you as soon as possible.</p>
          <p style="margin-top: 30px;">Best regards,<br/>The Kuhlekt Team</p>
        </div>
      `,
    })

    return {
      success: true,
      message: "Your message has been sent successfully. We'll be in touch soon!",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}

export async function sendTestEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email to verify the email configuration is working correctly.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Email</h2>
          <p>This is a test email to verify the email configuration is working correctly.</p>
        </div>
      `,
    })

    return result
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      message: "Failed to send test email.",
    }
  }
}
