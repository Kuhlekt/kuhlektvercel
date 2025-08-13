"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"

export async function submitDemoRequest(formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const jobTitle = formData.get("jobTitle") as string
    const companySize = formData.get("companySize") as string
    const challenges = formData.get("challenges") as string // Optional field
    const recaptchaToken = formData.get("recaptchaToken") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !phone || !jobTitle || !companySize) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Verify reCAPTCHA
    if (recaptchaToken) {
      const recaptchaResult = await verifyRecaptcha(recaptchaToken)
      if (!recaptchaResult.success) {
        return {
          success: false,
          message: "reCAPTCHA verification failed. Please try again.",
        }
      }
    }

    // Prepare email content
    const emailSubject = `Demo Request from ${firstName} ${lastName} at ${company}`
    const emailBody = `
      <h2>New Demo Request</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Job Title:</strong> ${jobTitle}</p>
      <p><strong>Company Size:</strong> ${companySize}</p>
      ${challenges ? `<p><strong>Challenges:</strong> ${challenges}</p>` : ""}
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `

    // Send email using AWS SES
    const adminEmail = process.env.ADMIN_EMAIL || "admin@kuhlekt.com"

    await sendEmailWithSES({
      to: adminEmail,
      subject: emailSubject,
      html: emailBody,
    })

    console.log("Demo request submitted successfully:", { firstName, lastName, email, company })

    return {
      success: true,
      message:
        "Demo request submitted successfully! We'll contact you within 24 hours to schedule your personalized demonstration.",
    }
  } catch (error) {
    console.error("Error submitting demo request:", error)
    return {
      success: false,
      message: "Failed to submit demo request. Please try again or contact us directly.",
    }
  }
}
