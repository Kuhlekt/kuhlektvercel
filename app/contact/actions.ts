"use server"

import { sendContactEmail } from "@/lib/email-service"

export interface ContactFormState {
  success?: boolean
  message?: string
  errors?: {
    firstName?: string
    lastName?: string
    email?: string
    company?: string
    message?: string
    recaptcha?: string
  }
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  try {
    // Extract form data with null safety
    const firstName = formData.get("firstName")?.toString()?.trim() || ""
    const lastName = formData.get("lastName")?.toString()?.trim() || ""
    const email = formData.get("email")?.toString()?.trim() || ""
    const company = formData.get("company")?.toString()?.trim() || ""
    const message = formData.get("message")?.toString()?.trim() || ""
    const recaptchaToken = formData.get("recaptcha-token")?.toString()?.trim() || ""

    // Validate required fields
    const errors: ContactFormState["errors"] = {}

    if (!firstName) errors.firstName = "First name is required"
    if (!lastName) errors.lastName = "Last name is required"
    if (!email) errors.email = "Email is required"

    // Email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    // reCAPTCHA validation (allow bypass tokens for development)
    if (!recaptchaToken) {
      errors.recaptcha = "reCAPTCHA verification is required"
    }

    if (Object.keys(errors).length > 0) {
      return { errors }
    }

    // Send contact email
    await sendContactEmail({
      firstName,
      lastName,
      email,
      company: company || undefined,
      message: message || undefined,
    })

    return {
      success: true,
      message: "Thank you for your message! We will get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "There was an error sending your message. Please try again or contact support directly.",
    }
  }
}
