"use server"

import { sendEmail } from "@/lib/aws-ses"
import { createClient } from "@/lib/supabase/server"

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const message = formData.get("message") as string

    if (!name || !email || !message) {
      return {
        success: false,
        message: "Please fill in all required fields",
      }
    }

    const supabase = await createClient()

    const { error: dbError } = await supabase.from("contact_submissions").insert([
      {
        name,
        email,
        company,
        message,
        submitted_at: new Date().toISOString(),
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
<p>${message}</p>
      `,
    })

    if (!emailResult.success) {
      console.error("Email error:", emailResult.error)
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
    }
  }
}

export async function sendTestEmail(email: string) {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email to verify your email configuration.",
      html: "<h1>Test Email</h1><p>This is a test email to verify your email configuration.</p>",
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
