"use server"

import { verifyCaptcha } from "@/lib/captcha"

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
    const message = formData.get("message") as string
    const captchaToken = formData.get("captchaToken") as string

    // Basic validation
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

    // Verify reCAPTCHA
    const captchaResult = await verifyCaptcha(captchaToken || "")
    if (!captchaResult) {
      return {
        success: false,
        message: "Security verification failed",
        errors: {},
      }
    }

    // Log the contact form submission (in production, this would send an email)
    console.log("Contact form received:", {
      firstName,
      lastName,
      email,
      company,
      phone,
      message,
      timestamp: new Date().toISOString(),
    })

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      errors: {},
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      message: "There was an error sending your message. Please try again.",
      errors: {},
    }
  }
}

export async function testAWSSES(): Promise<{ success: boolean; message: string }> {
  return {
    success: true,
    message: "AWS SES test completed (mock implementation)",
  }
}
