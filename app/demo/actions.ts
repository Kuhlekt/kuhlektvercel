"use server"

import { sendDemoRequestEmail } from "@/lib/email-service"
import { validateAffiliate } from "@/lib/affiliate-validation"
import { verifyCaptcha } from "@/lib/captcha"

interface DemoFormState {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export async function submitDemoRequest(prevState: DemoFormState, formData: FormData): Promise<DemoFormState> {
  try {
    // Extract form data with consistent field names
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

    if (!firstName || firstName.trim().length === 0) {
      errors.firstName = "First name is required"
    }

    if (!lastName || lastName.trim().length === 0) {
      errors.lastName = "Last name is required"
    }

    if (!email || email.trim().length === 0) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!company || company.trim().length === 0) {
      errors.company = "Company name is required"
    }

    if (!phone || phone.trim().length === 0) {
      errors.phone = "Phone number is required"
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please fix the errors below",
        errors,
      }
    }

    // Verify reCAPTCHA (non-blocking)
    let captchaVerified = false
    if (captchaToken) {
      try {
        captchaVerified = await verifyCaptcha(captchaToken)
      } catch (error) {
        console.error("reCAPTCHA verification error:", error)
        // Continue with form submission even if reCAPTCHA fails
      }
    }

    // Validate affiliate code if provided
    let validAffiliate = null
    if (affiliateCode && affiliateCode.trim().length > 0) {
      validAffiliate = validateAffiliate(affiliateCode.trim())
    }

    // Send email using the email service
    const emailResult = await sendDemoRequestEmail({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      company: company.trim(),
      jobTitle: jobTitle?.trim() || "",
      phone: phone?.trim() || "",
      companySize: companySize?.trim() || "",
      currentSolution: currentSolution?.trim() || "",
      challenges: challenges?.trim() || "",
      timeline: timeline?.trim() || "",
    })

    if (!emailResult.success) {
      console.error("Failed to send demo request email:", emailResult.error)
      return {
        success: false,
        message: "There was an error submitting your demo request. Please try again or contact us directly.",
      }
    }

    return {
      success: true,
      message: "Thank you for your demo request! We'll contact you within 24 hours to schedule your personalized demo.",
    }
  } catch (error) {
    console.error("Demo request submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
