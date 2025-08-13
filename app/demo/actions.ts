"use server"

import { sendDemoRequestEmail } from "@/lib/email-service"
import { validateAffiliateCode } from "@/lib/affiliate-validation"
import { verifyCaptcha } from "@/lib/captcha"

export interface DemoFormState {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export async function submitDemoRequest(prevState: DemoFormState, formData: FormData): Promise<DemoFormState> {
  try {
    // Extract form data
    const firstName = formData.get("firstName")?.toString()?.trim() || ""
    const lastName = formData.get("lastName")?.toString()?.trim() || ""
    const email = formData.get("email")?.toString()?.trim() || ""
    const company = formData.get("company")?.toString()?.trim() || ""
    const phone = formData.get("phone")?.toString()?.trim() || ""
    const jobTitle = formData.get("jobTitle")?.toString()?.trim() || ""
    const companySize = formData.get("companySize")?.toString()?.trim() || ""
    const currentSolution = formData.get("currentSolution")?.toString()?.trim() || ""
    const timeline = formData.get("timeline")?.toString()?.trim() || ""
    const challenges = formData.get("challenges")?.toString()?.trim() || ""
    const affiliateCode = formData.get("affiliateCode")?.toString()?.trim() || ""
    const recaptchaToken = formData.get("recaptchaToken")?.toString()?.trim() || ""

    // Validation
    const errors: Record<string, string> = {}

    if (!firstName) errors.firstName = "First name is required"
    if (!lastName) errors.lastName = "Last name is required"
    if (!email) errors.email = "Email is required"
    if (!company) errors.company = "Company name is required"
    if (!phone) errors.phone = "Phone number is required"

    // Email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    // Phone validation
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    if (phone && !phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))) {
      errors.phone = "Please enter a valid phone number"
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Verify reCAPTCHA
    const captchaValid = await verifyCaptcha(recaptchaToken)
    if (!captchaValid) {
      return {
        success: false,
        message: "Please complete the reCAPTCHA verification",
        errors: {},
      }
    }

    // Validate affiliate code if provided
    let affiliateInfo = null
    if (affiliateCode) {
      const isValidAffiliate = validateAffiliateCode(affiliateCode)
      if (!isValidAffiliate) {
        errors.affiliateCode = "Invalid affiliate code"
        return {
          success: false,
          message: "Please check your affiliate code",
          errors,
        }
      }
      affiliateInfo = { code: affiliateCode, isValid: true }
    }

    // Send demo request email
    const emailSent = await sendDemoRequestEmail({
      firstName,
      lastName,
      email,
      phone,
      company,
      jobTitle,
      companySize,
      currentSolution,
      timeline,
      challenges,
      affiliateCode,
      affiliateInfo,
    })

    if (!emailSent) {
      return {
        success: false,
        message: "Failed to send demo request. Please try again.",
        errors: {},
      }
    }

    return {
      success: true,
      message: "Thank you! Your demo request has been submitted successfully. We'll contact you within 24 hours.",
    }
  } catch (error) {
    console.error("Demo request submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}
