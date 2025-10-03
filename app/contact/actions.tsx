"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
  recaptchaToken: string
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("contact_submissions").insert([
      {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        message: formData.message,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Error inserting contact submission:", error)
      return {
        success: false,
        message: "Failed to submit contact form. Please try again.",
      }
    }

    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: `New Contact Form Submission from ${formData.name}`,
      text: `
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company || "N/A"}

Message:
${formData.message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${formData.name}</p>
<p><strong>Email:</strong> ${formData.email}</p>
<p><strong>Company:</strong> ${formData.company || "N/A"}</p>
<h3>Message:</h3>
<p>${formData.message.replace(/\n/g, "<br>")}</p>
      `,
    })

    if (!emailResult.success) {
      console.error("Failed to send notification email:", emailResult.error)
    }

    return {
      success: true,
      message: "Thank you for contacting us. We will get back to you soon.",
    }
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function sendTestEmail(to: string) {
  try {
    const result = await sendEmail({
      to,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email to verify the email service is working correctly.",
      html: "<h1>Test Email</h1><p>This is a test email to verify the email service is working correctly.</p>",
    })

    return result
  } catch (error) {
    console.error("Error in sendTestEmail:", error)
    return {
      success: false,
      message: "Failed to send test email",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
