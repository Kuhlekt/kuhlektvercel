"use server"

import { sendEmail } from "@/lib/email-service"
import { verifyCaptcha } from "@/lib/captcha"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

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

    // Visitor tracking data
    const referrer = formData.get("referrer") as string
    const utmSource = formData.get("utmSource") as string
    const utmCampaign = formData.get("utmCampaign") as string
    const pageViews = formData.get("pageViews") as string

    // Validate required fields
    const errors: Record<string, string> = {}

    if (!firstName?.trim()) errors.firstName = "First name is required"
    if (!lastName?.trim()) errors.lastName = "Last name is required"
    if (!email?.trim()) errors.email = "Email is required"
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, message: "Please fix the errors below", errors }
    }

    // Verify reCAPTCHA
    if (recaptchaToken) {
      const captchaResult = await verifyCaptcha(recaptchaToken)
      if (!captchaResult.success) {
        return { success: false, message: "reCAPTCHA verification failed. Please try again." }
      }
    }

    // Validate affiliate code if provided
    let affiliateInfo = null
    if (affiliate?.trim()) {
      const validation = validateAffiliateCode(affiliate.trim())
      if (validation.isValid && validation.info) {
        affiliateInfo = validation.info
      }
    }

    // Prepare email content
    const adminEmailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || "Not provided"}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      ${
        affiliateInfo
          ? `
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="color: #1976d2; margin: 0 0 10px 0;">🎯 Affiliate Code Used</h3>
          <p><strong>Code:</strong> ${affiliate.trim().toUpperCase()}</p>
          <p><strong>Discount:</strong> ${affiliateInfo.discount}%</p>
          <p><strong>Description:</strong> ${affiliateInfo.description}</p>
        </div>
      `
          : ""
      }
      <p><strong>Message:</strong></p>
      <p>${message || "No message provided"}</p>
      
      <hr style="margin: 20px 0;">
      <h3>Visitor Tracking Information</h3>
      <p><strong>Referrer:</strong> ${referrer || "Direct"}</p>
      <p><strong>UTM Source:</strong> ${utmSource || "None"}</p>
      <p><strong>UTM Campaign:</strong> ${utmCampaign || "None"}</p>
      <p><strong>Page Views:</strong> ${pageViews || "Unknown"}</p>
      <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
    `

    const userEmailContent = `
      <h2>Thank you for contacting Kuhlekt!</h2>
      <p>Dear ${firstName},</p>
      <p>Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.</p>
      
      ${
        affiliateInfo
          ? `
        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="color: #2e7d32; margin: 0 0 10px 0;">🎉 Affiliate Discount Applied!</h3>
          <p>Great news! Your affiliate code <strong>${affiliate.trim().toUpperCase()}</strong> is valid and gives you a <strong>${affiliateInfo.discount}% discount</strong> on our services.</p>
          <p>${affiliateInfo.description}</p>
          <p>Our team will include this discount in any proposals we send you.</p>
        </div>
      `
          : ""
      }
      
      <p><strong>Your submission details:</strong></p>
      <ul>
        <li>Name: ${firstName} ${lastName}</li>
        <li>Email: ${email}</li>
        <li>Company: ${company || "Not provided"}</li>
        <li>Phone: ${phone || "Not provided"}</li>
      </ul>
      
      <p>In the meantime, feel free to explore our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/solutions">solutions page</a> to learn more about how Kuhlekt can help streamline your accounts receivable process.</p>
      
      <p>Best regards,<br>The Kuhlekt Team</p>
    `

    // Send emails
    await Promise.all([
      sendEmail({
        to: process.env.AWS_SES_FROM_EMAIL!,
        subject: `New Contact Form Submission from ${firstName} ${lastName}${affiliateInfo ? " (Affiliate Code Used)" : ""}`,
        html: adminEmailContent,
      }),
      sendEmail({
        to: email,
        subject: `Thank you for contacting Kuhlekt${affiliateInfo ? " - Discount Applied!" : ""}`,
        html: userEmailContent,
      }),
    ])

    return {
      success: true,
      message: affiliateInfo
        ? `Thank you for your message! We'll be in touch within 24 hours. Your ${affiliateInfo.discount}% affiliate discount has been noted.`
        : "Thank you for your message! We'll be in touch within 24 hours.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "There was an error sending your message. Please try again later.",
    }
  }
}
