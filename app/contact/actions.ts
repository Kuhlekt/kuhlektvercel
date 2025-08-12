"use server"

import { sendEmail } from "@/lib/aws-ses"
import { verifyCaptcha } from "@/lib/captcha"
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
  if (phone && !/^[+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-$$$$]/g, ""))) {
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
    const captchaValid = await verifyCaptcha(recaptchaToken)
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

    // Send email
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      body: emailContent,
    })

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
