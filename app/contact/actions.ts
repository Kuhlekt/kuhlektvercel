"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  company: string
  message?: string
  affiliate?: string
  recaptchaToken: string
}

export async function submitContactForm(formData: FormData) {
  try {
    // Extract form data
    const data: ContactFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
      affiliate: formData.get("affiliate") as string,
      recaptchaToken: formData.get("recaptchaToken") as string,
    }

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.company) {
      return {
        success: false,
        error: "Please fill in all required fields.",
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: "Please enter a valid email address.",
      }
    }

    // Verify reCAPTCHA
    if (!data.recaptchaToken) {
      return {
        success: false,
        error: "Please complete the reCAPTCHA verification.",
      }
    }

    const recaptchaResult = await verifyRecaptcha(data.recaptchaToken)
    if (!recaptchaResult.success) {
      return {
        success: false,
        error: "reCAPTCHA verification failed. Please try again.",
      }
    }

    // Validate affiliate code if provided
    let validatedAffiliate = ""
    if (data.affiliate && data.affiliate.trim()) {
      const affiliateValidation = validateAffiliateCode(data.affiliate.trim())
      if (affiliateValidation.isValid) {
        validatedAffiliate = affiliateValidation.code
      }
    }

    // Prepare email content
    const emailSubject = `Contact Form Submission from ${data.firstName} ${data.lastName}`
    const emailBody = `
New contact form submission:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Company: ${data.company}
Message: ${data.message || "No message provided"}
${validatedAffiliate ? `Affiliate Code: ${validatedAffiliate}` : ""}

Submitted at: ${new Date().toISOString()}
    `.trim()

    // Send email using AWS SES
    const emailResult = await sendEmailWithSES({
      to: [process.env.ADMIN_EMAIL || "admin@kuhlekt.com"],
      subject: emailSubject,
      body: emailBody,
    })

    if (!emailResult.success) {
      console.error("Failed to send contact email:", emailResult.error)
      return {
        success: false,
        error: "Failed to send your message. Please try again later.",
      }
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    }
  }
}

export async function testAWSSES() {
  try {
    const testResult = await sendEmailWithSES({
      to: [process.env.ADMIN_EMAIL || "admin@kuhlekt.com"],
      subject: "AWS SES Test Email",
      body: "This is a test email to verify AWS SES configuration is working properly.",
    })

    if (testResult.success) {
      return {
        success: true,
        message: "Test email sent successfully!",
      }
    } else {
      return {
        success: false,
        error: `Failed to send test email: ${testResult.error}`,
      }
    }
  } catch (error) {
    console.error("AWS SES test error:", error)
    return {
      success: false,
      error: "An unexpected error occurred while testing AWS SES.",
    }
  }
}
