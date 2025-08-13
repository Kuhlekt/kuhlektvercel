"use server"

import { sendContactEmail } from "@/lib/email-service"

interface ContactFormState {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  try {
    // Extract form data with null safety
    const firstName = formData.get("firstName")?.toString()?.trim() || ""
    const lastName = formData.get("lastName")?.toString()?.trim() || ""
    const email = formData.get("email")?.toString()?.trim() || ""
    const phone = formData.get("phone")?.toString()?.trim() || ""
    const company = formData.get("company")?.toString()?.trim() || ""
    const message = formData.get("message")?.toString()?.trim() || ""
    const recaptchaToken = formData.get("recaptchaToken")?.toString()?.trim() || ""

    // Validation
    const errors: Record<string, string> = {}

    if (!firstName) errors.firstName = "First name is required"
    if (!lastName) errors.lastName = "Last name is required"
    if (!email) errors.email = "Email is required"
    if (!message) errors.message = "Message is required"

    // Email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Send email
    const emailResult = await sendContactEmail({
      firstName,
      lastName,
      email,
      phone,
      company,
      message,
      recaptchaToken,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: emailResult.error || "Failed to send message. Please try again.",
      }
    }

    return {
      success: true,
      message: "Thank you! Your message has been sent successfully. We'll get back to you soon.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}

export async function testAWSSES() {
  try {
    const testResult = await sendContactEmail({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      phone: "555-0123",
      company: "Test Company",
      message: "This is a test message",
      recaptchaToken: "test-token",
    })

    return {
      success: testResult.success,
      message: testResult.success ? "AWS SES test successful" : testResult.error || "AWS SES test failed",
    }
  } catch (error) {
    console.error("AWS SES test error:", error)
    return {
      success: false,
      message: "AWS SES test failed with error",
    }
  }
}
