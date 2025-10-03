"use server"

import { sendEmail } from "@/lib/aws-ses"

interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "info@kuhlekt.com",
      subject: `New Contact Form Submission from ${formData.name}`,
      text: `
        Name: ${formData.name}
        Email: ${formData.email}
        Company: ${formData.company || "Not provided"}
        Phone: ${formData.phone || "Not provided"}
        
        Message:
        ${formData.message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Company:</strong> ${formData.company || "Not provided"}</p>
            <p><strong>Phone:</strong> ${formData.phone || "Not provided"}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${formData.message}</p>
          </div>
        </div>
      `,
    })

    if (!emailResult.success) {
      return { success: false, message: emailResult.message }
    }

    return { success: true, message: "Your message has been sent successfully!" }
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return { success: false, message: "An error occurred. Please try again." }
  }
}

export async function sendTestEmail(to: string) {
  try {
    const emailResult = await sendEmail({
      to,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email from the Kuhlekt contact form.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Email</h2>
          <p>This is a test email from the Kuhlekt contact form.</p>
          <p>If you received this email, the email service is working correctly.</p>
        </div>
      `,
    })

    return emailResult
  } catch (error) {
    console.error("Error in sendTestEmail:", error)
    return { success: false, message: "An error occurred. Please try again." }
  }
}
