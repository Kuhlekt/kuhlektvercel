"use server"

import { sendEmail } from "@/lib/email-service"

export async function submitDemoRequest(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const phone = formData.get("phone") as string
  const message = formData.get("message") as string

  try {
    // Send email notification
    await sendEmail({
      to: "demo@kuhlekt.com",
      subject: "New Demo Request",
      html: `
        <h2>New Demo Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    })

    return { success: true, message: "Demo request submitted successfully!" }
  } catch (error) {
    console.error("Demo request error:", error)
    return { success: false, message: "Failed to submit demo request. Please try again." }
  }
}

// Export alias for compatibility
export const submitDemoForm = submitDemoRequest
