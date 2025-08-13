"use server"

import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/aws-ses"
import { validateAffiliate } from "@/lib/affiliate-validation"
import { verifyCaptcha } from "@/lib/captcha"

interface DemoFormState {
  success: boolean
  message: string
  errors?: {
    [key: string]: string
  }
}

export async function submitDemoForm(prevState: DemoFormState | null, formData: FormData): Promise<DemoFormState> {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const companyName = formData.get("companyName") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const jobTitle = formData.get("jobTitle") as string
    const companySize = formData.get("companySize") as string
    const currentArProcess = formData.get("currentArProcess") as string
    const painPoints = formData.get("painPoints") as string
    const timeframe = formData.get("timeframe") as string
    const affiliateCode = formData.get("affiliateCode") as string
    const captchaToken = formData.get("captchaToken") as string

    // Validate required fields
    const errors: { [key: string]: string } = {}

    if (!firstName?.trim()) errors.firstName = "First name is required"
    if (!lastName?.trim()) errors.lastName = "Last name is required"
    if (!email?.trim()) errors.email = "Email is required"
    if (!companyName?.trim()) errors.companyName = "Company name is required"
    if (!phoneNumber?.trim()) errors.phoneNumber = "Phone number is required"
    if (!jobTitle?.trim()) errors.jobTitle = "Job title is required"

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
    const emailSubject = `New Demo Request from ${firstName} ${lastName} at ${companyName}`
    const emailBody = `
New demo request submission:

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${companyName}
- Phone: ${phoneNumber}
- Job Title: ${jobTitle}

Company Details:
- Company Size: ${companySize || "Not specified"}
- Current AR Process: ${currentArProcess || "Not specified"}
- Main Pain Points: ${painPoints || "Not specified"}
- Implementation Timeframe: ${timeframe || "Not specified"}

${affiliateStatus ? `Affiliate Information:\n${affiliateStatus}\n` : ""}
reCAPTCHA Status: ${captchaValid ? "Verified" : "Failed/Skipped"}

Submitted at: ${new Date().toISOString()}

---
Please follow up with this prospect within 24 hours to schedule their demo.
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

    // Store demo request data (you can implement database storage here)
    console.log("Demo form submission:", {
      firstName,
      lastName,
      email,
      companyName,
      phoneNumber,
      jobTitle,
      companySize,
      currentArProcess,
      painPoints,
      timeframe,
      affiliateCode: affiliateCode || null,
      captchaValid,
      timestamp: new Date().toISOString(),
    })

    revalidatePath("/demo")

    return {
      success: true,
      message:
        "Thank you for requesting a demo! Our team will contact you within 24 hours to schedule your personalized demonstration.",
    }
  } catch (error) {
    console.error("Demo form submission error:", error)
    return {
      success: false,
      message: "Sorry, there was an error submitting your demo request. Please try again.",
    }
  }
}
