"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const message = formData.get("message") as string

    if (!name || !email || !message) {
      return { success: false, message: "Please fill in all required fields" }
    }

    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `

    const emailText = `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}${company ? `\nCompany: ${company}` : ""}\n\nMessage:\n${message}`

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `Contact Form: ${name}`,
      text: emailText,
      html: emailHtml,
    })

    if (!result.success) {
      return { success: false, message: "Failed to send message" }
    }

    return { success: true, message: "Message sent successfully" }
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return { success: false, message: "An error occurred" }
  }
}

export async function sendTestEmail(email: string) {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email from Kuhlekt.",
      html: "<p>This is a test email from Kuhlekt.</p>",
    })

    return result
  } catch (error) {
    console.error("Error in sendTestEmail:", error)
    return { success: false, message: "Failed to send test email" }
  }
}
