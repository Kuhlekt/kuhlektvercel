"use server"

import { sendDemoRequestEmail } from "@/lib/email-service"
import { getVisitorData } from "@/components/visitor-tracker"

interface DemoFormState {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export async function submitDemoRequest(prevState: DemoFormState, formData: FormData): Promise<DemoFormState> {
  try {
    // Extract form data with null safety
    const firstName = formData.get("firstName")?.toString()?.trim() || ""
    const lastName = formData.get("lastName")?.toString()?.trim() || ""
    const email = formData.get("email")?.toString()?.trim() || ""
    const company = formData.get("company")?.toString()?.trim() || ""
    const jobTitle = formData.get("jobTitle")?.toString()?.trim() || ""
    const companySize = formData.get("companySize")?.toString()?.trim() || ""
    const currentSolution = formData.get("currentSolution")?.toString()?.trim() || ""
    const timeline = formData.get("timeline")?.toString()?.trim() || ""
    const challenges = formData.get("challenges")?.toString()?.trim() || ""
    const captchaToken = formData.get("captchaToken")?.toString()?.trim() || ""

    // Validation
    const errors: Record<string, string> = {}

    if (!firstName) errors.firstName = "First name is required"
    if (!lastName) errors.lastName = "Last name is required"
    if (!email) errors.email = "Email is required"
    if (!company) errors.company = "Company name is required"
    if (!jobTitle) errors.jobTitle = "Job title is required"
    if (!companySize) errors.companySize = "Company size is required"

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

    // Send demo request email
    const emailResult = await sendDemoRequestEmail({
      firstName,
      lastName,
      email,
      company,
      jobTitle,
      companySize,
      currentSolution,
      timeline,
      challenges,
      captchaToken,
      visitorData,
    })

    if (!emailResult.success) {
      console.error("Failed to send demo request email:", emailResult.error)
      return {
        success: false,
        message: "Failed to send demo request. Please try again or contact support.",
      }
    }

    return {
      success: true,
      message:
        "Thank you for your demo request! We'll be in touch within 24 hours to schedule your personalized demonstration.",
    }
  } catch (error) {
    console.error("Error processing demo request:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}
