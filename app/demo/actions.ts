"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"

export async function submitDemoRequest(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const companySize = formData.get("companySize") as string
    const challenges = formData.get("challenges") as string
    const affiliate = formData.get("affiliate") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      }
    }

    // Prepare email content
    const emailSubject = `Demo Request from ${firstName} ${lastName} - ${company}`

    const emailBody = `
New Demo Request Received

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${company}
- Phone: ${phone || "Not provided"}
- Company Size: ${companySize || "Not specified"}

${challenges ? `AR Challenges:\n${challenges}\n` : ""}
${affiliate ? `Affiliate/Referral Code: ${affiliate}\n` : ""}

Request submitted at: ${new Date().toLocaleString()}
    `.trim()

    // Send email using AWS SES
    const emailResult = await sendEmailWithSES({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      body: emailBody,
    })

    if (!emailResult.success) {
      console.error("Failed to send demo request email:", emailResult.error)
      return {
        success: false,
        message: "Failed to send demo request. Please try again or contact us directly.",
      }
    }

    return {
      success: true,
      message:
        "Demo request submitted successfully! We'll contact you within 24 hours to schedule your personalized demonstration.",
    }
  } catch (error) {
    console.error("Demo request submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
