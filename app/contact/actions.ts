"use server"

import { sendEmail } from "@/lib/aws-ses"
import { validateAffiliate } from "@/lib/affiliate-validation"
import { verifyCaptcha } from "@/lib/captcha"

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const companyName = formData.get("companyName") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const inquiryType = formData.get("inquiryType") as string
    const message = formData.get("message") as string
    const affiliateCode = formData.get("affiliateCode") as string
    const captchaToken = formData.get("captchaToken") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !companyName || !phoneNumber) {
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

    // Verify reCAPTCHA (non-blocking)
    let captchaVerified = false
    if (captchaToken) {
      try {
        captchaVerified = await verifyCaptcha(captchaToken)
      } catch (error) {
        console.error("reCAPTCHA verification error:", error)
        // Continue with form submission even if reCAPTCHA fails
      }
    }

    // Validate affiliate code if provided
    let validAffiliate = null
    if (affiliateCode) {
      validAffiliate = validateAffiliate(affiliateCode)
    }

    // Prepare email content
    const emailSubject = `New Contact Form Submission from ${firstName} ${lastName}`
    const emailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${companyName}</p>
      <p><strong>Phone:</strong> ${phoneNumber}</p>
      <p><strong>Inquiry Type:</strong> ${inquiryType || "General Inquiry"}</p>
      ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : ""}
      ${validAffiliate ? `<p><strong>Affiliate Code:</strong> ${affiliateCode} (Valid)</p>` : ""}
      <p><strong>reCAPTCHA Verified:</strong> ${captchaVerified ? "Yes" : "No"}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `

    // Send email
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      html: emailBody,
    })

    if (!emailResult.success) {
      console.error("Failed to send contact email:", emailResult.error)
      return {
        success: false,
        message: "There was an error sending your message. Please try again or contact us directly.",
      }
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
