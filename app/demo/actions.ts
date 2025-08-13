"use server"

import { sendEmail } from "@/lib/aws-ses"

export interface DemoFormState {
  success: boolean
  message: string
  errors: Record<string, string>
}

const initialState: DemoFormState = {
  success: false,
  message: "",
  errors: {},
}

export async function submitDemoRequest(prevState: DemoFormState, formData: FormData): Promise<DemoFormState> {
  try {
    // Extract and validate form data
    const firstName = formData.get("firstName")?.toString()?.trim()
    const lastName = formData.get("lastName")?.toString()?.trim()
    const email = formData.get("email")?.toString()?.trim()
    const company = formData.get("company")?.toString()?.trim()
    const phone = formData.get("phone")?.toString()?.trim()
    const jobTitle = formData.get("jobTitle")?.toString()?.trim()
    const companySize = formData.get("companySize")?.toString()?.trim()
    const currentSolution = formData.get("currentSolution")?.toString()?.trim()
    const timeline = formData.get("timeline")?.toString()?.trim()
    const challenges = formData.get("challenges")?.toString()?.trim()
    const affiliateCode = formData.get("affiliateCode")?.toString()?.trim()
    const captchaToken = formData.get("captchaToken")?.toString()?.trim()

    // Validation
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

    // Prepare email content
    const emailSubject = `Demo Request from ${firstName} ${lastName} at ${company}`
    const emailBody = `
      <h2>New Demo Request</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${jobTitle ? `<p><strong>Job Title:</strong> ${jobTitle}</p>` : ""}
      ${companySize ? `<p><strong>Company Size:</strong> ${companySize}</p>` : ""}
      ${currentSolution ? `<p><strong>Current Solution:</strong> ${currentSolution}</p>` : ""}
      ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ""}
      ${challenges ? `<p><strong>Challenges:</strong></p><p>${challenges}</p>` : ""}
      ${affiliateCode ? `<p><strong>Affiliate Code:</strong> ${affiliateCode}</p>` : ""}
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>reCAPTCHA Token:</strong> ${captchaToken || "Not provided"}</p>
    `

    // Send email
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      html: emailBody,
    })

    if (!emailResult.success) {
      console.error("Failed to send demo request email:", emailResult.error)
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
