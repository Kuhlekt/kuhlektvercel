"use server"

import { sendContactEmail } from "@/lib/email-service"

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string
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

    if (!subject?.trim()) {
      errors.subject = "Subject is required"
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Prepare email data
    const emailData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      company: company.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message?.trim() || "",
      captchaToken: captchaToken || "",
    }

    // Send email
    const emailResult = await sendContactEmail(emailData)

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send message. Please try again or contact support directly.",
        errors: {},
      }
    }

    return {
      success: true,
      message: "Message sent successfully! We'll get back to you within 24 hours.",
      errors: {},
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      errors: {},
    }
  }
}
