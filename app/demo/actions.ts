"use server"

import { sendEmail } from "@/lib/aws-ses"
import { validateAffiliate } from "@/lib/affiliate-validation"
import { verifyCaptcha } from "@/lib/captcha"

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const businessEmail = formData.get("businessEmail") as string
    const companyName = formData.get("companyName") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const arChallenges = formData.get("arChallenges") as string
    const affiliateCode = formData.get("affiliateCode") as string
    const captchaToken = formData.get("captchaToken") as string

    // Validate required fields
    if (!firstName || !lastName || !businessEmail || !companyName || !phoneNumber) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(businessEmail)) {
      return {
        success: false,
        message: "Please enter a valid business email address.",
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
    const emailSubject = `New Demo Request from ${firstName} ${lastName} at ${companyName}`
    const emailBody = `
      <h2>New Demo Request</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${businessEmail}</p>
      <p><strong>Company:</strong> ${companyName}</p>
      <p><strong>Phone:</strong> ${phoneNumber}</p>
      ${arChallenges ? `<p><strong>AR Challenges:</strong></p><p>${arChallenges}</p>` : ""}
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
      console.error("Failed to send demo request email:", emailResult.error)
      return {
        success: false,
        message: "There was an error submitting your demo request. Please try again or contact us directly.",
      }
    }

    return {
      success: true,
      message: "Thank you for your demo request! We'll contact you within 24 hours to schedule your personalized demo.",
    }
  } catch (error) {
    console.error("Demo request submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
