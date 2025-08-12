"use server"

import { sendEmail } from "@/lib/aws-ses"
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

function validateForm(data: DemoFormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.firstName.trim()) {
    errors.push("First name is required")
  }

  if (!data.lastName.trim()) {
    errors.push("Last name is required")
  }

  if (!data.email.trim()) {
    errors.push("Email is required")
  } else if (!validateEmail(data.email)) {
    errors.push("Please enter a valid email address")
  }

  if (!data.company.trim()) {
    errors.push("Company is required")
  }

  if (!data.challenges.trim()) {
    errors.push("Please describe your AR challenges")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export async function submitDemoRequest(formData: FormData) {
  try {
    const data: DemoFormData = {
      firstName: (formData.get("firstName") as string) || "",
      lastName: (formData.get("lastName") as string) || "",
      email: (formData.get("email") as string) || "",
      company: (formData.get("company") as string) || "",
      role: (formData.get("role") as string) || "",
      affiliateCode: (formData.get("affiliateCode") as string) || "",
      challenges: (formData.get("challenges") as string) || "",
    }

    // Validate form data
    const validation = validateForm(data)
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(", "),
      }
    }

    // Validate affiliate code if provided
    if (data.affiliateCode) {
      const isValidAffiliate = await validateAffiliateCode(data.affiliateCode)
      if (!isValidAffiliate) {
        return {
          success: false,
          error: "Invalid affiliate code",
        }
      }
    }

    // Prepare email content
    const emailSubject = `New Demo Request from ${data.firstName} ${data.lastName}`
    const emailBody = `
      New demo request received:
      
      Name: ${data.firstName} ${data.lastName}
      Email: ${data.email}
      Company: ${data.company}
      Role: ${data.role}
      ${data.affiliateCode ? `Affiliate Code: ${data.affiliateCode}` : ""}
      
      AR Challenges:
      ${data.challenges}
      
      Please contact this prospect within 24 hours.
    `

    // Send email notification
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      throw new Error("Admin email not configured")
    }

    await sendEmail({
      to: adminEmail,
      subject: emailSubject,
      body: emailBody,
      replyTo: data.email,
    })

    return {
      success: true,
      message: "Demo request submitted successfully! We'll contact you within 24 hours.",
    }
  } catch (error) {
    console.error("Demo request submission error:", error)
    return {
      success: false,
      error: "Failed to submit demo request. Please try again.",
    }
  }
}
