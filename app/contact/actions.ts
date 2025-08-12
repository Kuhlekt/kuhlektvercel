"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  company?: string
  phone?: string
  message?: string
  affiliateCode?: string
  recaptcha?: string
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  // If no secret key is configured, allow the request (development mode)
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification")
    return true
  }

  // If it's the development token, allow it
  if (token === "development-mode") {
    return true
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return false
  }
}

export async function submitContactForm(prevState: any, formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const phone = formData.get("phone") as string
  const message = formData.get("message") as string
  const affiliateCode = formData.get("affiliateCode") as string
  const recaptchaToken = formData.get("recaptchaToken") as string

  const errors: FormErrors = {}

  // Validate required fields
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

  // Validate phone if provided
  if (phone && !/^[+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-()]/g, ""))) {
    errors.phone = "Please enter a valid phone number"
  }

  // Validate affiliate code if provided
  if (affiliateCode?.trim()) {
    const affiliateInfo = validateAffiliateCode(affiliateCode.trim())
    if (!affiliateInfo) {
      errors.affiliateCode = "Invalid affiliate code"
    }
  }

  // Verify reCAPTCHA
  if (!recaptchaToken) {
    errors.recaptcha = "Please complete the reCAPTCHA verification"
  } else {
    const captchaValid = await verifyRecaptcha(recaptchaToken)
    if (!captchaValid) {
      errors.recaptcha = "reCAPTCHA verification failed. Please try again."
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the errors below.",
      errors,
    }
  }

  try {
    // Prepare email content
    const affiliateInfo = affiliateCode?.trim() ? validateAffiliateCode(affiliateCode.trim()) : null

    const emailContent = `
New Contact Form Submission

Name: ${firstName} ${lastName}
Email: ${email}
Company: ${company}
Phone: ${phone || "Not provided"}
Message: ${message || "No message provided"}
${affiliateInfo ? `Affiliate Code: ${affiliateCode} (${affiliateInfo.name} - ${affiliateInfo.discount}% discount)` : ""}

Submitted at: ${new Date().toLocaleString()}
    `.trim()

    // Send email using AWS SES
    const result = await sendEmailWithSES({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    })

    if (!result.success) {
      console.error("Failed to send email:", result.message)
      return {
        success: false,
        message: "There was an error sending your message. Please try again.",
        errors: {},
      }
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      errors: {},
    }
  } catch (error) {
    console.error("Error sending contact form:", error)
    return {
      success: false,
      message: "There was an error sending your message. Please try again.",
      errors: {},
    }
  }
}
