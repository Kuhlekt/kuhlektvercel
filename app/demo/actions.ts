"use server"

import { sendEmail } from "@/lib/email-service"
import { verifyCaptcha } from "@/lib/recaptcha-actions"

export interface DemoFormData {
  firstName: string
  lastName: string
  email: string
  company: string
  phone?: string
  message?: string
  captchaToken: string
}

export interface DemoFormState {
  success?: boolean
  error?: string
  message?: string
}

export async function submitDemoRequest(prevState: DemoFormState | null, formData: FormData): Promise<DemoFormState> {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const message = formData.get("message") as string
    const captchaToken = formData.get("captchaToken") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return { error: "Please fill in all required fields." }
    }

    // Verify reCAPTCHA
    const captchaResult = await verifyCaptcha(captchaToken)
    if (!captchaResult.success) {
      return { error: "Please complete the reCAPTCHA verification." }
    }

    // Prepare email content
    const emailSubject = "New Demo Request - Kuhlekt AR Automation"
    const emailBody = `
      <h2>New Demo Request</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : ""}
      <hr>
      <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
    `

    // Send email
    await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      html: emailBody,
    })

    return {
      success: true,
      message: "Thank you for your interest! We'll contact you soon to schedule your demo.",
    }
  } catch (error) {
    console.error("Demo request error:", error)
    return {
      error: "There was an error submitting your request. Please try again.",
    }
  }
}

// Export alias for compatibility
export const submitDemoForm = submitDemoRequest
