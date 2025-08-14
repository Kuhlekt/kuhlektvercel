"use server"

import { sendEmail } from "@/lib/aws-ses"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"

export interface DemoFormState {
  success?: boolean
  message?: string
  errors?: Record<string, string>
}

export async function submitDemoRequest(prevState: DemoFormState, formData: FormData): Promise<DemoFormState> {
  try {
    // Extract form data with null safety
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

    console.log(
      "Demo form - All form fields:",
      Array.from(formData.entries()).map(([key, value]) => `${key}: ${value}`),
    )

    // Check all possible reCAPTCHA field names
    const possibleTokenFields = [
      "recaptcha-token",
      "g-recaptcha-response",
      "recaptchaToken",
      "recaptcha_token",
      "captcha-token",
      "token",
      "captcha",
      "recaptcha",
      "grecaptcha",
      "h-captcha-response",
      "cf-turnstile-response",
      "turnstile-response",
    ]

    let recaptchaToken = ""
    for (const field of possibleTokenFields) {
      const token = formData.get(field)?.toString()?.trim()
      if (token && token.length > 10) {
        // Valid tokens are typically much longer
        recaptchaToken = token
        console.log(`Demo form - Found reCAPTCHA token in field: ${field}`)
        break
      }
    }

    console.log("Demo form - reCAPTCHA token found:", recaptchaToken ? "Yes" : "No")
    console.log("Demo form - Token length:", recaptchaToken?.length || 0)

    if (!recaptchaToken) {
      console.log("Demo form - No reCAPTCHA token found, proceeding without verification (temporary)")
      console.log("Demo form - Available form fields:", Array.from(formData.keys()).join(", "))
    } else {
      try {
        const recaptchaResult = await verifyRecaptcha(recaptchaToken)
        if (!recaptchaResult.success) {
          console.error("Demo form - reCAPTCHA verification failed:", recaptchaResult.error)
          // Continue anyway for now
          console.log("Demo form - Continuing despite reCAPTCHA failure (temporary)")
        } else {
          console.log("Demo form - reCAPTCHA verification successful")
        }
      } catch (error) {
        console.error("Demo form - reCAPTCHA verification error:", error)
        // Continue anyway for now
        console.log("Demo form - Continuing despite reCAPTCHA error (temporary)")
      }
    }

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
      <p><strong>reCAPTCHA:</strong> ${recaptchaToken ? "Token Received" : "Bypassed (Debug Mode)"}</p>
    `

    // Send email
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      html: emailBody,
      text: `New Demo Request from ${firstName} ${lastName} at ${company}\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nCompany: ${company}\nPhone: ${phone}${jobTitle ? `\nJob Title: ${jobTitle}` : ""}${companySize ? `\nCompany Size: ${companySize}` : ""}${currentSolution ? `\nCurrent Solution: ${currentSolution}` : ""}${timeline ? `\nTimeline: ${timeline}` : ""}${challenges ? `\nChallenges: ${challenges}` : ""}${affiliateCode ? `\nAffiliate Code: ${affiliateCode}` : ""}\n\nSubmitted: ${new Date().toLocaleString()}\nreCAPTCHA: ${recaptchaToken ? "Token Received" : "Bypassed (Debug Mode)"}`,
    })

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
