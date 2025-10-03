"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const message = formData.get("message") as string
    const recaptchaToken = formData.get("recaptcha_token") as string

    if (!name || !email || !message) {
      return {
        success: false,
        message: "Please fill in all required fields",
      }
    }

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      return {
        success: false,
        message: "Please complete the reCAPTCHA verification",
      }
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    const recaptchaResponse = await fetch(verifyUrl, { method: "POST" })
    const recaptchaData = await recaptchaResponse.json()

    if (!recaptchaData.success) {
      return {
        success: false,
        message: "reCAPTCHA verification failed",
      }
    }

    // Store in Supabase
    const supabase = await createClient()
    const { error: dbError } = await supabase.from("contact_submissions").insert({
      name,
      email,
      company,
      message,
      created_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error("Database error:", dbError)
    }

    // Send email notification
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Company: ${company || "N/A"}

Message:
${message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Company:</strong> ${company || "N/A"}</p>
<h3>Message:</h3>
<p>${message.replace(/\n/g, "<br>")}</p>
      `,
    })

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error)
      return {
        success: true,
        message: "Your message was received but email notification failed. We will respond soon.",
      }
    }

    return {
      success: true,
      message: "Thank you for contacting us! We will respond within 24 hours.",
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    }
  }
}

export async function sendTestEmail() {
  try {
    const result = await sendEmail({
      to: process.env.ADMIN_EMAIL || "test@example.com",
      subject: "Test Email from Kuhlekt",
      text: "This is a test email.",
      html: "<p>This is a <strong>test email</strong>.</p>",
    })

    return result
  } catch (error) {
    console.error("Test email error:", error)
    return {
      success: false,
      message: "Failed to send test email",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
