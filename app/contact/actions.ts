"use server"

import { z } from "zod"
import { sendEmail } from "@/lib/email-service"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required").max(100, "Company name too long"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required").max(200, "Subject too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message too long"),
  affiliateCode: z.string().optional(),
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

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const rawData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      company: formData.get("company"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      affiliateCode: formData.get("affiliateCode"),
      recaptchaToken: formData.get("recaptchaToken"),
    }

    const validatedData = contactSchema.parse(rawData)

    const isRecaptchaValid = await verifyRecaptcha(validatedData.recaptchaToken)
    if (!isRecaptchaValid) {
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
        errors: {},
      }
    }

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

    const emailSubject = `New Contact Form Submission: ${validatedData.subject}`
    const emailBody = `
      New contact form submission received:

      Name: ${validatedData.firstName} ${validatedData.lastName}
      Email: ${validatedData.email}
      Company: ${validatedData.company}
      Phone: ${validatedData.phone || "Not provided"}
      Subject: ${validatedData.subject}
      
      ${affiliateInfo ? `Affiliate Partner: ${affiliateInfo.name} (${validatedData.affiliateCode})` : ""}

      Message:
      ${validatedData.message}

      ---
      Submitted at: ${new Date().toISOString()}
    `

    await sendEmail({
      to: "contact@kuhlekt.com",
      subject: emailSubject,
      text: emailBody,
      html: emailBody.replace(/\n/g, "<br>"),
    })

    const confirmationSubject = "Thank you for contacting Kuhlekt"
    const confirmationBody = `
      Dear ${validatedData.firstName},

      Thank you for reaching out to Kuhlekt! We have received your message and will get back to you within 24 hours.

      Your inquiry details:
      Subject: ${validatedData.subject}
      Company: ${validatedData.company}
      ${affiliateInfo ? `Partner: ${affiliateInfo.name}` : ""}

      Best regards,
      The Kuhlekt Team
    `

    await sendEmail({
      to: validatedData.email,
      subject: confirmationSubject,
      text: confirmationBody,
      html: confirmationBody.replace(/\n/g, "<br>"),
    })

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      errors: {},
    }
  } catch (error) {
    console.error("Contact form submission error:", error)

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
      message: "An error occurred while sending your message. Please try again.",
      errors: {},
    }
  }
}

export async function testAWSSES() {
  try {
    await sendEmail({
      to: "test@example.com",
      subject: "AWS SES Test Email",
      text: "This is a test email from Kuhlekt contact form.",
      html: "<p>This is a test email from Kuhlekt contact form.</p>",
    })

    return {
      success: true,
      message: "Test email sent successfully!",
    }
  } catch (error) {
    console.error("AWS SES test error:", error)
    return {
      success: false,
      message: "Failed to send test email. Please check your AWS SES configuration.",
    }
  }
}
