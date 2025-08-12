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
        message: "Please complete the reCAPTCHA verification.",
      }
    }

    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const jobTitle = formData.get("jobTitle") as string
    const companySize = formData.get("companySize") as string
    const industry = formData.get("industry") as string
    const currentSolution = formData.get("currentSolution") as string
    const challenges = formData.get("challenges") as string
    const timeline = formData.get("timeline") as string
    const budget = formData.get("budget") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Send email notification
    const emailContent = `
      New Demo Request:
      
      Name: ${firstName} ${lastName}
      Email: ${email}
      Company: ${company}
      Phone: ${phone || "Not provided"}
      Job Title: ${jobTitle || "Not provided"}
      Company Size: ${companySize || "Not provided"}
      Industry: ${industry || "Not provided"}
      Current Solution: ${currentSolution || "Not provided"}
      Challenges: ${challenges || "Not provided"}
      Timeline: ${timeline || "Not provided"}
      Budget: ${budget || "Not provided"}
    `

    await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL!,
      subject: `New Demo Request from ${firstName} ${lastName}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    })

    return {
      success: true,
      message:
        "Thank you for your demo request! We'll be in touch within 24 hours to schedule your personalized demonstration.",
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
