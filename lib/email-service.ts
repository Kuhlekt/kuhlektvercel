"use server"

import { sendEmailWithSES } from "./aws-ses"

interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail(options: EmailOptions) {
  // Check if we're on the server
  if (typeof window !== "undefined") {
    throw new Error("Email service can only be used on the server")
  }

  try {
    // Use AWS SES to send the email
    const result = await sendEmailWithSES(options)

    if (result.success) {
      console.log("Email sent successfully:", result.messageId)
      return {
        success: true,
        messageId: result.messageId,
      }
    } else {
      console.error("Email sending failed:", result.message)
      return {
        success: false,
        error: result.message,
      }
    }
  } catch (error) {
    console.error("Email service error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function sendContactEmail(data: {
  name: string
  email: string
  company?: string
  message: string
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@kuhlekt.com"

  const subject = `New Contact Form Submission from ${data.name}`
  const text = `
Name: ${data.name}
Email: ${data.email}
Company: ${data.company || "Not provided"}

Message:
${data.message}

Submitted at: ${new Date().toLocaleString()}
  `

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1f2937;">New Contact Form Submission</h2>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
      </div>

      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Message</h3>
        <p style="white-space: pre-wrap;">${data.message}</p>
      </div>

      <div style="margin-top: 30px; color: #6b7280; font-size: 12px;">
        <p>Submitted at: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `

  return await sendEmailWithSES({
    to: adminEmail,
    subject,
    text,
    html,
  })
}

export async function sendDemoRequestEmail(data: {
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle?: string
  phone?: string
  companySize?: string
  currentSolution?: string
  challenges?: string
  timeline?: string
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@kuhlekt.com"

  const subject = `New Demo Request from ${data.firstName} ${data.lastName} at ${data.company}`
  const text = `
Demo Request Details:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Company: ${data.company}
Job Title: ${data.jobTitle || "Not provided"}

Company Size: ${data.companySize || "Not specified"}
Current Solution: ${data.currentSolution || "Not specified"}
Timeline: ${data.timeline || "Not specified"}

${data.challenges ? `Challenges:\n${data.challenges}` : ""}

Submitted at: ${new Date().toLocaleString()}
  `

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1f2937;">New Demo Request</h2>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Job Title:</strong> ${data.jobTitle || "Not provided"}</p>
      </div>

      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Company Details</h3>
        <p><strong>Company Size:</strong> ${data.companySize || "Not specified"}</p>
        <p><strong>Current Solution:</strong> ${data.currentSolution || "Not specified"}</p>
        <p><strong>Timeline:</strong> ${data.timeline || "Not specified"}</p>
      </div>

      ${
        data.challenges
          ? `
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Challenges</h3>
        <p style="white-space: pre-wrap;">${data.challenges}</p>
      </div>
      `
          : ""
      }

      <div style="margin-top: 30px; color: #6b7280; font-size: 12px;">
        <p>Submitted at: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `

  return await sendEmailWithSES({
    to: adminEmail,
    subject,
    text,
    html,
  })
}

export { sendEmailWithSES }

// Legacy export for backward compatibility
export const sendEmailLegacy = sendEmailWithSES
