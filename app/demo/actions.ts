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
  affiliateCode: z.string().optional(),
  message: z.string().optional(),
})

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    // Verify reCAPTCHA
    const recaptchaToken = formData.get("g-recaptcha-response") as string
    if (!recaptchaToken) {
      return {
        success: false,
        error: "Please complete the reCAPTCHA verification",
      }
    }

    const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    })

    const recaptchaResult = await recaptchaResponse.json()
    if (!recaptchaResult.success) {
      return {
        success: false,
        error: "reCAPTCHA verification failed. Please try again.",
      }
    }

    // Validate form data
    const validatedData = demoSchema.parse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      jobTitle: formData.get("jobTitle"),
      affiliateCode: formData.get("affiliateCode"),
      message: formData.get("message"),
    })

    // Validate affiliate code if provided
    let affiliateInfo = null
    if (validatedData.affiliateCode) {
      affiliateInfo = validateAffiliateCode(validatedData.affiliateCode)
      if (!affiliateInfo.isValid) {
        return {
          success: false,
          fieldErrors: {
            affiliateCode: "Invalid affiliate code",
          },
        }
      }
    }

    // Send notification email to admin
    const adminEmailContent = `
      New Demo Request Received
      
      Contact Information:
      - Name: ${validatedData.firstName} ${validatedData.lastName}
      - Email: ${validatedData.email}
      - Phone: ${validatedData.phone}
      - Company: ${validatedData.company}
      - Job Title: ${validatedData.jobTitle}
      
      ${validatedData.affiliateCode ? `Affiliate Code: ${validatedData.affiliateCode} (${affiliateInfo?.name})` : ""}
      
      ${validatedData.message ? `Additional Information:\n${validatedData.message}` : ""}
      
      Please follow up within 24 hours to schedule their demo.
    `

    await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "admin@kuhlekt.com",
      subject: `New Demo Request - ${validatedData.company}`,
      text: adminEmailContent,
    })

    // Send confirmation email to prospect
    const confirmationEmailContent = `
      Hi ${validatedData.firstName},
      
      Thank you for your interest in Kuhlekt! We've received your demo request and will contact you within 24 hours to schedule your personalized demonstration.
      
      During your demo, we'll show you how Kuhlekt can:
      • Reduce your Days Sales Outstanding (DSO) by up to 30%
      • Automate manual AR processes to save 15+ hours per week
      • Increase collection rates by up to 25%
      • Provide real-time insights into your receivables
      
      If you have any immediate questions, please don't hesitate to reach out to us.
      
      Best regards,
      The Kuhlekt Team
      
      ---
      This email was sent because you requested a demo at kuhlekt.com
    `

    await sendEmail({
      to: validatedData.email,
      subject: "Demo Request Confirmed - Kuhlekt",
      text: confirmationEmailContent,
    })

    return {
      success: true,
      message: "Demo request submitted successfully!",
    }
  } catch (error) {
    console.error("Demo request error:", error)

    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      return {
        success: false,
        fieldErrors,
      }
    }

    return {
      success: false,
      error: "An error occurred while submitting your request. Please try again.",
    }
  }
}
