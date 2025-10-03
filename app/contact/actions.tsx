"use server"

import { sendEmail } from "@/lib/aws-ses"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"

export interface ContactFormState {
  success: boolean
  message: string
  shouldClearForm?: boolean
  errors: {
    firstName?: string
    lastName?: string
    email?: string
    message?: string
    recaptcha?: string
  }
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  try {
    const firstName = formData.get("firstName")?.toString()?.trim()
    const lastName = formData.get("lastName")?.toString()?.trim()
    const email = formData.get("email")?.toString()?.trim()
    const company = formData.get("company")?.toString()?.trim()
    const phone = formData.get("phone")?.toString()?.trim()
    const message = formData.get("message")?.toString()?.trim()

    let recaptchaToken = null

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
        recaptchaToken = value
        console.log(`Contact form: Found reCAPTCHA token in field '${field}'`)
        break
      }
    }

    if (!recaptchaToken) {
      console.warn("Contact form: No reCAPTCHA token found - proceeding without verification for debugging")
    } else {
      const recaptchaResult = await verifyRecaptcha(recaptchaToken)
      if (!recaptchaResult.success) {
        console.error("Contact form: reCAPTCHA verification failed:", recaptchaResult.error)
        return {
          success: false,
          message: `reCAPTCHA verification failed: ${recaptchaResult.error}`,
          errors: { recaptcha: "Verification failed. Please try again." },
        }
      }
    }

    const errors: { firstName?: string; lastName?: string; email?: string; message?: string; recaptcha?: string } = {}

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

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    const emailSubject = `Contact Form Message from ${firstName} ${lastName}`
    const emailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : "<p><strong>Message:</strong> No message provided</p>"}
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `

    const emailText = `
New Contact Form Submission

Name: ${firstName} ${lastName}
Email: ${email}
${company ? `Company: ${company}` : ""}
${phone ? `Phone: ${phone}` : ""}
${message ? `Message: ${message}` : "Message: No message provided"}
Submitted: ${new Date().toLocaleString()}
    `

    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      html: emailBody,
      text: emailText,
    })

    if (!emailResult.success) {
      console.error("Failed to send contact form email:", emailResult.message)
      return {
        success: false,
        message: "There was an error sending your message. Please try again or contact us directly.",
        shouldClearForm: false,
        errors: {},
      }
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      shouldClearForm: true,
      errors: {},
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      shouldClearForm: false,
      errors: {},
    }
  }
}

export async function sendTestEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt Contact Form",
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from the Kuhlekt contact form system.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
      text: `Test Email - This is a test email from the Kuhlekt contact form system. Timestamp: ${new Date().toISOString()}`,
    })

    return {
      success: result.success,
      message: result.message || "Email sent successfully",
    }
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send test email",
    }
  }
}
