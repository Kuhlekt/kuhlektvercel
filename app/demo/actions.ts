"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"
import { getVisitorData } from "@/components/visitor-tracker"

interface DemoRequestData {
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle: string
  phone: string
  companySize: string
  currentSolution: string
  challenges: string
  timeline: string
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
      jobTitle: formData.get("jobTitle") as string,
      phone: formData.get("phone") as string,
      companySize: formData.get("companySize") as string,
      currentSolution: formData.get("currentSolution") as string,
      challenges: formData.get("challenges") as string,
      timeline: formData.get("timeline") as string,
      recaptchaToken: formData.get("recaptchaToken") as string,
    }

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.company) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      }
    }

    // Verify reCAPTCHA
    if (data.recaptchaToken) {
      const recaptchaResult = await verifyRecaptcha(data.recaptchaToken)
      if (!recaptchaResult.success) {
        return {
          success: false,
          message: "reCAPTCHA verification failed. Please try again.",
        }
      }
    }

    // Get visitor data for context
    const visitorData = getVisitorData()

    // Prepare email content
    const adminEmail = process.env.ADMIN_EMAIL || "admin@kuhlekt.com"
    const subject = `New Demo Request from ${data.firstName} ${data.lastName} at ${data.company}`

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          New Demo Request
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
          <p><strong>Company:</strong> ${data.company}</p>
          <p><strong>Job Title:</strong> ${data.jobTitle || "Not provided"}</p>
        </div>

        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Company Details</h3>
          <p><strong>Company Size:</strong> ${data.companySize || "Not specified"}</p>
          <p><strong>Current Solution:</strong> ${data.currentSolution || "Not specified"}</p>
          <p><strong>Timeline:</strong> ${data.timeline || "Not specified"}</p>
        </div>

        ${
          data.challenges
            ? `
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Challenges</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${data.challenges}</p>
        </div>
        `
            : ""
        }

        ${
          visitorData
            ? `
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Visitor Information</h3>
          <p><strong>Visitor ID:</strong> ${visitorData.visitorId}</p>
          <p><strong>Session ID:</strong> ${visitorData.sessionId}</p>
          <p><strong>Page Views:</strong> ${visitorData.pageViews}</p>
          <p><strong>Current Page:</strong> ${visitorData.currentPage}</p>
          ${visitorData.utmSource ? `<p><strong>UTM Source:</strong> ${visitorData.utmSource}</p>` : ""}
          ${visitorData.affiliate ? `<p><strong>Affiliate:</strong> ${visitorData.affiliate}</p>` : ""}
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
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Company: ${data.company}
Job Title: ${data.jobTitle || "Not provided"}

Company Details:
Company Size: ${data.companySize || "Not specified"}
Current Solution: ${data.currentSolution || "Not specified"}
Timeline: ${data.timeline || "Not specified"}

${data.challenges ? `Challenges:\n${data.challenges}\n` : ""}

${
  visitorData
    ? `
Visitor Information:
Visitor ID: ${visitorData.visitorId}
Session ID: ${visitorData.sessionId}
Page Views: ${visitorData.pageViews}
Current Page: ${visitorData.currentPage}
${visitorData.utmSource ? `UTM Source: ${visitorData.utmSource}` : ""}
${visitorData.affiliate ? `Affiliate: ${visitorData.affiliate}` : ""}
`
    : ""
}

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
      return {
        success: true,
        message:
          "Thank you for requesting a demo! We'll contact you within 24 hours to schedule your personalized demonstration.",
      }
    } else {
      // Log the submission even if email fails
      console.log("Demo request submission (email failed):", {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        company: data.company,
        timestamp: new Date().toISOString(),
        error: emailResult.message,
      })

      return {
        success: true,
        message: "Thank you for requesting a demo! We've received your request and will contact you within 24 hours.",
      }
    }
  } catch (error) {
    console.error("Demo request submission error:", error)
    return {
      success: false,
      message: "An error occurred while submitting your demo request. Please try again.",
    }
  }
}
