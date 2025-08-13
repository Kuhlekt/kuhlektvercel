"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"

interface DemoRequestData {
  firstName: string
  lastName: string
  email: string
  company: string
  phone?: string
  message?: string
  recaptchaToken: string
}

export async function submitDemoRequest(formData: FormData) {
  try {
    // Extract form data
    const data: DemoRequestData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
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

    // Prepare email content
    const emailSubject = `Demo Request from ${data.firstName} ${data.lastName} - ${data.company}`
    const emailBody = `
New demo request submission:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Company: ${data.company}
Phone: ${data.phone || "Not provided"}
Message: ${data.message || "No additional message"}

Submitted at: ${new Date().toISOString()}

Please follow up with this prospect to schedule their demo.
    `.trim()

    // Send email using AWS SES
    const emailResult = await sendEmailWithSES({
      to: [process.env.ADMIN_EMAIL || "admin@kuhlekt.com"],
      subject: emailSubject,
      body: emailBody,
    })

    if (!emailResult.success) {
      console.error("Failed to send demo request email:", emailResult.error)
      return {
        success: false,
        error: "Failed to submit your demo request. Please try again later.",
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
      error: "An unexpected error occurred. Please try again later.",
    }
  }
}
