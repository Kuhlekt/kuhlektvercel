"use server"

import { sendEmailWithSES } from "@/lib/email-service"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"

export async function submitDemoRequest(formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName")?.toString() || ""
    const lastName = formData.get("lastName")?.toString() || ""
    const email = formData.get("email")?.toString() || ""
    const company = formData.get("company")?.toString() || ""
    const phone = formData.get("phone")?.toString() || ""
    const challenges = formData.get("challenges")?.toString() || ""
    const affiliate = formData.get("affiliate")?.toString() || ""
    const recaptchaToken = formData.get("recaptchaToken")?.toString() || ""

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !phone) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(recaptchaToken)
    if (!recaptchaResult.success) {
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
      }
    }

    // Get admin email from environment
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      console.error("ADMIN_EMAIL environment variable not set")
      return {
        success: false,
        message: "Server configuration error. Please contact support.",
      }
    }

    // Prepare email content
    const subject = `New Demo Request from ${firstName} ${lastName} - ${company}`

    let emailBody = `
      <h2>New Demo Request</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Phone:</strong> ${phone}</p>
    `

    if (challenges) {
      emailBody += `<p><strong>AR Challenges:</strong></p><p>${challenges}</p>`
    }

    if (affiliate) {
      emailBody += `<p><strong>Affiliate/Referral Code:</strong> ${affiliate}</p>`
    }

    emailBody += `
      <hr>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Source:</strong> Demo Request Form</p>
    `

    // Send email
    const emailResult = await sendEmailWithSES({
      to: adminEmail,
      subject,
      html: emailBody,
    })

    if (!emailResult.success) {
      console.error("Failed to send demo request email:", emailResult.error)
      return {
        success: false,
        message: "Failed to submit demo request. Please try again or contact us directly.",
      }
    }

    console.log("Demo request submitted successfully:", {
      name: `${firstName} ${lastName}`,
      email,
      company,
      affiliate: affiliate || "none",
    })

    return {
      success: true,
      message:
        "Demo request submitted successfully! We'll contact you within 24 hours to schedule your personalized demo.",
    }
  } catch (error) {
    console.error("Error submitting demo request:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
