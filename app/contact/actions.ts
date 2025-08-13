"use server"

import { sendContactEmail } from "@/lib/email-service"
import { verifyCaptcha } from "@/lib/captcha"

interface ContactFormState {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const message = formData.get("message") as string
    const recaptchaToken = formData.get("recaptchaToken") as string

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

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Verify reCAPTCHA
    const captchaResult = await verifyCaptcha(recaptchaToken)
    if (!captchaResult.success) {
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
      }
    }

    // Send email
    await sendContactEmail({
      firstName,
      lastName,
      email,
      company: company || "",
      phone: phone || "",
      message: message || "",
    })

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again or contact us directly.",
    }
  }
}
