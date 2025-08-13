"use server"

import { sendEmail } from "@/lib/aws-ses"
import { verifyCaptcha } from "@/lib/captcha"

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const message = formData.get("message") as string
    const captchaToken = formData.get("captchaToken") as string

    // Validate required fields
    const errors: Record<string, string> = {}

    if (!firstName?.trim()) {
      errors.firstName = "First name is required"
    }

    if (!lastName?.trim()) {
      errors.lastName = "Last name is required"
    }

    if (!email?.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!company?.trim()) {
      errors.company = "Company name is required"
    }

    if (!phone?.trim()) {
      errors.phone = "Phone number is required"
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Verify reCAPTCHA (non-blocking)
    let captchaVerified = false
    if (captchaToken && captchaToken !== "development-mode") {
      try {
        captchaVerified = await verifyCaptcha(captchaToken)
      } catch (error) {
        console.error("reCAPTCHA verification error:", error)
        // Continue with form submission even if reCAPTCHA fails
      }
    }

    // Prepare email content
    const emailSubject = `Contact Form Submission - ${firstName} ${lastName}`
    const emailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : ""}
      <p><strong>reCAPTCHA Verified:</strong> ${captchaVerified ? "Yes" : "No"}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `

    // Send email
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      html: emailBody,
    })

    if (!emailResult.success) {
      console.error("Failed to send contact email:", emailResult.error)
      return {
        success: false,
        message: "Failed to send message. Please try again or contact support directly.",
        errors: {},
      }
    }

    return {
      success: true,
      message: "Message sent successfully! We'll get back to you within 24 hours.",
      errors: {},
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      errors: {},
    }
  }
}
