"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { validateAffiliateCode } from "@/lib/affiliate-validation"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"

interface DemoRequestResult {
  success: boolean
  message: string
}

export async function submitDemoRequest(formData: FormData): Promise<DemoRequestResult> {
  try {
    // Extract form data
    const firstName = formData.get("firstName")?.toString() || ""
    const lastName = formData.get("lastName")?.toString() || ""
    const email = formData.get("email")?.toString() || ""
    const company = formData.get("company")?.toString() || ""
    const phone = formData.get("phone")?.toString() || ""
    const jobTitle = formData.get("jobTitle")?.toString() || ""
    const companySize = formData.get("companySize")?.toString() || ""
    const challenges = formData.get("challenges")?.toString() || ""
    const affiliate = formData.get("affiliate")?.toString() || ""
    const recaptchaToken = formData.get("recaptchaToken")?.toString() || ""

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !phone || !jobTitle || !companySize) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      return {
        success: false,
        message: "Please complete the reCAPTCHA verification.",
      }
    }

    const recaptchaValid = await verifyRecaptcha(recaptchaToken)
    if (!recaptchaValid) {
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
      }
    }

    // Validate affiliate code if provided
    let affiliateInfo = ""
    if (affiliate) {
      const affiliateValidation = validateAffiliateCode(affiliate)
      if (affiliateValidation.isValid) {
        affiliateInfo = `\n\n**Affiliate Information:**\nCode: ${affiliate}\nPartner: ${affiliateValidation.partner}\nCommission: ${affiliateValidation.commission}%`
      } else {
        affiliateInfo = `\n\n**Affiliate Code:** ${affiliate} (Invalid - please verify)`
      }
    }

    // Prepare email content
    const emailSubject = `Demo Request from ${firstName} ${lastName} at ${company}`
    const emailBody = `
**New Demo Request**

**Contact Information:**
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${company}
- Phone: ${phone}
- Job Title: ${jobTitle}
- Company Size: ${companySize}

${challenges ? `**AR Challenges:**\n${challenges}\n` : ""}
${affiliateInfo}

**Request Details:**
- Submitted: ${new Date().toLocaleString()}
- IP: ${process.env.NODE_ENV === "development" ? "localhost" : "production"}

Please follow up with this demo request within 24 hours.
    `.trim()

    // Send email using AWS SES
    const emailResult = await sendEmailWithSES({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      body: emailBody,
    })

    if (!emailResult.success) {
      console.error("Failed to send demo request email:", emailResult.error)
      return {
        success: false,
        message: "Failed to submit demo request. Please try again or contact us directly.",
      }
    }

    return {
      success: true,
      message:
        "Demo request submitted successfully! We'll contact you within 24 hours to schedule your personalized demonstration.",
    }
  } catch (error) {
    console.error("Error submitting demo request:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again or contact us directly.",
    }
  }
}
