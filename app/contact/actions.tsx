"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const message = formData.get("message") as string

    const emailResult = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Company:</strong> ${company}</p><p><strong>Message:</strong> ${message}</p>`,
    })

    if (!emailResult.success) {
      return { success: false, message: emailResult.message }
    }

    return { success: true, message: "Message sent successfully" }
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return { success: false, message: "An error occurred" }
  }
}

export async function sendTestEmail(to: string) {
  try {
    const emailResult = await sendEmail({
      to,
      subject: "Test Email",
      text: "This is a test email",
      html: "<p>This is a test email</p>",
    })

    return emailResult
  } catch (error) {
    console.error("Error in sendTestEmail:", error)
    return { success: false, message: "An error occurred" }
  }
}
