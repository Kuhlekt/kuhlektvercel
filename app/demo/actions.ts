"use server"

import { sendEmail } from "@/lib/email-service"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

interface DemoFormData {
  firstName: string
  lastName: string
  email: string
  company: string
  role: string
  affiliateCode?: string
  challenges: string
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateFormData(data: DemoFormData): string[] {
  const errors: string[] = []

  if (!data.firstName?.trim()) {
    errors.push("First name is required")
  }

  if (!data.lastName?.trim()) {
    errors.push("Last name is required")
  }

  if (!data.email?.trim()) {
    errors.push("Email is required")
  } else if (!validateEmail(data.email)) {
    errors.push("Please enter a valid email address")
  }

  if (!data.company?.trim()) {
    errors.push("Company is required")
  }

  if (!data.challenges?.trim()) {
    errors.push("Please describe your AR challenges")
  }

  return errors
}

export async function submitDemoRequest(formData: FormData) {
  try {
    const data: DemoFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      role: formData.get("role") as string,
      affiliateCode: formData.get("affiliateCode") as string,
      challenges: formData.get("challenges") as string,
    }

    // Validate form data
    const validationErrors = validateFormData(data)
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: validationErrors.join(", "),
      }
    }

    // Validate affiliate code if provided
    if (data.affiliateCode && data.affiliateCode.trim()) {
      const isValidAffiliate = await validateAffiliateCode(data.affiliateCode.trim())
      if (!isValidAffiliate) {
        return {
          success: false,
          error: "Invalid affiliate code",
        }
      }
    }

    // Send email notification
    const emailSubject = "New Demo Request - Kuhlekt"
    const emailBody = `
      New demo request received:
      
      Name: ${data.firstName} ${data.lastName}
      Email: ${data.email}
      Company: ${data.company}
      Role: ${data.role || "Not specified"}
      Affiliate Code: ${data.affiliateCode || "None"}
      
      AR Challenges:
      ${data.challenges}
      
      Please follow up within 24 hours.
    `

    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      body: emailBody,
    })

    return {
      success: true,
      message: "Demo request submitted successfully! We'll contact you within 24 hours.",
    }
  } catch (error) {
    console.error("Error submitting demo request:", error)
    return {
      success: false,
      error: "Failed to submit demo request. Please try again.",
    }
  }
}
