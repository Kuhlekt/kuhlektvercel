"use server"

import { sendEmail } from "@/lib/email-service"
import { verifyCaptcha } from "@/lib/captcha"

// Predefined affiliate table for validation
const affiliateTable = ["PARTNER001", "PARTNER002", "RESELLER01", "CHANNEL01", "AFFILIATE01", "PROMO2024", "SPECIAL01"]

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const affiliate = formData.get("affiliate") as string
    const message = formData.get("message") as string
    const recaptchaToken = formData.get("recaptchaToken") as string

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return {
        success: false,
        error: true,
        message: "Please fill in all required fields.",
      }
    }

    // Verify reCAPTCHA
    const captchaResult = await verifyCaptcha(recaptchaToken)
    if (!captchaResult.success) {
      return {
        success: false,
        error: true,
        message: "Please complete the reCAPTCHA verification.",
      }
    }

    // Validate affiliate code if provided
    const validAffiliate =
      affiliate && affiliateTable.includes(affiliate.toUpperCase()) ? affiliate.toUpperCase() : null

    // Prepare email content
    const emailSubject = "New Contact Form Submission - Kuhlekt"
    const emailBody = `
      New contact form submission:
      
      Name: ${firstName} ${lastName}
      Email: ${email}
      Company: ${company || "Not provided"}
      Phone: ${phone || "Not provided"}
      ${validAffiliate ? `Affiliate: ${validAffiliate}` : ""}
      Message: ${message || "No message provided"}
      
      Submitted at: ${new Date().toISOString()}
    `

    // Send email
    await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "contact@kuhlekt.com",
      subject: emailSubject,
      body: emailBody,
    })

    return {
      success: true,
      error: false,
      message: "Thank you for your message! We'll get back to you soon.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      error: true,
      message: "Something went wrong. Please try again later.",
    }
  }
}
