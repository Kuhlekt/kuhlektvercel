"use server"

import { sendContactEmail } from "@/lib/email-service"
import { verifyCaptcha } from "@/lib/captcha"

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    // Extract form data with null checks
    const name = formData.get("name")?.toString()?.trim() || ""
    const email = formData.get("email")?.toString()?.trim() || ""
    const company = formData.get("company")?.toString()?.trim() || ""
    const message = formData.get("message")?.toString()?.trim() || ""
    const captchaToken = formData.get("captchaToken")?.toString()?.trim() || ""

    // Validate required fields
    const errors: Record<string, string> = {}

    if (!name) {
      errors.name = "Name is required"
    }

    if (!email) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!message) {
      errors.message = "Message is required"
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

    // Send email
    const emailResult = await sendContactEmail({
      name,
      email,
      company: company || undefined,
      message,
    })

    if (!emailResult.success) {
      console.error("Failed to send contact email:", emailResult.message)
      return {
        success: false,
        message: "There was an error sending your message. Please try again or contact us directly.",
        errors: {},
      }
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      errors: {},
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      errors: {},
    }
  }
}
