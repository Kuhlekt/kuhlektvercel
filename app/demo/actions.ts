"use server"

import { z } from "zod"
import { sendEmail } from "@/lib/email-service"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

const demoRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(1, "Company name is required"),
  role: z.string().optional(),
  affiliateCode: z.string().optional(),
  challenges: z.string().optional(),
  recaptchaToken: z.string().min(1, "Please complete the reCAPTCHA verification"),
})

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification")
    return true
  }

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

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    const rawData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      company: formData.get("company"),
      role: formData.get("role"),
      affiliateCode: formData.get("affiliateCode"),
      challenges: formData.get("challenges"),
      recaptchaToken: formData.get("recaptchaToken"),
    }

    const validatedData = demoRequestSchema.parse(rawData)

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(validatedData.recaptchaToken)
    if (!isRecaptchaValid) {
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
        errors: { recaptchaToken: "reCAPTCHA verification failed" },
      }
    }

    // Validate affiliate code if provided
    let affiliateInfo = null
    if (validatedData.affiliateCode) {
      affiliateInfo = validateAffiliateCode(validatedData.affiliateCode)
      if (!affiliateInfo) {
        return {
          success: false,
          message: "Invalid affiliate code provided.",
          errors: { affiliateCode: "Invalid affiliate code" },
        }
      }
    }

    // Prepare email content
    const emailSubject = `Demo Request from ${validatedData.firstName} ${validatedData.lastName} - ${validatedData.company}`

    const emailBody = `
New Demo Request Received

Contact Information:
- Name: ${validatedData.firstName} ${validatedData.lastName}
- Email: ${validatedData.email}
- Company: ${validatedData.company}
- Role: ${validatedData.role || "Not specified"}

${validatedData.challenges ? `AR Challenges:\n${validatedData.challenges}\n\n` : ""}

${affiliateInfo ? `Affiliate Information:\n- Code: ${validatedData.affiliateCode}\n- Partner: ${affiliateInfo.name}\n- Category: ${affiliateInfo.category}\n- Discount: ${affiliateInfo.discount}%\n\n` : ""}

Please contact this prospect within 24 hours to schedule their demo.

Submitted at: ${new Date().toLocaleString()}
    `

    // Send notification email
    await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "demo@kuhlekt.com",
      subject: emailSubject,
      text: emailBody,
      html: emailBody.replace(/\n/g, "<br>"),
    })

    // Send confirmation email to prospect
    const confirmationSubject = "Demo Request Received - Kuhlekt"
    const confirmationBody = `
Dear ${validatedData.firstName},

Thank you for your interest in Kuhlekt!

We have received your demo request and our team will contact you within 24 hours to schedule your personalized demonstration.

During your demo, we'll show you how Kuhlekt can:
• Automate your collections process
• Reduce DSO by 30%
• Eliminate 80% of manual tasks
• Provide real-time insights into your receivables

We look forward to showing you how Kuhlekt can transform your accounts receivable process.

Best regards,
The Kuhlekt Team

---
This is an automated message. Please do not reply to this email.
    `

    await sendEmail({
      to: validatedData.email,
      subject: confirmationSubject,
      text: confirmationBody,
      html: confirmationBody.replace(/\n/g, "<br>"),
    })

    return {
      success: true,
      message:
        "Thank you! Your demo request has been submitted successfully. We'll contact you within 24 hours to schedule your personalized demonstration.",
      errors: {},
    }
  } catch (error) {
    console.error("Demo request submission error:", error)

    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path) {
          fieldErrors[err.path[0]] = err.message
        }
      })

      return {
        success: false,
        message: "Please correct the errors below and try again.",
        errors: fieldErrors,
      }
    }

    return {
      success: false,
      message: "An error occurred while submitting your request. Please try again.",
      errors: {},
    }
  }
}
