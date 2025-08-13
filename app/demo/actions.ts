"use server"

import { sendDemoRequestEmail } from "@/lib/email-service"
import { verifyCaptcha } from "@/lib/recaptcha-actions"

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
    const companySize = formData.get("companySize") as string
    const currentSolution = formData.get("currentSolution") as string
    const timeline = formData.get("timeline") as string
    const challenges = formData.get("challenges") as string
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

    if (!company?.trim()) {
      errors.company = "Company name is required"
    }

    if (!jobTitle?.trim()) {
      errors.jobTitle = "Job title is required"
    }

    if (!companySize?.trim()) {
      errors.companySize = "Company size is required"
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
    await sendDemoRequestEmail({
      firstName,
      lastName,
      email,
      company,
      jobTitle,
      phone: phone || undefined,
      companySize,
      currentSolution: currentSolution || undefined,
      timeline: timeline || undefined,
      challenges: challenges || undefined,
    })

    return {
      success: true,
      message: "Thank you for your interest! We'll contact you within 24 hours to schedule your personalized demo.",
      errors: {},
    }
  } catch (error) {
    console.error("Demo request error:", error)
    return {
      success: false,
      message: "There was an error submitting your request. Please try again or contact us directly.",
      errors: {},
    }
  }
}
