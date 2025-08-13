"use server"

import { sendDemoRequestEmail } from "@/lib/email-service"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

export interface DemoFormState {
  success?: boolean
  message?: string
  errors?: {
    firstName?: string
    lastName?: string
    email?: string
    jobTitle?: string
    company?: string
    companySize?: string
    currentSolution?: string
    timeline?: string
    challenges?: string
    recaptcha?: string
  }
}

export async function submitDemoRequest(prevState: DemoFormState, formData: FormData): Promise<DemoFormState> {
  try {
    // Extract form data with null safety
    const firstName = formData.get("firstName")?.toString()?.trim() || ""
    const lastName = formData.get("lastName")?.toString()?.trim() || ""
    const email = formData.get("email")?.toString()?.trim() || ""
    const jobTitle = formData.get("jobTitle")?.toString()?.trim() || ""
    const company = formData.get("company")?.toString()?.trim() || ""
    const companySize = formData.get("companySize")?.toString()?.trim() || ""
    const currentSolution = formData.get("currentSolution")?.toString()?.trim() || ""
    const timeline = formData.get("timeline")?.toString()?.trim() || ""
    const challenges = formData.get("challenges")?.toString()?.trim() || ""
    const recaptchaToken = formData.get("recaptcha-token")?.toString()?.trim() || ""
    const affiliateCode = formData.get("affiliateCode")?.toString()?.trim() || ""

    // Validate required fields
    const errors: DemoFormState["errors"] = {}

    if (!firstName) errors.firstName = "First name is required"
    if (!lastName) errors.lastName = "Last name is required"
    if (!email) errors.email = "Email is required"
    if (!jobTitle) errors.jobTitle = "Job title is required"
    if (!company) errors.company = "Company name is required"
    if (!companySize) errors.companySize = "Company size is required"
    if (!currentSolution) errors.currentSolution = "Current solution is required"
    if (!timeline) errors.timeline = "Timeline is required"
    if (!challenges) errors.challenges = "Challenges are required"

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

    // Validate affiliate code if provided
    let affiliateValid = false
    if (affiliateCode) {
      affiliateValid = await validateAffiliateCode(affiliateCode)
    }

    // Send demo request email
    await sendDemoRequestEmail({
      firstName,
      lastName,
      email,
      jobTitle,
      company,
      companySize,
      currentSolution,
      timeline,
      challenges,
      affiliateCode: affiliateValid ? affiliateCode : undefined,
    })

    return {
      success: true,
      message:
        "Thank you for your demo request! We will contact you within 24 hours to schedule your personalized demo.",
    }
  } catch (error) {
    console.error("Demo request submission error:", error)
    return {
      success: false,
      message: "There was an error submitting your demo request. Please try again or contact support.",
    }
  }
}
