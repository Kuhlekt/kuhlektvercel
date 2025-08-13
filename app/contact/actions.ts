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

const initialState: ContactFormState = {
  success: false,
  message: "",
  errors: {},
}

export async function submitContactForm(
  prevState: ContactFormState = initialState,
  formData: FormData,
): Promise<ContactFormState> {
  try {
    // Extract form data with null safety
    const firstName = formData.get("firstName")?.toString()?.trim() || ""
    const lastName = formData.get("lastName")?.toString()?.trim() || ""
    const email = formData.get("email")?.toString()?.trim() || ""
    const company = formData.get("company")?.toString()?.trim() || ""
    const message = formData.get("message")?.toString()?.trim() || ""
    const recaptchaToken = formData.get("recaptcha")?.toString()?.trim() || ""

    // Validation
    const errors: ContactFormState["errors"] = {}

    if (!firstName) {
      errors.firstName = "First name is required"
    }

    if (!lastName) {
      errors.lastName = "Last name is required"
    }

    if (!email) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!company) {
      errors.company = "Company name is required"
    }

    if (!message) {
      errors.message = "Message is required"
    }

    // Validate reCAPTCHA (allow development token)
    if (!recaptchaToken) {
      errors.recaptcha = "Please complete the reCAPTCHA verification"
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Send email
    try {
      await sendContactEmail({
        firstName,
        lastName,
        email,
        company,
        message,
      })

      return {
        success: true,
        message: "Thank you for your message! We'll get back to you within 24 hours.",
        errors: {},
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      return {
        success: false,
        message: "There was an error sending your message. Please try again or contact us directly.",
        errors: {},
      }
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
