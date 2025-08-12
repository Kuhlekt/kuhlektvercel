"use server"

import { sendEmail } from "@/lib/email-service"
import { validateAffiliateCode } from "@/lib/affiliate-validation"
import { testAWSSES } from "@/lib/aws-ses"

interface ContactFormState {
  success: boolean
  message: string
  errors: Record<string, string>
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string
    const affiliateCode = formData.get("affiliateCode") as string
    const recaptchaToken = formData.get("recaptchaToken") as string

    // Validation
    const errors: Record<string, string> = {}

    if (!firstName?.trim()) errors.firstName = "First name is required"
    if (!lastName?.trim()) errors.lastName = "Last name is required"
    if (!email?.trim()) errors.email = "Email is required"
    if (!company?.trim()) errors.company = "Company name is required"
    if (!subject?.trim()) errors.subject = "Subject is required"
    if (!message?.trim()) errors.message = "Message is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    // Phone validation (if provided)
    if (phone && phone.trim()) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))) {
        errors.phone = "Please enter a valid phone number"
      }
    }

    // ReCAPTCHA validation
    if (!recaptchaToken) {
      errors.recaptcha = "Please complete the reCAPTCHA verification"
    } else {
      // Verify reCAPTCHA token
      const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      })

      const recaptchaResult = await recaptchaResponse.json()
      if (!recaptchaResult.success) {
        errors.recaptcha = "reCAPTCHA verification failed. Please try again."
      }
    }

    // Affiliate code validation (if provided)
    let affiliateInfo = null
    if (affiliateCode?.trim()) {
      affiliateInfo = validateAffiliateCode(affiliateCode.trim())
      if (!affiliateInfo) {
        errors.affiliateCode = "Invalid affiliate code"
      }
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Prepare email content
    const emailSubject = `New Contact Form Submission: ${subject}`
    const emailBody = `
New contact form submission from Kuhlekt website:

Name: ${firstName} ${lastName}
Email: ${email}
Company: ${company}
Phone: ${phone || "Not provided"}
Subject: ${subject}

Message:
${message}

${
  affiliateInfo
    ? `
Affiliate Information:
- Code: ${affiliateCode}
- Partner: ${affiliateInfo.name}
- Category: ${affiliateInfo.category}
- Discount: ${affiliateInfo.discount}%
`
    : ""
}

Submitted at: ${new Date().toISOString()}
    `.trim()

    // Send email
    const emailResult = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "contact@kuhlekt.com",
      subject: emailSubject,
      body: emailBody,
      replyTo: email,
    })

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error)
      return {
        success: false,
        message: "Failed to send message. Please try again or contact us directly.",
        errors: {},
      }
    }

    // Send confirmation email to user
    const confirmationSubject = "Thank you for contacting Kuhlekt"
    const confirmationBody = `
Dear ${firstName},

Thank you for reaching out to Kuhlekt! We have received your message and will get back to you within 24 hours.

Your message:
Subject: ${subject}
${message}

${
  affiliateInfo
    ? `
We've noted your affiliate code (${affiliateCode}) and will apply the ${affiliateInfo.discount}% discount to any applicable services.
`
    : ""
}

Best regards,
The Kuhlekt Team

---
This is an automated confirmation email. Please do not reply to this message.
    `.trim()

    await sendEmail({
      to: email,
      subject: confirmationSubject,
      body: confirmationBody,
    })

    return {
      success: true,
      message: `Thank you ${firstName}! Your message has been sent successfully. We'll get back to you within 24 hours.`,
      errors: {},
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      errors: {},
    }
  }
}

export { testAWSSES }
