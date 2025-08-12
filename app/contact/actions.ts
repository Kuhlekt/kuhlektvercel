"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyCaptcha } from "@/lib/recaptcha-actions"
import { getVisitorData } from "@/components/visitor-tracker"

interface ContactFormData {
  name: string
  email: string
  company: string
  message?: string
  captchaToken: string
  affiliateCode?: string
}

export async function submitContactForm(formData: FormData) {
  try {
    // Extract form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const message = formData.get("message") as string
    const captchaToken = formData.get("captchaToken") as string
    const affiliateCode = formData.get("affiliateCode") as string

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
    if (!captchaToken) {
      return {
        success: false,
        message: "Please complete the reCAPTCHA verification.",
      }
    }

    const captchaResult = await verifyCaptcha(captchaToken)
    if (!captchaResult.success) {
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
      }
    }

    // Validate affiliate code if provided
    const affiliateTable = [
      "PARTNER001",
      "PARTNER002",
      "RESELLER01",
      "CHANNEL01",
      "AFFILIATE01",
      "PROMO2024",
      "SPECIAL01",
    ]
    const validAffiliate =
      affiliateCode && affiliateTable.includes(affiliateCode.toUpperCase()) ? affiliateCode.toUpperCase() : undefined

    // Get visitor data for context
    const visitorData = getVisitorData()

    // Prepare email content
    const emailSubject = `New Contact Form Submission from ${name}`
    const emailBody = `
      <h2>New Contact Form Submission</h2>
      
      <h3>Contact Information:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      
      <h3>Message:</h3>
      <p>${message || "No message provided"}</p>
      
      ${validAffiliate ? `<h3>Affiliate Information:</h3><p><strong>Affiliate Code:</strong> ${validAffiliate}</p>` : ""}
      
      ${
        visitorData
          ? `
        <h3>Visitor Information:</h3>
        <p><strong>Visitor ID:</strong> ${visitorData.visitorId}</p>
        <p><strong>Session ID:</strong> ${visitorData.sessionId}</p>
        <p><strong>Page Views:</strong> ${visitorData.pageViews}</p>
        <p><strong>Referrer:</strong> ${visitorData.referrer || "Direct"}</p>
        ${visitorData.utmSource ? `<p><strong>UTM Source:</strong> ${visitorData.utmSource}</p>` : ""}
        ${visitorData.utmCampaign ? `<p><strong>UTM Campaign:</strong> ${visitorData.utmCampaign}</p>` : ""}
      `
          : ""
      }
      
      <hr>
      <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
    `

    // Send email
    const emailResult = await sendEmailWithSES({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      html: emailBody,
    })

    if (!emailResult.success) {
      console.error("Failed to send contact email:", emailResult.error)
      return {
        success: false,
        message: "Failed to send your message. Please try again later.",
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
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}
