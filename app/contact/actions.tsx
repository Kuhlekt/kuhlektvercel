"use server"

import { sendEmail } from "@/lib/aws-ses"

interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
}

export async function submitContactForm(data: ContactFormData) {
  try {
    const emailSubject = `New Contact Form Submission from ${data.name}`
    const emailText = `
Name: ${data.name}
Email: ${data.email}
Company: ${data.company || "Not provided"}

Message:
${data.message}
    `

    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
      <h3>Message:</h3>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
    `

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    })

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to send contact form",
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
      message: "An error occurred while submitting the form",
    }
  }
}

export async function sendTestEmail(to: string) {
  try {
    const result = await sendEmail({
      to,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email from the Kuhlekt platform.",
      html: "<p>This is a test email from the Kuhlekt platform.</p>",
    })

    return result
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      message: "Failed to send test email",
    }
  }
}
