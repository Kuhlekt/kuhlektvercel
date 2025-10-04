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
      return { success: false, message: "Name, email, and message are required" }
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

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: "Thank you for contacting Kuhlekt",
      text: `Hi ${name},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nBest regards,\nThe Kuhlekt Team`,
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <p>Best regards,<br/>The Kuhlekt Team</p>
      `,
    })

    // Send notification to admin
    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Form Submission from ${name}`,
        text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || "N/A"}\n\nMessage:\n${message}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || "N/A"}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      })
    }

    return { success: true, message: "Thank you for your message. We will be in touch soon!" }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "Failed to send message",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
