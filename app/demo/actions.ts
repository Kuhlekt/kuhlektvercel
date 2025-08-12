"use server"

import { sendEmail } from "@/lib/email-service"

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const message = formData.get("message") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return {
        success: false,
        error: "Please fill in all required fields",
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Please enter a valid email address",
      }
    }

    // Send notification email
    const emailContent = `
      New Demo Request:
      
      Name: ${firstName} ${lastName}
      Email: ${email}
      Company: ${company}
      Phone: ${phone || "Not provided"}
      
      Message:
      ${message || "No message provided"}
    `

    await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "admin@kuhlekt.com",
      subject: `Demo Request from ${firstName} ${lastName} - ${company}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    })

    return {
      success: true,
      message: "Thank you for your interest! We'll contact you within 24 hours to schedule your demo.",
    }
  } catch (error) {
    console.error("Demo request error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again or contact us directly.",
    }
  }
}

// Export alias for compatibility
export const submitDemoForm = submitDemoRequest
