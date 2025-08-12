"use server"

import { z } from "zod"
import { sendEmail } from "@/lib/email-service"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

const demoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  companySize: z.string().min(1, "Please select company size"),
  currentChallenges: z.string().optional(),
  affiliateCode: z.string().optional(),
  recaptchaToken: z.string().min(1, "Please complete the reCAPTCHA verification"),
})

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

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    const rawData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      jobTitle: formData.get("jobTitle") as string,
      companySize: formData.get("companySize") as string,
      currentChallenges: formData.get("currentChallenges") as string,
      affiliateCode: formData.get("affiliateCode") as string,
      recaptchaToken: formData.get("recaptchaToken") as string,
    }

    const validatedData = demoSchema.parse(rawData)

    // Verify reCAPTCHA
    const captchaValid = await verifyRecaptcha(validatedData.recaptchaToken)
    if (!captchaValid) {
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
        errors: {},
      }
    }

    // Validate affiliate code if provided
    let affiliateInfo = null
    if (validatedData.affiliateCode) {
      affiliateInfo = validateAffiliateCode(validatedData.affiliateCode)
      if (!affiliateInfo) {
        return {
          success: false,
          message: "Invalid affiliate code. Please check and try again.",
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
- Phone: ${validatedData.phone}
- Company: ${validatedData.company}
- Job Title: ${validatedData.jobTitle}
- Company Size: ${validatedData.companySize}

${validatedData.currentChallenges ? `Current AR Challenges:\n${validatedData.currentChallenges}\n\n` : ""}

${affiliateInfo ? `Affiliate Information:\n- Code: ${validatedData.affiliateCode}\n- Partner: ${affiliateInfo.name}\n- Category: ${affiliateInfo.category}\n- Discount: ${affiliateInfo.discount}%\n\n` : ""}

Please contact this prospect within 2 business hours to schedule their demo.

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
    const confirmationSubject = "Demo Request Received - Kuhlekt AR Automation"
    const confirmationBody = `
Dear ${validatedData.firstName},

Thank you for your interest in Kuhlekt's AR automation platform!

We've received your demo request and our team will contact you within 2 business hours to schedule your personalized demonstration.

What to expect in your demo:
• Comprehensive overview of our AR automation features
• Live demonstration tailored to your business needs
• Q&A session with our AR experts
• Custom ROI analysis for your company

If you have any immediate questions, please don't hesitate to reach out to us.

Best regards,
The Kuhlekt Team

---
This is an automated confirmation email. Please do not reply to this message.
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
        "Thank you! Your demo request has been submitted successfully. We'll contact you within 2 business hours to schedule your personalized demo.",
      errors: {},
    }
  } catch (error) {
    console.error("Demo request submission error:", error)

    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
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
