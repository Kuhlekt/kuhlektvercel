"use server"

import { sendEmail } from "@/lib/email-service"
import { verifyCaptcha } from "@/lib/captcha"

export async function submitDemoRequest(prevState: any, formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const phone = formData.get("phone") as string
  const message = formData.get("message") as string
  const captchaToken = formData.get("captcha-token") as string

  // Validation
  if (!firstName || !lastName || !email || !company) {
    return { error: "Please fill in all required fields" }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" }
  }

  // Verify reCAPTCHA
  if (!captchaToken) {
    return { error: "Please complete the reCAPTCHA verification" }
  }

  const captchaValid = await verifyCaptcha(captchaToken)
  if (!captchaValid) {
    return { error: "reCAPTCHA verification failed. Please try again." }
  }

  try {
    // Send email notification
    await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "admin@kuhlekt.com",
      subject: "New Demo Request",
      html: `
        <h2>New Demo Request</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message || "No message provided"}</p>
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
        <p>Our team will contact you at ${email} to schedule your personalized demo.</p>
        <br>
        <p>Best regards,<br>The Kuhlekt Team</p>
      `,
    })

    return { success: "Demo request submitted successfully! We'll contact you soon." }
  } catch (error) {
    console.error("Error submitting demo request:", error)
    return { error: "Failed to submit demo request. Please try again." }
  }
}

// Export alias for compatibility
export const submitDemoForm = submitDemoRequest
