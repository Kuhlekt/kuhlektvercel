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
        message: "Please provide name, email, and message",
      }
    }

    const supabase = await createClient()

    const { error: dbError } = await supabase.from("contact_submissions").insert({
      name,
      email,
      company: company || null,
      message,
      submitted_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error("Database error:", dbError)
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Thank you for contacting Kuhlekt",
      text: `Thank you for reaching out to Kuhlekt!\n\nWe have received your message and will get back to you shortly.\n\nYour message:\n${message}\n\nBest regards,\nThe Kuhlekt Team`,
      html: `
        <h2>Thank you for contacting Kuhlekt!</h2>
        <p>We have received your message and will get back to you shortly.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <p>Best regards,<br>The Kuhlekt Team</p>
      `,
    })

    await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `New Contact Form Submission from ${name}`,
      text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || "Not provided"}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Company:</strong> ${company || "Not provided"}</li>
        </ul>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    })

    return emailResult
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "Failed to submit contact form",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
