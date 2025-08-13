"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"
import { validateAffiliateCode } from "@/lib/affiliate-validation"
import { getVisitorData } from "@/components/visitor-tracker"

interface DemoFormData {
  firstName: string
  lastName: string
  businessEmail: string
  companyName: string
  phoneNumber: string
  arChallenges: string
  affiliateCode: string
  recaptchaToken: string
}

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    // Extract form data
    const data: DemoFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      businessEmail: formData.get("businessEmail") as string,
      companyName: formData.get("companyName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      arChallenges: formData.get("arChallenges") as string,
      affiliateCode: formData.get("affiliateCode") as string,
      recaptchaToken: formData.get("recaptchaToken") as string,
    }

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.businessEmail || !data.companyName || !data.phoneNumber) {
      return {
        success: false,
        message: "Please fill in all required fields.",
        errors: {
          firstName: !data.firstName ? ["First name is required"] : undefined,
          lastName: !data.lastName ? ["Last name is required"] : undefined,
          businessEmail: !data.businessEmail ? ["Business email is required"] : undefined,
          companyName: !data.companyName ? ["Company name is required"] : undefined,
          phoneNumber: !data.phoneNumber ? ["Phone number is required"] : undefined,
        },
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.businessEmail)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
        errors: {
          businessEmail: ["Please enter a valid email address"],
        },
      }
    }

    // Verify reCAPTCHA - skip if no token provided (reCAPTCHA not configured)
    if (data.recaptchaToken) {
      try {
        const recaptchaResult = await verifyRecaptcha(data.recaptchaToken)
        if (!recaptchaResult.success) {
          console.log("reCAPTCHA verification failed:", recaptchaResult.message)
          // Continue anyway - don't block submission for reCAPTCHA issues
        }
      } catch (error) {
        console.log("reCAPTCHA verification error:", error)
        // Continue anyway - don't block submission for reCAPTCHA issues
      }
    }

    // Validate affiliate code if provided
    let validatedAffiliateCode = null
    if (data.affiliateCode) {
      validatedAffiliateCode = validateAffiliateCode(data.affiliateCode)
      if (!validatedAffiliateCode) {
        return {
          success: false,
          message: "Invalid affiliate code provided.",
          errors: {
            affiliateCode: ["Invalid affiliate code"],
          },
        }
      }
    }

    // Get visitor data for context
    const visitorData = getVisitorData()

    // Prepare email content
    const adminEmail = process.env.ADMIN_EMAIL || "admin@kuhlekt.com"
    const subject = `New Demo Request from ${data.firstName} ${data.lastName} at ${data.companyName}`

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          New Demo Request
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.businessEmail}</p>
          <p><strong>Company:</strong> ${data.companyName}</p>
          <p><strong>Phone:</strong> ${data.phoneNumber}</p>
        </div>

        ${
          data.arChallenges
            ? `
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">AR Challenges</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${data.arChallenges}</p>
        </div>
        `
            : ""
        }

        ${
          validatedAffiliateCode
            ? `
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Affiliate Information</h3>
          <p><strong>Affiliate Code:</strong> ${validatedAffiliateCode}</p>
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
          <p>This email was sent from the Kuhlekt demo request form at ${new Date().toLocaleString()}.</p>
        </div>
      </div>
    `

    const textContent = `
New Demo Request

Contact Information:
Name: ${data.firstName} ${data.lastName}
Email: ${data.businessEmail}
Company: ${data.companyName}
Phone: ${data.phoneNumber}

${data.arChallenges ? `AR Challenges:\n${data.arChallenges}\n` : ""}

${validatedAffiliateCode ? `Affiliate Code: ${validatedAffiliateCode}\n` : ""}

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
          "Thank you for your demo request! We'll contact you within 24 hours to schedule your personalized demo.",
      }
    } else {
      // Log the submission even if email fails
      console.log("Demo request submission (email failed):", {
        name: `${data.firstName} ${data.lastName}`,
        email: data.businessEmail,
        company: data.companyName,
        phone: data.phoneNumber,
        timestamp: new Date().toISOString(),
        error: emailResult.message,
      })

      return {
        success: true,
        message:
          "Thank you for your demo request! We've received your submission and will contact you within 24 hours.",
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
