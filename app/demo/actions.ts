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
    company?: string
    jobTitle?: string
    companySize?: string
    currentSolution?: string
    timeline?: string
    challenges?: string
    recaptcha?: string
  }
}

const initialState: DemoFormState = {
  success: false,
  message: "",
  errors: {},
}

export async function submitDemoRequest(
  prevState: DemoFormState = initialState,
  formData: FormData,
): Promise<DemoFormState> {
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
    const recaptchaToken = formData.get("recaptcha")?.toString()?.trim() || ""
    const affiliateCode = formData.get("affiliateCode")?.toString()?.trim() || ""

    // Validation
    const errors: DemoFormState["errors"] = {}

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

    if (!jobTitle) {
      errors.jobTitle = "Job title is required"
    }

    if (!companySize) {
      errors.companySize = "Company size is required"
    }

    if (!currentSolution) {
      errors.currentSolution = "Current solution is required"
    }

    if (!timeline) {
      errors.timeline = "Timeline is required"
    }

    if (!challenges) {
      errors.challenges = "Challenges description is required"
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

    // Validate affiliate code if provided
    let affiliateInfo = null
    if (affiliateCode) {
      try {
        affiliateInfo = await validateAffiliateCode(affiliateCode)
        if (!affiliateInfo.isValid) {
          return {
            success: false,
            message: "Invalid affiliate code provided",
            errors: { recaptcha: "Invalid affiliate code" },
          }
        }
      } catch (error) {
        console.error("Affiliate validation error:", error)
        // Continue without affiliate validation in case of error
      }
    }

    // Send email
    try {
      await sendDemoRequestEmail({
        firstName,
        lastName,
        email,
        company,
        jobTitle,
        companySize,
        currentSolution,
        timeline,
        challenges,
        affiliateCode: affiliateCode || undefined,
        affiliateInfo: affiliateInfo || undefined,
      })

      return {
        success: true,
        message:
          "Thank you for your demo request! We'll be in touch within 24 hours to schedule your personalized demonstration.",
        errors: {},
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      return {
        success: false,
        message: "There was an error sending your demo request. Please try again or contact us directly.",
        errors: {},
      }
    }
  } catch (error) {
    console.error("Demo form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      errors: {},
    }
  }
}
