"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyCaptcha } from "@/lib/captcha"

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const role = formData.get("role") as string
    const challenges = formData.get("challenges") as string
    const captchaToken = formData.get("recaptchaToken") as string

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

    // Verify CAPTCHA
    const captchaResult = await verifyCaptcha(captchaToken || "")
    if (!captchaResult.success) {
      return {
        success: false,
        message: captchaResult.error || "Please complete the CAPTCHA verification.",
      }
    }

    const demoData = {
      firstName,
      lastName,
      email,
      company,
      role: role || "Not specified",
      challenges: challenges || "Not specified",
      timestamp: new Date().toISOString(),
      captchaVerified: true,
    }

    console.log("Processing demo request:", {
      name: `${firstName} ${lastName}`,
      email,
      company,
      captchaVerified: true,
    })

    // Try to send email using AWS SDK
    try {
      const emailResult = await sendEmailWithSES({
        to: ["enquiries@kuhlekt.com"],
        subject: `New Demo Request from ${firstName} ${lastName}`,
        body: `
New Demo Request from Kuhlekt Website

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${company}
- Role: ${role || "Not specified"}

Challenges:
${challenges || "Not specified"}

Security:
- CAPTCHA Verified: Yes
- Timestamp: ${demoData.timestamp}

Please follow up with this prospect to schedule a demo.
        `,
        replyTo: email,
      })

      if (emailResult.success) {
        console.log("Demo request email sent successfully via AWS SDK:", emailResult.messageId)
      } else {
        console.log("Email sending failed, logging demo data:", demoData)
        console.error("Email error:", emailResult.message)
      }
    } catch (emailError) {
      console.error("Error with AWS SDK email service:", emailError)
      console.log("Logging demo data for manual follow-up:", demoData)
    }

    // Always return success to user
    return {
      success: true,
      message:
        "Thank you! Your demo request has been submitted. We'll contact you within 24 hours to schedule your personalized demo.",
    }
  } catch (error) {
    console.error("Error submitting demo request:", error)
    return {
      success: false,
      message:
        "Sorry, there was an error submitting your request. Please try again or contact us directly at enquiries@kuhlekt.com",
    }
  }
}
