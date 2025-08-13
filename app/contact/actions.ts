"use server"

import { sendContactEmail } from "@/lib/email-service"
import { getVisitorData } from "@/components/visitor-tracker"

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
    const company = formData.get("company")?.toString()?.trim() || ""
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

    // Get visitor tracking data if available
    let visitorData = null
    try {
      if (typeof window !== "undefined") {
        visitorData = getVisitorData()
      }
    } catch (error) {
      console.warn("Could not get visitor data:", error)
    }

    // Send contact email
    const emailResult = await sendContactEmail({
      firstName,
      lastName,
      email,
      company,
      message,
      captchaToken,
      visitorData,
    })

    if (!emailResult.success) {
      console.error("Failed to send contact email:", emailResult.error)
      return {
        success: false,
        message: "Failed to send message. Please try again or contact us directly at hello@kuhlekt.com",
      }
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Error processing contact form:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}

// Test function for AWS SES (for development/testing purposes)
export async function testAWSSES() {
  try {
    const testResult = await sendContactEmail({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      company: "Test Company",
      message: "This is a test message",
      captchaToken: "test-token",
      visitorData: null,
    })

    return {
      success: testResult.success,
      message: testResult.success ? "Test email sent successfully" : "Test email failed",
      error: testResult.error,
    }
  } catch (error) {
    return {
      success: false,
      message: "Test failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
