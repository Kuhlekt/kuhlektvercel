"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<h2>Contact Form Submission</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    })

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
