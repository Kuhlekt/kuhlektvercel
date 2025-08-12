"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"

export async function submitDemoRequest(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const jobTitle = formData.get("jobTitle") as string
    const companySize = formData.get("companySize") as string
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      }
    }

    // Send email notification
    const emailBody = `New Demo Request Received

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${company}
- Phone: ${phone || "Not provided"}
- Job Title: ${jobTitle || "Not provided"}

Company Details:
- Company Size: ${companySize || "Not provided"}
- Current Solution: ${currentSolution || "Not provided"}
- Timeline: ${timeline || "Not provided"}

Challenges:
${challenges || "Not provided"}

Submitted at: ${new Date().toISOString()}
`

    const result = await sendEmailWithSES({
      to: [process.env.AWS_SES_FROM_EMAIL || "demo@kuhlekt.com"],
      subject: `New Demo Request from ${firstName} ${lastName} at ${company}`,
      body: emailBody,
      replyTo: email,
    })

    if (result.success) {
      return {
        success: true,
        message:
          "Thank you for your demo request! We will contact you within 24 hours to schedule your personalized demonstration.",
      }
    } else {
      // Log the submission even if email fails
      console.log("Demo request logged for manual follow-up:", {
        firstName,
        lastName,
        email,
        company,
        phone,
        jobTitle,
        companySize,
        currentSolution,
        challenges,
        timeline,
        timestamp: new Date().toISOString(),
      })

      return {
        success: true,
        message:
          "Thank you for your demo request! We have received your information and will contact you within 24 hours.",
      }
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
