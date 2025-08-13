"use server"

import { sendEmail } from "@/lib/aws-ses"
import { verifyCaptcha } from "@/lib/captcha"
import { getVisitorData } from "@/components/visitor-tracker"

interface ContactFormState {
  success?: boolean
  message?: string
  errors?: {
    name?: string
    email?: string
    company?: string
    phone?: string
    message?: string
    captcha?: string
  }
}

export async function submitContactForm(
  prevState: ContactFormState | null,
  formData: FormData,
): Promise<ContactFormState> {
  try {
    // Extract form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const message = formData.get("message") as string
    const captchaToken = formData.get("captcha") as string

    // Validation
    const errors: ContactFormState["errors"] = {}

    if (!name || name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long"
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!company || company.trim().length < 2) {
      errors.company = "Company name is required"
    }

    if (!phone || phone.trim().length < 10) {
      errors.phone = "Please enter a valid phone number"
    }

    // Message is optional - no validation needed

    if (Object.keys(errors).length > 0) {
      return { errors }
    }

    // Verify reCAPTCHA (non-blocking)
    let captchaValid = false
    if (captchaToken) {
      try {
        captchaValid = await verifyCaptcha(captchaToken)
      } catch (error) {
        console.warn("reCAPTCHA verification failed:", error)
        // Continue with form submission even if reCAPTCHA fails
      }
    }

    // Get visitor data for tracking
    const visitorData = typeof window !== "undefined" ? getVisitorData() : null

    // Prepare email content
    const emailSubject = `New Contact Form Submission from ${name}`
    const emailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${message ? `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>` : ""}
      
      <hr>
      <h3>Tracking Information</h3>
      <p><strong>reCAPTCHA Status:</strong> ${captchaValid ? "Verified" : "Not verified or failed"}</p>
      <p><strong>Submission Time:</strong> ${new Date().toISOString()}</p>
      ${
        visitorData
          ? `
        <p><strong>Visitor ID:</strong> ${visitorData.visitorId}</p>
        <p><strong>Session ID:</strong> ${visitorData.sessionId}</p>
        <p><strong>UTM Source:</strong> ${visitorData.utmSource || "N/A"}</p>
        <p><strong>UTM Campaign:</strong> ${visitorData.utmCampaign || "N/A"}</p>
        <p><strong>Affiliate:</strong> ${visitorData.affiliate || "N/A"}</p>
        <p><strong>Referrer:</strong> ${visitorData.referrer || "N/A"}</p>
        <p><strong>Page Views:</strong> ${visitorData.pageViews || "N/A"}</p>
      `
          : ""
      }
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
      message: "There was an unexpected error. Please try again later.",
    }
  }
}
