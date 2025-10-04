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

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Company: ${company || "Not provided"}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || "Not provided"}</p>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    })

    if (result.success) {
      const supabase = await createClient()
      await supabase.from("contact_submissions").insert({
        name,
        email,
        company,
        message,
      })

      await sendEmail({
        to: email,
        subject: "Thank you for contacting Kuhlekt",
        text: `Hi ${name},

Thank you for reaching out to Kuhlekt! We've received your message and will get back to you shortly.

Best regards,
The Kuhlekt Team`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Thank you for contacting Kuhlekt</h2>
            <p>Hi ${name},</p>
            <p>Thank you for reaching out to Kuhlekt! We've received your message and will get back to you shortly.</p>
            <p>Best regards,<br>The Kuhlekt Team</p>
          </div>
        `,
      })
    }

    return result
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return {
      success: false,
      message: "Failed to submit contact form",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
