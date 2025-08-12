"use server"

import { sendEmail } from "@/lib/email-service"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

interface DemoFormData {
  firstName: string
  lastName: string
  email: string
  company: string
  phone: string
  jobTitle: string
  companySize: string
  currentArProcess: string
  primaryChallenge: string
  timeframe: string
  affiliateCode?: string
  recaptchaToken: string
}

interface ActionResult {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export async function submitDemoRequest(prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    // Extract form data
    const data: DemoFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      phone: formData.get("phone") as string,
      jobTitle: formData.get("jobTitle") as string,
      companySize: formData.get("companySize") as string,
      currentArProcess: formData.get("currentArProcess") as string,
      primaryChallenge: formData.get("primaryChallenge") as string,
      timeframe: formData.get("timeframe") as string,
      affiliateCode: (formData.get("affiliateCode") as string) || undefined,
      recaptchaToken: formData.get("recaptchaToken") as string,
    }

    // Validate required fields
    const errors: Record<string, string> = {}

    if (!data.firstName?.trim()) errors.firstName = "First name is required"
    if (!data.lastName?.trim()) errors.lastName = "Last name is required"
    if (!data.email?.trim()) errors.email = "Email is required"
    if (!data.company?.trim()) errors.company = "Company is required"
    if (!data.phone?.trim()) errors.phone = "Phone is required"
    if (!data.jobTitle?.trim()) errors.jobTitle = "Job title is required"
    if (!data.companySize) errors.companySize = "Company size is required"
    if (!data.currentArProcess) errors.currentArProcess = "Current AR process is required"
    if (!data.primaryChallenge) errors.primaryChallenge = "Primary challenge is required"
    if (!data.timeframe) errors.timeframe = "Implementation timeframe is required"

    // Validate email format
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Validate affiliate code if provided
    if (data.affiliateCode?.trim()) {
      const affiliateValidation = validateAffiliateCode(data.affiliateCode.trim())
      if (!affiliateValidation.isValid) {
        errors.affiliateCode = affiliateValidation.message
      }
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Prepare email content
    const affiliateInfo = data.affiliateCode ? validateAffiliateCode(data.affiliateCode) : null

    const emailSubject = `New Demo Request from ${data.firstName} ${data.lastName} - ${data.company}`

    const emailBody = `
New Demo Request Received

Contact Information:
- Name: ${data.firstName} ${data.lastName}
- Email: ${data.email}
- Phone: ${data.phone}
- Company: ${data.company}
- Job Title: ${data.jobTitle}

Company Details:
- Company Size: ${data.companySize}
- Current AR Process: ${data.currentArProcess}
- Primary Challenge: ${data.primaryChallenge}
- Implementation Timeframe: ${data.timeframe}

${
  affiliateInfo?.isValid
    ? `
Affiliate Information:
- Code: ${data.affiliateCode}
- Partner: ${affiliateInfo.partner}
- Type: ${affiliateInfo.type}
`
    : ""
}

Please follow up with this prospect within 24 hours.
    `.trim()

    // Send email notification
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      body: emailBody,
      replyTo: data.email,
    })

    if (!emailResult.success) {
      console.error("Failed to send demo request email:", emailResult.error)
      // Don't fail the form submission if email fails
    }

    return {
      success: true,
      message: `Thank you ${data.firstName}! Your demo request has been submitted successfully. We'll contact you within 24 hours to schedule your personalized demo.`,
    }
  } catch (error) {
    console.error("Demo form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again or contact support.",
    }
  }
}

// Export alias for backward compatibility
export const submitDemoForm = submitDemoRequest
