"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyCaptcha } from "@/lib/captcha"

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const role = formData.get("role") as string
    const companySize = formData.get("companySize") as string
    const message = formData.get("message") as string
    const captchaToken = formData.get("captcha-token") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !message) {
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
    const captchaResult = await verifyCaptcha(captchaToken)
    if (!captchaResult.success) {
      return {
        success: false,
        message: captchaResult.error || "Please complete the CAPTCHA verification.",
      }
    }

    const contactData = {
      firstName,
      lastName,
      email,
      company,
      role: role || "Not specified",
      companySize: companySize || "Not specified",
      message,
      timestamp: new Date().toISOString(),
      captchaVerified: true,
    }

    console.log("Processing contact form submission:", {
      name: `${firstName} ${lastName}`,
      email,
      company,
      captchaVerified: true,
    })

    // Try to send email using AWS SDK
    try {
      const emailResult = await sendEmailWithSES({
        to: ["enquiries@kuhlekt.com"],
        subject: `New Contact Submission from ${firstName} ${lastName}`,
        body: `
New Contact Form Submission from Kuhlekt Website

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${company}
- Role: ${role || "Not specified"}
- Company Size: ${companySize || "Not specified"}

Message:
${message}

Security:
- CAPTCHA Verified: Yes
- Timestamp: ${contactData.timestamp}

Please follow up with this inquiry.
        `,
        replyTo: email,
      })

      if (emailResult.success) {
        console.log("Contact form email sent successfully via AWS SDK:", emailResult.messageId)
      } else {
        console.log("Email sending failed, logging contact data:", contactData)
        console.error("Email error:", emailResult.message)
      }
    } catch (emailError) {
      console.error("Error with AWS SDK email service:", emailError)
      console.log("Logging contact data for manual follow-up:", contactData)
    }

    // Always return success to user
    return {
      success: true,
      message: "Thank you for your message! We've received your inquiry and will get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message:
        "Sorry, there was an error sending your message. Please try again or contact us directly at enquiries@kuhlekt.com",
    }
  }
}

// Server action to test AWS SES SDK configuration
export async function testAWSSES() {
  const { testAWSSESConnection } = await import("@/lib/aws-ses")
  return testAWSSESConnection()
}
