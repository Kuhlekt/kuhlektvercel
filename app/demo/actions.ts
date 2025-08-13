"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { getVisitorData } from "@/components/visitor-tracker"

export async function submitDemoRequest(formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const role = formData.get("role") as string
    const affiliateCode = formData.get("affiliateCode") as string
    const challenges = formData.get("challenges") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return {
        success: false,
        error: "Please fill in all required fields.",
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Please enter a valid email address.",
      }
    }

    // Get visitor data for context
    const visitorData = getVisitorData()

    // Prepare email content
    const adminEmail = process.env.ADMIN_EMAIL || "admin@kuhlekt.com"
    const subject = `New Demo Request from ${firstName} ${lastName} at ${company}`

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
          <p><strong>Role:</strong> ${role || "Not specified"}</p>
        </div>

        ${
          affiliateCode
            ? `
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Affiliate Information</h3>
          <p><strong>Affiliate Code:</strong> ${affiliateCode}</p>
        </div>
        `
            : ""
        }

        ${
          challenges
            ? `
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Challenges</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${challenges}</p>
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
Name: ${firstName} ${lastName}
Email: ${email}
Company: ${company}
Role: ${role || "Not specified"}

${affiliateCode ? `Affiliate Code: ${affiliateCode}\n` : ""}

${challenges ? `Challenges:\n${challenges}\n` : ""}

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
        name: `${firstName} ${lastName}`,
        email: email,
        company: company,
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
      error: "An error occurred while submitting your demo request. Please try again.",
    }
  }
}
