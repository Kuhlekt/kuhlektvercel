"use server"

import { sendEmail } from "@/lib/aws-ses"
import { validateAffiliate } from "@/lib/affiliate-validation"
import { verifyCaptcha } from "@/lib/captcha"

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
    let validAffiliate = null
    if (affiliateCode?.trim()) {
      validAffiliate = validateAffiliate(affiliateCode.trim())
    }

    // Prepare email content
    const emailSubject = `New Demo Request from ${firstName} ${lastName} at ${company}`
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
      ${validAffiliate ? `<p><strong>Affiliate Code:</strong> ${affiliateCode} (Valid)</p>` : ""}
      <p><strong>reCAPTCHA Verified:</strong> ${captchaVerified ? "Yes" : "No"}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
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
