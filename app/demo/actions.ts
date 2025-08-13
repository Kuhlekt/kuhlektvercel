"use server"

import { verifyCaptcha } from "@/lib/captcha"

interface DemoFormState {
  success: boolean
  message: string
  errors: Record<string, string>
}

export async function submitDemoRequest(prevState: DemoFormState, formData: FormData): Promise<DemoFormState> {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const jobTitle = formData.get("jobTitle") as string
    const phone = formData.get("phone") as string
    const challenges = formData.get("challenges") as string
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

    if (!company?.trim()) {
      errors.company = "Company name is required"
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
    if (!captchaResult.success) {
      return {
        success: false,
        message: captchaResult.error || "Security verification failed",
        errors: {},
      }
    }

    // Log the demo request (in production, this would send an email)
    console.log("Demo request received:", {
      firstName,
      lastName,
      email,
      company,
      jobTitle,
      phone,
      challenges,
      timestamp: new Date().toISOString(),
    })

    return {
      success: true,
      message: "Thank you for your interest! We'll contact you within 24 hours to schedule your demo.",
      errors: {},
    }
  } catch (error) {
    console.error("Demo request error:", error)
    return {
      success: false,
      message: "There was an error submitting your request. Please try again.",
      errors: {},
    }
  }
}
