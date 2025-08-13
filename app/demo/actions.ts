"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"

export async function submitDemoRequest(formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName")?.toString() || ""
    const lastName = formData.get("lastName")?.toString() || ""
    const email = formData.get("email")?.toString() || ""
    const company = formData.get("company")?.toString() || ""
    const phone = formData.get("phone")?.toString() || ""
    const challenges = formData.get("challenges")?.toString() || ""
    const affiliate = formData.get("affiliate")?.toString() || ""
    const recaptchaToken = formData.get("recaptchaToken")?.toString() || ""

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !phone) {
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

    // Get admin email from environment
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      console.error("ADMIN_EMAIL environment variable not set")
      return {
        success: false,
        message: "Server configuration error. Please contact support.",
      }
    }

    // Prepare email content
    const subject = `New Demo Request from ${firstName} ${lastName} - ${company}`

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          New Demo Request
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Phone:</strong> ${phone}</p>
        </div>

        ${
          challenges
            ? `
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">AR Challenges</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${challenges}</p>
        </div>
        `
            : ""
        }

        ${
          affiliate
            ? `
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Affiliate/Referral</h3>
          <p><strong>Code:</strong> ${affiliate}</p>
        </div>
        `
            : ""
        }

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>This demo request was submitted from the Kuhlekt website at ${new Date().toLocaleString()}.</p>
        </div>
      </div>
    `

    const textContent = `
New Demo Request

Contact Information:
Name: ${firstName} ${lastName}
Email: ${email}
Company: ${company}
Phone: ${phone}

${challenges ? `AR Challenges:\n${challenges}\n` : ""}

${affiliate ? `Affiliate/Referral Code: ${affiliate}\n` : ""}

Submitted at: ${new Date().toLocaleString()}
    `

    // Send email using AWS SES
    const emailResult = await sendEmailWithSES({
      to: adminEmail,
      subject: subject,
      text: textContent,
      html: htmlContent,
    })

    if (emailResult.success) {
      console.log("Demo request submitted successfully:", {
        name: `${firstName} ${lastName}`,
        email,
        company,
        affiliate: affiliate || "none",
      })

      return {
        success: true,
        message:
          "Demo request submitted successfully! We'll contact you within 24 hours to schedule your personalized demo.",
      }
    } else {
      // Log the submission even if email fails
      console.log("Demo request submission (email failed):", {
        name: `${firstName} ${lastName}`,
        email,
        company,
        timestamp: new Date().toISOString(),
        error: emailResult.message,
      })

      return {
        success: true,
        message: "Demo request received! We'll contact you within 24 hours to schedule your demo.",
      }
    }
  } catch (error) {
    console.error("Error submitting demo request:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again or contact us directly.",
    }
  }
}
