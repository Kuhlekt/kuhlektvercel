"use server"

import { sendEmail } from "@/lib/aws-ses"
import { createClient } from "@/lib/supabase/server"

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const message = formData.get("message") as string

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

    const emailResult = await sendEmail({
      to: email,
      subject: "Thank you for contacting Kuhlekt",
      text: `Hi ${name},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nBest regards,\nKuhlekt Team`,
      html: `<h1>Hi ${name},</h1><p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p><p>Best regards,<br/>Kuhlekt Team</p>`,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: emailResult.message,
        error: emailResult.error,
      }
    }

    return {
      success: true,
      message: "Contact form submitted successfully",
    }
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return {
      success: false,
      message: "Failed to submit contact form",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
