"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const message = formData.get("message") as string
    const recaptchaToken = formData.get("recaptchaToken") as string

    if (!name || !email || !message) {
      return {
        success: false,
        message: "Please fill in all required fields",
      }
    }

    if (!recaptchaToken) {
      return {
        success: false,
        message: "Please complete the reCAPTCHA verification",
      }
    }

    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    })

    const recaptchaData = await recaptchaResponse.json()

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
      }
    }

    const supabase = await createClient()

    const { error: dbError } = await supabase.from("contact_submissions").insert([
      {
        name,
        email,
        company: company || null,
        message,
        created_at: new Date().toISOString(),
      },
    ])

    if (dbError) {
      console.error("Database error:", dbError)
      return {
        success: false,
        message: "Failed to save your message. Please try again.",
      }
    }

    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "info@kuhlekt.com",
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "N/A"}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error)
    }

    return {
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    }
  }
}

export async function sendTestEmail(email: string) {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email to verify the email configuration.",
      html: "<h1>Test Email</h1><p>This is a test email to verify the email configuration.</p>",
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
