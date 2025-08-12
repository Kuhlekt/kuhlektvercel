"use server"

import { sendEmail } from "@/lib/email-service"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

interface DemoFormData {
  firstName: string
  lastName: string
  email: string
  company: string
  role?: string
  affiliateCode?: string
  challenges?: string
  captchaToken: string
}

interface ActionResult {
  success: boolean
  message: string
  errors?: Record<string, string>
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  // If no secret key is configured, allow the request (development mode)
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification")
    return true
  }

  // If it's the development token, allow it
  if (token === "development-mode") {
    return true
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return false
  }
}

export async function submitDemoRequest(formData: FormData): Promise<ActionResult> {
  try {
    // Extract form data
    const data: DemoFormData = {
      firstName: (formData.get("firstName") as string)?.trim() || "",
      lastName: (formData.get("lastName") as string)?.trim() || "",
      email: (formData.get("email") as string)?.trim() || "",
      company: (formData.get("company") as string)?.trim() || "",
      role: (formData.get("role") as string)?.trim() || "",
      affiliateCode: (formData.get("affiliateCode") as string)?.trim() || "",
      challenges: (formData.get("challenges") as string)?.trim() || "",
      captchaToken: (formData.get("captchaToken") as string)?.trim() || "",
    }

    // Validate required fields
    const errors: Record<string, string> = {}

    if (!data.firstName) {
      errors.firstName = "First name is required"
    } else if (data.firstName.length > 50) {
      errors.firstName = "First name is too long"
    }

    if (!data.lastName) {
      errors.lastName = "Last name is required"
    } else if (data.lastName.length > 50) {
      errors.lastName = "Last name is too long"
    }

    if (!data.email) {
      errors.email = "Email is required"
    } else if (!validateEmail(data.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!data.company) {
      errors.company = "Company name is required"
    } else if (data.company.length > 100) {
      errors.company = "Company name is too long"
    }

    if (!data.captchaToken) {
      errors.captcha = "Please complete the reCAPTCHA verification"
    }

    // Validate affiliate code if provided
    let affiliateInfo = null
    if (data.affiliateCode) {
      affiliateInfo = validateAffiliateCode(data.affiliateCode)
      if (!affiliateInfo) {
        errors.affiliateCode = "Invalid affiliate code"
      }
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below.",
        errors,
      }
    }

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(data.captchaToken)
    if (!isRecaptchaValid) {
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
        errors: {},
      }
    }

    // Prepare email content for sales team
    const emailSubject = `New Demo Request: ${data.company} - ${data.firstName} ${data.lastName}`
    const emailBody = `
New demo request received:

CONTACT INFORMATION:
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Company: ${data.company}
Role: ${data.role || "Not specified"}

${affiliateInfo ? `AFFILIATE PARTNER: ${affiliateInfo.name} (${data.affiliateCode}) - ${affiliateInfo.discount}% discount` : ""}

AR CHALLENGES:
${data.challenges || "Not specified"}

---
Submitted at: ${new Date().toISOString()}
    `.trim()

    // Send email notification to sales team
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "sales@kuhlekt.com",
      subject: emailSubject,
      body: emailBody,
      replyTo: data.email,
    })

    if (!emailResult.success) {
      console.error("Failed to send demo request email:", emailResult.error)
      // Don't fail the form submission if email fails - log it but continue
    }

    // Send confirmation email to prospect
    const confirmationSubject = "Your Kuhlekt Demo Request - We'll Contact You Soon!"
    const confirmationBody = `
Dear ${data.firstName},

Thank you for requesting a demo of Kuhlekt's AR automation platform! 

We've received your request and our sales team will contact you within 24 hours to schedule your personalized demo.

Your Demo Request Details:
• Company: ${data.company}
• Role: ${data.role || "Not specified"}
${affiliateInfo ? `• Partner: ${affiliateInfo.name}` : ""}

What happens next?
1. Our sales representative will contact you within 24 hours
2. We'll schedule a 30-minute demo at your convenience
3. You'll see how Kuhlekt can transform your AR process
4. We'll provide a custom ROI analysis for your business

Questions? Reply to this email or call us at +1 (555) 123-4567.

Best regards,
The Kuhlekt Sales Team

P.S. In the meantime, feel free to explore our case studies at kuhlekt.com/case-studies
    `.trim()

    await sendEmail({
      to: data.email,
      subject: confirmationSubject,
      body: confirmationBody,
    })

    return {
      success: true,
      message:
        "Demo request submitted successfully! Our sales team will contact you within 24 hours to schedule your personalized demo.",
      errors: {},
    }
  } catch (error) {
    console.error("Demo request submission error:", error)

    return {
      success: false,
      message: "An error occurred while submitting your demo request. Please try again.",
      errors: {},
    }
  }
}
