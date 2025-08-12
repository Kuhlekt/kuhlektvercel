"use server"

import { sendEmail } from "@/lib/email-service"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

interface DemoFormState {
  success: boolean
  message: string
  errors: Record<string, string>
}

export async function submitDemoRequest(prevState: DemoFormState, formData: FormData): Promise<DemoFormState> {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const jobTitle = formData.get("jobTitle") as string
    const companySize = formData.get("companySize") as string
    const currentARVolume = formData.get("currentARVolume") as string
    const currentChallenges = formData.get("currentChallenges") as string
    const affiliateCode = formData.get("affiliateCode") as string
    const recaptchaToken = formData.get("recaptchaToken") as string

    // Validation
    const errors: Record<string, string> = {}

    if (!firstName?.trim()) errors.firstName = "First name is required"
    if (!lastName?.trim()) errors.lastName = "Last name is required"
    if (!email?.trim()) errors.email = "Email is required"
    if (!company?.trim()) errors.company = "Company name is required"
    if (!phone?.trim()) errors.phone = "Phone number is required"
    if (!jobTitle?.trim()) errors.jobTitle = "Job title is required"
    if (!companySize) errors.companySize = "Company size is required"
    if (!currentARVolume) errors.currentARVolume = "AR volume is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    // Phone validation
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
    const emailSubject = `New Demo Request: ${company} - ${firstName} ${lastName}`
    const emailBody = `
New demo request from Kuhlekt website:

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${company}
- Phone: ${phone}
- Job Title: ${jobTitle}

Company Details:
- Company Size: ${companySize}
- Monthly AR Volume: ${currentARVolume}

Current Challenges:
${currentChallenges || "Not specified"}

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

Next Steps:
1. Schedule demo within 24 hours
2. Prepare custom presentation based on company size and AR volume
3. Include ROI calculator for their specific situation
    `.trim()

    // Send email to sales team
    const emailResult = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "sales@kuhlekt.com",
      subject: emailSubject,
      body: emailBody,
      replyTo: email,
    })

    if (!emailResult.success) {
      console.error("Failed to send demo request email:", emailResult.error)
      return {
        success: false,
        message: "Failed to submit demo request. Please try again or contact us directly.",
        errors: {},
      }
    }

    // Send confirmation email to user
    const confirmationSubject = "Your Kuhlekt Demo Request - Next Steps"
    const confirmationBody = `
Dear ${firstName},

Thank you for requesting a demo of Kuhlekt's AR automation platform! We're excited to show you how we can help ${company} streamline your accounts receivable process.

What happens next:
1. Our sales team will contact you within 24 hours to schedule your personalized demo
2. We'll prepare a custom presentation based on your company size (${companySize}) and AR volume (${currentARVolume})
3. During the demo, we'll show you specific ROI calculations for your business

${
  affiliateInfo
    ? `
We've noted your affiliate code (${affiliateCode}) and will apply the ${affiliateInfo.discount}% discount to any applicable services during our discussion.
`
    : ""
}

If you have any immediate questions, feel free to reply to this email or call us at 1-800-KUHLEKT.

Best regards,
The Kuhlekt Sales Team

P.S. In the meantime, feel free to explore our case studies at kuhlekt.com/case-studies to see how we've helped similar companies.

---
Kuhlekt - Transforming Accounts Receivable Through AI
    `.trim()

    await sendEmail({
      to: email,
      subject: confirmationSubject,
      body: confirmationBody,
    })

    return {
      success: true,
      message: `Thank you ${firstName}! Your demo request has been submitted successfully. Our sales team will contact you within 24 hours to schedule your personalized demonstration.`,
      errors: {},
    }
  } catch (error) {
    console.error("Demo request submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      errors: {},
    }
  }
}
