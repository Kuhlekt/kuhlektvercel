"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { validateAffiliateCode } from "@/lib/affiliate-validation"
import { verifyCaptcha } from "@/lib/captcha"

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const message = formData.get("message") as string
    const affiliateCode = formData.get("affiliateCode") as string
    const recaptchaToken = formData.get("recaptchaToken") as string

    // Validate required fields
    if (!name || !email || !company) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      }
    }

    // Verify reCAPTCHA
    const captchaResult = await verifyCaptcha(recaptchaToken)
    if (!captchaResult.success) {
      return {
        success: false,
        message: "Please complete the reCAPTCHA verification.",
      }
    }

    // Validate affiliate code if provided
    let affiliateValidation = null
    if (affiliateCode && affiliateCode.trim()) {
      affiliateValidation = await validateAffiliateCode(affiliateCode.trim())
    }

    // Prepare email content
    const messageContent = message && message.trim() ? message : "No message provided"
    const affiliateInfo = affiliateValidation
      ? `\n\nAffiliate Code: ${affiliateCode} (${affiliateValidation.isValid ? "Valid" : "Invalid"})`
      : affiliateCode
        ? `\n\nAffiliate Code: ${affiliateCode} (Not validated)`
        : ""

    const emailContent = `
New contact form submission:

Name: ${name}
Email: ${email}
Company: ${company}
Message: ${messageContent}${affiliateInfo}

Submitted at: ${new Date().toLocaleString()}
    `.trim()

    // Send email
    const result = await sendEmailWithSES({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: `New Contact Form Submission from ${name}`,
      body: emailContent,
    })

    if (result.success) {
      return {
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
      }
    } else {
      return {
        success: false,
        message: "There was an error sending your message. Please try again.",
      }
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      message: "There was an error processing your request. Please try again.",
    }
  }
}
