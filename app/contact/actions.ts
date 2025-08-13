"use server"

import { sendContactEmail } from "@/lib/email-service"
import { verifyCaptcha } from "@/lib/recaptcha-actions"

interface ContactFormState {
  success: boolean
  message: string
  errors: Record<string, string>
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string
    const captchaToken = formData.get("captchaToken") as string

    // Validation
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

    if (!subject?.trim()) {
      errors.subject = "Subject is required"
    }

    if (!message?.trim()) {
      errors.message = "Message is required"
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Verify reCAPTCHA if token is provided and not disabled
    if (captchaToken && captchaToken !== "disabled" && captchaToken !== "error") {
      const captchaValid = await verifyCaptcha(captchaToken)
      if (!captchaValid) {
        return {
          success: false,
          message: "Security verification failed. Please try again.",
          errors: {},
        }
      }
    }

    // Send email notification
    await sendContactEmail({
      firstName,
      lastName,
      email,
      company: company || undefined,
      phone: phone || undefined,
      subject,
      message,
    })

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 2 hours during business hours.",
      errors: {},
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      message: "There was an error sending your message. Please try again or contact us directly.",
      errors: {},
    }
  }
}
