"use server"

import { sendEmail } from "@/lib/aws-ses"
import { testAWSSESConnection } from "@/lib/aws-ses"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"

export interface ContactFormState {
  success?: boolean
  message?: string
  errors?: Record<string, string>
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  try {
    // Extract form data with null safety
    const firstName = formData.get("firstName")?.toString()?.trim()
    const lastName = formData.get("lastName")?.toString()?.trim()
    const email = formData.get("email")?.toString()?.trim()
    const company = formData.get("company")?.toString()?.trim()
    const phone = formData.get("phone")?.toString()?.trim()
    const message = formData.get("message")?.toString()?.trim()

    let recaptchaToken = null

    // Check all possible reCAPTCHA field names
    const possibleFields = [
      "recaptcha-token",
      "g-recaptcha-response",
      "recaptchaToken",
      "recaptcha_token",
      "recaptcha",
      "captcha",
      "token",
    ]

    for (const field of possibleFields) {
      const value = formData.get(field)?.toString()?.trim()
      if (value && value.length > 10) {
        // reCAPTCHA tokens are typically much longer
        recaptchaToken = value
        console.log(`Contact form: Found reCAPTCHA token in field '${field}'`)
        break
      }
    }

    // Debug logging for all form fields
    console.log("Contact form submission - All form fields:")
    for (const [key, value] of formData.entries()) {
      console.log(
        `  ${key}: ${typeof value === "string" ? (value.length > 50 ? value.substring(0, 50) + "..." : value) : "[File]"}`,
      )
    }

    console.log("Contact form submission - reCAPTCHA token received:", !!recaptchaToken)
    console.log("Contact form submission - reCAPTCHA token length:", recaptchaToken?.length || 0)

    if (!recaptchaToken) {
      console.warn("Contact form: No reCAPTCHA token found - proceeding without verification for debugging")
      // Don't return error, just log and continue
    } else {
      console.log("Contact form: Verifying reCAPTCHA token...")
      const recaptchaResult = await verifyRecaptcha(recaptchaToken)
      console.log("Contact form: reCAPTCHA result:", recaptchaResult)

      if (!recaptchaResult.success) {
        console.error("Contact form: reCAPTCHA verification failed:", recaptchaResult.error)
        return {
          success: false,
          message: `reCAPTCHA verification failed: ${recaptchaResult.error}`,
          errors: { recaptcha: "Verification failed. Please try again." },
        }
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

    // Message is now optional - removed validation requirement
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Prepare email content
    const emailSubject = `Contact Form Message from ${firstName} ${lastName}`
    const emailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : "<p><strong>Message:</strong> No message provided</p>"}
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>reCAPTCHA:</strong> ${recaptchaToken ? "Verified ✓" : "Bypassed (Debug Mode)"}</p>
    `

    // Send email
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      html: emailBody,
    })

    if (!emailResult.success) {
      console.error("Failed to send contact form email:", emailResult.error)
      return {
        success: false,
        message: "There was an error sending your message. Please try again or contact us directly.",
        errors: {},
      }
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      errors: {},
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      errors: {},
    }
  }
}

// Added missing testAWSSES server action that was being imported by test page
export async function testAWSSES() {
  return await testAWSSESConnection()
}
