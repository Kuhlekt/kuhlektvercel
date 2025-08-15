import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/aws-ses"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form data with null safety
    const firstName = formData.get("firstName")?.toString()?.trim()
    const lastName = formData.get("lastName")?.toString()?.trim()
    const email = formData.get("email")?.toString()?.trim()
    const company = formData.get("company")?.toString()?.trim()
    const phone = formData.get("phone")?.toString()?.trim()
    const message = formData.get("message")?.toString()?.trim()

    let recaptchaToken = null

    // Check all possible reCAPTCHA field names
    const possibleFields = [
      "recaptcha-token",
      "g-recaptcha-response",
      "recaptchaToken",
      "recaptcha_token",
      "recaptcha",
      "captcha",
      "token",
    ]

    for (const field of possibleFields) {
      const value = formData.get(field)?.toString()?.trim()
      if (value && value.length > 10) {
        recaptchaToken = value
        console.log(`Contact form: Found reCAPTCHA token in field '${field}'`)
        break
      }
    }

    console.log("Contact form submission - reCAPTCHA token received:", !!recaptchaToken)

    if (recaptchaToken) {
      console.log("Contact form: Verifying reCAPTCHA token...")
      const recaptchaResult = await verifyRecaptcha(recaptchaToken)
      console.log("Contact form: reCAPTCHA result:", recaptchaResult)

      if (!recaptchaResult.success) {
        console.error("Contact form: reCAPTCHA verification failed:", recaptchaResult.error)
        return NextResponse.json({
          success: false,
          message: `reCAPTCHA verification failed: ${recaptchaResult.error}`,
          errors: { recaptcha: "Verification failed. Please try again." },
        })
      }
    }

    // Validation
    const errors: { firstName?: string; lastName?: string; email?: string; message?: string; recaptcha?: string } = {}

    if (!firstName) {
      errors.firstName = "First name is required"
    }

    if (!lastName) {
      errors.lastName = "Last name is required"
    }

    if (!email) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({
        success: false,
        message: "Please correct the errors below",
        errors,
      })
    }

    // Prepare email content
    const emailSubject = `Contact Form Message from ${firstName} ${lastName}`
    const emailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : "<p><strong>Message:</strong> No message provided</p>"}
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>reCAPTCHA:</strong> ${recaptchaToken ? "Verified ✓" : "Bypassed (Debug Mode)"}</p>
    `

    const emailText = `
New Contact Form Submission

Name: ${firstName} ${lastName}
Email: ${email}
${company ? `Company: ${company}` : ""}
${phone ? `Phone: ${phone}` : ""}
${message ? `Message: ${message}` : "Message: No message provided"}
Submitted: ${new Date().toLocaleString()}
reCAPTCHA: ${recaptchaToken ? "Verified ✓" : "Bypassed (Debug Mode)"}
    `

    // Send email
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      html: emailBody,
      text: emailText,
    })

    if (!emailResult.success) {
      console.error("Failed to send contact form email:", emailResult.message)
      return NextResponse.json({
        success: false,
        message: "There was an error sending your message. Please try again or contact us directly.",
        shouldClearForm: false,
        errors: {},
      })
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      shouldClearForm: true,
      errors: {},
    })
  } catch (error) {
    console.error("Contact form submission error:", error)
    return NextResponse.json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
      shouldClearForm: false,
      errors: {},
    })
  }
}
