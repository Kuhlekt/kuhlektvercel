"use server"

import { sendEmail } from "@/lib/email-service"
import { verifyCaptcha } from "@/lib/recaptcha-actions"

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    const captchaToken = formData.get("captcha-token") as string

    // Verify reCAPTCHA
    const captchaResult = await verifyCaptcha(captchaToken)
    if (!captchaResult.success) {
      return {
        success: false,
        message: "Please complete the captcha verification.",
      }
    }

    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const jobTitle = formData.get("jobTitle") as string
    const companySize = formData.get("companySize") as string
    const arVolume = formData.get("arVolume") as string
    const currentSolution = formData.get("currentSolution") as string
    const challenges = formData.get("challenges") as string
    const timeline = formData.get("timeline") as string

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

    // Send notification email
    const emailContent = `
      New Demo Request Received
      
      Contact Information:
      - Name: ${firstName} ${lastName}
      - Email: ${email}
      - Company: ${company}
      - Phone: ${phone || "Not provided"}
      - Job Title: ${jobTitle || "Not provided"}
      
      Company Details:
      - Company Size: ${companySize || "Not provided"}
      - AR Volume: ${arVolume || "Not provided"}
      - Current Solution: ${currentSolution || "Not provided"}
      
      Additional Information:
      - Challenges: ${challenges || "Not provided"}
      - Timeline: ${timeline || "Not provided"}
      
      Please follow up with this prospect as soon as possible.
    `

    await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "admin@kuhlekt.com",
      subject: `New Demo Request from ${firstName} ${lastName} at ${company}`,
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
      message: "There was an error processing your request. Please try again or contact us directly.",
    }
  }
}

// Export alias for compatibility
export const submitDemoForm = submitDemoRequest
