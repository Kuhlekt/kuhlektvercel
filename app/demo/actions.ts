"use server"

import { sendDemoRequestEmail } from "@/lib/email-service"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const jobTitle = formData.get("jobTitle") as string
    const companySize = formData.get("companySize") as string
    const currentSolution = formData.get("currentSolution") as string
    const timeline = formData.get("timeline") as string
    const challenges = formData.get("challenges") as string
    const affiliateCode = formData.get("affiliateCode") as string
    const captchaToken = formData.get("captchaToken") as string

    // Validate required fields
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

    if (!phone?.trim()) {
      errors.phone = "Phone number is required"
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Validate affiliate code if provided
    let isValidAffiliate = true
    if (affiliateCode?.trim()) {
      isValidAffiliate = validateAffiliateCode(affiliateCode.trim())
      if (!isValidAffiliate) {
        return {
          success: false,
          message: "Invalid affiliate code provided",
          errors: { affiliateCode: "Invalid affiliate code" },
        }
      }
    }

    // Prepare email data
    const emailData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      company: company.trim(),
      phone: phone.trim(),
      jobTitle: jobTitle?.trim() || "",
      companySize: companySize?.trim() || "",
      currentSolution: currentSolution?.trim() || "",
      timeline: timeline?.trim() || "",
      challenges: challenges?.trim() || "",
      affiliateCode: affiliateCode?.trim() || "",
      captchaToken: captchaToken || "",
    }

    // Send email
    const emailResult = await sendDemoRequestEmail(emailData)

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send demo request. Please try again or contact support.",
        errors: {},
      }
    }

    return {
      success: true,
      message:
        "Demo request submitted successfully! We'll contact you within 24 hours to schedule your personalized demo.",
      errors: {},
    }
  } catch (error) {
    console.error("Demo request submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      errors: {},
    }
  }
}
