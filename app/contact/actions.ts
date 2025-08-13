"use server"

import { sendContactEmail } from "@/lib/email-service"
import { verifyCaptcha } from "@/lib/captcha"

export interface ContactFormState {
  success: boolean
  message: string
  errors: Record<string, string>
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  try {
    // Extract form data
    const firstName = formData.get("firstName")?.toString()?.trim() || ""
    const lastName = formData.get("lastName")?.toString()?.trim() || ""
    const email = formData.get("email")?.toString()?.trim() || ""
    const company = formData.get("company")?.toString()?.trim() || ""
    const phone = formData.get("phone")?.toString()?.trim() || ""
    const message = formData.get("message")?.toString()?.trim() || ""
    const captchaToken = formData.get("captchaToken")?.toString()?.trim() || ""

    // Validation
    const errors: Record<string, string> = {}

    if (!firstName) errors.firstName = "First name is required"
    if (!lastName) errors.lastName = "Last name is required"
    if (!email) errors.email = "Email is required"
    if (!message) errors.message = "Message is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
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
    const captchaValid = await verifyCaptcha(captchaToken)
    if (!captchaValid) {
      return {
        success: false,
        message: "Please complete the reCAPTCHA verification",
        errors: {},
      }
    }

    // Send contact email
    const emailSent = await sendContactEmail({
      firstName,
      lastName,
      email,
      company,
      phone,
      message,
    })

    if (!emailSent) {
      return {
        success: false,
        message: "Failed to send message. Please try again.",
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
      message: "An error occurred while sending your message. Please try again.",
      errors: {},
    }
  }
}

export async function testAWSSES(): Promise<{ success: boolean; message: string }> {
  try {
    const testResult = await sendContactEmail({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      company: "Test Company",
      phone: "555-123-4567",
      message: "This is a test message to verify AWS SES configuration.",
    })

    return {
      success: testResult,
      message: testResult ? "AWS SES test successful" : "AWS SES test failed",
    }
  } catch (error) {
    console.error("AWS SES test error:", error)
    return {
      success: false,
      message: `AWS SES test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
