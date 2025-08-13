"use server"

import { sendEmail } from "@/lib/aws-ses"

export interface ContactFormState {
  success: boolean
  message: string
  errors: Record<string, string>
}

const initialState: ContactFormState = {
  success: false,
  message: "",
  errors: {},
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  try {
    // Extract and validate form data
    const firstName = formData.get("firstName")?.toString()?.trim()
    const lastName = formData.get("lastName")?.toString()?.trim()
    const email = formData.get("email")?.toString()?.trim()
    const company = formData.get("company")?.toString()?.trim()
    const phone = formData.get("phone")?.toString()?.trim()
    const message = formData.get("message")?.toString()?.trim()
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

    if (!message) {
      errors.message = "Message is required"
    }

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
      <p><strong>Message:</strong></p>
      <p>${message}</p>
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
