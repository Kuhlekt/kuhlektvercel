"use server"

import { sendEmail } from "@/lib/email-service"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

export interface DemoFormState {
  success?: boolean
  message?: string
  errors?: {
    firstName?: string
    lastName?: string
    email?: string
    company?: string
    phone?: string
    employees?: string
    currentSolution?: string
    challenges?: string
    affiliateCode?: string
    recaptcha?: string
  }
}

export async function submitDemoRequest(prevState: DemoFormState, formData: FormData): Promise<DemoFormState> {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const phone = formData.get("phone") as string
  const employees = formData.get("employees") as string
  const currentSolution = formData.get("currentSolution") as string
  const challenges = formData.get("challenges") as string
  const affiliateCode = formData.get("affiliateCode") as string
  const recaptchaToken = formData.get("recaptcha-token") as string

  const errors: DemoFormState["errors"] = {}

  // Validation
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

  if (!employees) {
    errors.employees = "Please select company size"
  }

  if (!currentSolution?.trim()) {
    errors.currentSolution = "Please describe your current solution"
  }

  if (!challenges?.trim()) {
    errors.challenges = "Please describe your main challenges"
  }

  // Validate affiliate code if provided
  if (affiliateCode?.trim()) {
    const affiliateValidation = validateAffiliateCode(affiliateCode.trim())
    if (!affiliateValidation.isValid) {
      errors.affiliateCode = affiliateValidation.message
    }
  }

  if (!recaptchaToken) {
    errors.recaptcha = "Please complete the reCAPTCHA verification"
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  try {
    // Send email notification
    const emailContent = `
New Demo Request:

Name: ${firstName} ${lastName}
Email: ${email}
Company: ${company}
Phone: ${phone}
Company Size: ${employees}
Current Solution: ${currentSolution}
Main Challenges: ${challenges}
${affiliateCode ? `Affiliate Code: ${affiliateCode}` : ""}

Please follow up with this prospect to schedule their demo.
    `

    await sendEmail({
      to: "demos@kuhlekt.com",
      subject: `New Demo Request from ${firstName} ${lastName} at ${company}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    })

    return {
      success: true,
      message: "Thank you for your interest! We'll contact you within 24 hours to schedule your personalized demo.",
    }
  } catch (error) {
    console.error("Error submitting demo request:", error)
    return {
      success: false,
      message: "There was an error submitting your request. Please try again or contact us directly.",
    }
  }
}

// Export alias for backward compatibility
export const submitDemoForm = submitDemoRequest
