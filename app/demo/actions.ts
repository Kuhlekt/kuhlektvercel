"use server"

import { sendEmail } from "@/lib/email-service"

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const message = formData.get("message") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return {
        success: false,
        error: "Please fill in all required fields",
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Please enter a valid email address",
      }
    }

    // Send email notification
    await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "admin@kuhlekt.com",
      subject: `New Demo Request from ${firstName} ${lastName}`,
      html: `
        <h2>New Demo Request</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message || "No message provided"}</p>
        <hr>
        <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
      `,
    })

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: "Demo Request Received - Kuhlekt",
      html: `
        <h2>Thank you for your demo request!</h2>
        <p>Hi ${firstName},</p>
        <p>We've received your demo request and will get back to you within 24 hours.</p>
        <p>In the meantime, feel free to explore our website to learn more about our AR automation solutions.</p>
        <p>Best regards,<br>The Kuhlekt Team</p>
      `,
    })

    return {
      success: true,
      message: "Demo request submitted successfully! We'll contact you soon.",
    }
  } catch (error) {
    console.error("Demo request error:", error)
    return {
      success: false,
      error: "Failed to submit demo request. Please try again.",
    }
  }
}

// Export alias for compatibility
export const submitDemoForm = submitDemoRequest
