"use server"

import { sendDemoRequestEmail } from "@/lib/email-service"
import { validateAffiliate } from "@/lib/affiliate-validation"
import { verifyCaptcha } from "@/lib/captcha"

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    // Extract form data with proper null checks
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
    const captchaToken = formData.get("captchaToken")?.toString()?.trim() || ""

    // Validate required fields
    const errors: Record<string, string> = {}

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

    if (!phone) {
      errors.phone = "Phone number is required"
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Verify reCAPTCHA (non-blocking)
    let captchaVerified = false
    if (captchaToken && captchaToken !== "development-mode") {
      try {
        captchaVerified = await verifyCaptcha(captchaToken)
      } catch (error) {
        console.error("reCAPTCHA verification error:", error)
        // Continue with form submission even if reCAPTCHA fails
      }
    }

    // Validate affiliate code if provided
    let validAffiliate = false
    if (affiliateCode) {
      try {
        validAffiliate = validateAffiliate(affiliateCode)
      } catch (error) {
        console.error("Affiliate validation error:", error)
        // Continue with form submission even if affiliate validation fails
      }
    }

    // Prepare email data
    const emailData = {
      firstName,
      lastName,
      email,
      company,
      phone,
      jobTitle: jobTitle || undefined,
      companySize: companySize || undefined,
      currentSolution: currentSolution || undefined,
      timeline: timeline || undefined,
      challenges: challenges || undefined,
    }

    // Send email
    const emailResult = await sendDemoRequestEmail(emailData)

    if (!emailResult.success) {
      console.error("Failed to send demo request email:", emailResult.message)
      return {
        success: false,
        message: "There was an error submitting your demo request. Please try again or contact us directly.",
        errors: {},
      }
    }

    return {
      success: true,
      message: "Thank you for your demo request! We'll contact you within 24 hours to schedule your personalized demo.",
      errors: {},
    }
  } catch (error) {
    console.error("Demo request submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      errors: {},
    }
  }
}
