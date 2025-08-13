"use server"

import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/aws-ses"
import { validateAffiliate } from "@/lib/affiliate-validation"
import { verifyCaptcha } from "@/lib/captcha"

interface ContactFormState {
  success: boolean
  message: string
  errors?: {
    [key: string]: string
  }
}

export async function submitContactForm(
  prevState: ContactFormState | null,
  formData: FormData,
): Promise<ContactFormState> {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const companyName = formData.get("companyName") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const inquiryType = formData.get("inquiryType") as string
    const message = formData.get("message") as string
    const affiliateCode = formData.get("affiliateCode") as string
    const captchaToken = formData.get("captchaToken") as string

    // Validate required fields
    const errors: { [key: string]: string } = {}

    if (!firstName?.trim()) errors.firstName = "First name is required"
    if (!lastName?.trim()) errors.lastName = "Last name is required"
    if (!email?.trim()) errors.email = "Email is required"
    if (!companyName?.trim()) errors.companyName = "Company name is required"
    if (!phoneNumber?.trim()) errors.phoneNumber = "Phone number is required"

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please fill in all required fields",
        errors,
      }
    }

    // Verify reCAPTCHA (non-blocking)
    let captchaValid = true
    try {
      if (captchaToken && captchaToken !== "development-mode") {
        captchaValid = await verifyCaptcha(captchaToken)
      }
    } catch (error) {
      console.warn("reCAPTCHA verification failed, but allowing form submission:", error)
      // Don't block the form submission
    }

    // Validate affiliate code if provided
    let affiliateStatus = ""
    if (affiliateCode?.trim()) {
      const isValidAffiliate = validateAffiliate(affiliateCode.trim())
      affiliateStatus = isValidAffiliate
        ? `Valid affiliate code: ${affiliateCode}`
        : `Invalid affiliate code provided: ${affiliateCode}`
    }

    // Prepare email content
    const emailSubject = `New Contact Form Submission from ${firstName} ${lastName}`
    const emailBody = `
New contact form submission:

Name: ${firstName} ${lastName}
Email: ${email}
Company: ${companyName}
Phone: ${phoneNumber}
Inquiry Type: ${inquiryType || "Not specified"}
Message: ${message || "No message provided"}
${affiliateStatus ? `\nAffiliate: ${affiliateStatus}` : ""}
reCAPTCHA Status: ${captchaValid ? "Verified" : "Failed/Skipped"}

Submitted at: ${new Date().toISOString()}
    `.trim()

    // Send email notification
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
        subject: emailSubject,
        body: emailBody,
      })
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the form submission if email fails
    }

    // Store visitor data (you can implement database storage here)
    console.log("Contact form submission:", {
      firstName,
      lastName,
      email,
      companyName,
      phoneNumber,
      inquiryType,
      hasMessage: !!message,
      affiliateCode: affiliateCode || null,
      captchaValid,
      timestamp: new Date().toISOString(),
    })

    revalidatePath("/contact")

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "Sorry, there was an error submitting your message. Please try again.",
    }
  }
}
