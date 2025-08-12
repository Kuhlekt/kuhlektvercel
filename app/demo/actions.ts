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

    // Send email notification
    const emailContent = `
      New Demo Request:
      
      Name: ${firstName} ${lastName}
      Email: ${email}
      Company: ${company}
      Phone: ${phone || "Not provided"}
      Message: ${message || "No message provided"}
    `

    await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "admin@kuhlekt.com",
      subject: "New Demo Request",
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    })

    return {
      success: true,
      message: "Thank you for your interest! We'll contact you soon to schedule your demo.",
    }
  } catch (error) {
    console.error("Demo request error:", error)
    return {
      success: false,
      message: "There was an error submitting your request. Please try again.",
    }
  }
}

// Export alias for compatibility
export const submitDemoForm = submitDemoRequest
