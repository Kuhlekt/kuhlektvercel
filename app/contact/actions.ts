"use server"

import { sendEmailWithSES, testAWSSESConnection } from "@/lib/aws-ses"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"
import { getVisitorData } from "@/components/visitor-tracker"

interface ContactFormData {
  name: string
  email: string
  company: string
  message: string
  recaptchaToken: string
}

export async function submitContactForm(formData: FormData) {
  try {
    // Extract form data
    const data: ContactFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
      recaptchaToken: formData.get("recaptchaToken") as string,
    }

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
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
    const subject = `New Contact Form Submission from ${data.name}`

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
        </div>

        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
        </div>

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
          <p>This email was sent from the Kuhlekt contact form at ${new Date().toLocaleString()}.</p>
        </div>
      </div>
    `

    const textContent = `
New Contact Form Submission

Contact Information:
Name: ${data.name}
Email: ${data.email}
Company: ${data.company || "Not provided"}

Message:
${data.message}

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
        message: "Thank you for your message! We'll get back to you soon.",
      }
    } else {
      // Log the submission even if email fails
      console.log("Contact form submission (email failed):", {
        name: data.name,
        email: data.email,
        company: data.company,
        message: data.message.substring(0, 100) + "...",
        timestamp: new Date().toISOString(),
        error: emailResult.message,
      })

      return {
        success: true,
        message: "Thank you for your message! We've received your submission and will get back to you soon.",
      }
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "An error occurred while submitting your message. Please try again.",
    }
  }
}

export async function testAWSSES() {
  try {
    const result = await testAWSSESConnection()
    return result
  } catch (error) {
    console.error("AWS SES test error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      details: {
        region: false,
        accessKey: false,
        secretKey: false,
        fromEmail: false,
      },
    }
  }
}
