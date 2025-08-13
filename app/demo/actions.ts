"use server"

import { sendEmail } from "@/lib/aws-ses"
import { verifyCaptcha } from "@/lib/captcha"
import { validateAffiliate } from "@/lib/affiliate-validation"
import { getVisitorData } from "@/components/visitor-tracker"

interface DemoFormState {
  success?: boolean
  message?: string
  errors?: {
    firstName?: string
    lastName?: string
    email?: string
    company?: string
    phone?: string
    jobTitle?: string
    companySize?: string
    currentSolution?: string
    challenges?: string
    captcha?: string
  }
}

export async function submitDemoForm(prevState: DemoFormState | null, formData: FormData): Promise<DemoFormState> {
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
    const challenges = formData.get("challenges") as string
    const captchaToken = formData.get("captcha") as string
    const affiliate = formData.get("affiliate") as string

    // Validation
    const errors: DemoFormState["errors"] = {}

    if (!firstName || firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters long"
    }

    if (!lastName || lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters long"
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!company || company.trim().length < 2) {
      errors.company = "Company name is required"
    }

    if (!phone || phone.trim().length < 10) {
      errors.phone = "Please enter a valid phone number"
    }

    if (!jobTitle || jobTitle.trim().length < 2) {
      errors.jobTitle = "Job title is required"
    }

    if (!companySize) {
      errors.companySize = "Please select your company size"
    }

    if (!currentSolution) {
      errors.currentSolution = "Please select your current solution"
    }

    if (!challenges || challenges.trim().length < 10) {
      errors.challenges = "Please describe your challenges (at least 10 characters)"
    }

    if (Object.keys(errors).length > 0) {
      return { errors }
    }

    // Verify reCAPTCHA (non-blocking)
    let captchaValid = false
    if (captchaToken) {
      try {
        captchaValid = await verifyCaptcha(captchaToken)
      } catch (error) {
        console.warn("reCAPTCHA verification failed:", error)
        // Continue with form submission even if reCAPTCHA fails
      }
    }

    // Validate affiliate code if provided
    let validatedAffiliate: string | undefined
    if (affiliate) {
      const isValidAffiliate = validateAffiliate(affiliate)
      if (isValidAffiliate) {
        validatedAffiliate = affiliate.toUpperCase()
      }
    }

    // Get visitor data for tracking
    const visitorData = typeof window !== "undefined" ? getVisitorData() : null

    // Prepare email content
    const emailSubject = `New Demo Request from ${firstName} ${lastName} at ${company}`
    const emailBody = `
      <h2>New Demo Request</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Job Title:</strong> ${jobTitle}</p>
      <p><strong>Company Size:</strong> ${companySize}</p>
      <p><strong>Current Solution:</strong> ${currentSolution}</p>
      <p><strong>Challenges:</strong></p>
      <p>${challenges.replace(/\n/g, "<br>")}</p>
      
      <hr>
      <h3>Tracking Information</h3>
      <p><strong>reCAPTCHA Status:</strong> ${captchaValid ? "Verified" : "Not verified or failed"}</p>
      <p><strong>Affiliate Code:</strong> ${validatedAffiliate || "None"}</p>
      <p><strong>Submission Time:</strong> ${new Date().toISOString()}</p>
      ${
        visitorData
          ? `
        <p><strong>Visitor ID:</strong> ${visitorData.visitorId}</p>
        <p><strong>Session ID:</strong> ${visitorData.sessionId}</p>
        <p><strong>UTM Source:</strong> ${visitorData.utmSource || "N/A"}</p>
        <p><strong>UTM Campaign:</strong> ${visitorData.utmCampaign || "N/A"}</p>
        <p><strong>Affiliate:</strong> ${visitorData.affiliate || "N/A"}</p>
        <p><strong>Referrer:</strong> ${visitorData.referrer || "N/A"}</p>
        <p><strong>Page Views:</strong> ${visitorData.pageViews || "N/A"}</p>
      `
          : ""
      }
    `

    // Send email
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      html: emailBody,
    })

    if (!emailResult.success) {
      console.error("Failed to send demo form email:", emailResult.error)
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
    console.error("Demo form submission error:", error)
    return {
      success: false,
      message: "There was an unexpected error. Please try again later.",
    }
  }
}
