"use server"

import { z } from "zod"
import { sendEmail } from "@/lib/email-service"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

const demoSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required").max(100, "Company name too long"),
  role: z.string().optional(),
  affiliateCode: z.string().optional(),
  challenges: z.string().optional(),
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
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      company: formData.get("company"),
      role: formData.get("role"),
      affiliateCode: formData.get("affiliateCode"),
      challenges: formData.get("challenges"),
      recaptchaToken: formData.get("recaptchaToken"),
    }

    const validatedData = demoSchema.parse(rawData)

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(validatedData.recaptchaToken)
    if (!isRecaptchaValid) {
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
          message: "Invalid affiliate code provided.",
          errors: { affiliateCode: "Invalid affiliate code" },
        }
      }
    }

    // Prepare email content for sales team
    const emailSubject = `New Demo Request: ${validatedData.company} - ${validatedData.firstName} ${validatedData.lastName}`
    const emailBody = `
      New demo request received:

      CONTACT INFORMATION:
      Name: ${validatedData.firstName} ${validatedData.lastName}
      Email: ${validatedData.email}
      Company: ${validatedData.company}
      Role: ${validatedData.role || "Not specified"}

      ${affiliateInfo ? `AFFILIATE PARTNER: ${affiliateInfo.name} (${validatedData.affiliateCode}) - ${affiliateInfo.discount}% discount` : ""}

      AR CHALLENGES:
      ${validatedData.challenges || "Not specified"}

      ---
      Submitted at: ${new Date().toISOString()}
    `

    // Send email notification to sales team
    await sendEmail({
      to: "sales@kuhlekt.com",
      subject: emailSubject,
      text: emailBody,
      html: emailBody.replace(/\n/g, "<br>"),
    })

    // Send confirmation email to prospect
    const confirmationSubject = "Your Kuhlekt Demo Request - We'll Contact You Soon!"
    const confirmationBody = `
      Dear ${validatedData.firstName},

      Thank you for requesting a demo of Kuhlekt's AR automation platform! 

      We've received your request and our sales team will contact you within 24 hours to schedule your personalized demo.

      Your Demo Request Details:
      • Company: ${validatedData.company}
      • Role: ${validatedData.role || "Not specified"}
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
        "Demo request submitted successfully! Our sales team will contact you within 24 hours to schedule your personalized demo.",
      errors: {},
    }
  } catch (error) {
    console.error("Demo request submission error:", error)

    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message
        }
      })

      return {
        success: false,
        message: "Please correct the errors below.",
        errors,
      }
    }

    return {
      success: false,
      message: "An error occurred while submitting your demo request. Please try again.",
      errors: {},
    }
  }
}
