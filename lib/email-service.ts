import { sendEmailWithSES } from "./aws-ses"

// Check if running in browser environment
if (typeof window !== "undefined") {
  throw new Error("Email service can only be used on the server")
}

export interface EmailOptions {
  to: string[]
  subject: string
  body: string
  html?: string
}

export async function sendEmail(options: EmailOptions) {
  try {
    // Use AWS SES for sending emails
    const result = await sendEmailWithSES({
      to: options.to,
      subject: options.subject,
      body: options.body,
      html: options.html,
    })

    if (result.success) {
      console.log("Email sent successfully via AWS SES")
      return {
        success: true,
        messageId: result.messageId,
      }
    } else {
      console.error("Failed to send email via AWS SES:", result.error)
      return {
        success: false,
        error: result.error,
      }
    }
  } catch (error) {
    console.error("Email service error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function sendContactEmail(data: {
  firstName: string
  lastName: string
  email: string
  company: string
  message?: string
  affiliate?: string
}) {
  const emailSubject = `Contact Form Submission from ${data.firstName} ${data.lastName}`
  const emailBody = `
New contact form submission:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Company: ${data.company}
Message: ${data.message || "No message provided"}
${data.affiliate ? `Affiliate Code: ${data.affiliate}` : ""}

Submitted at: ${new Date().toISOString()}
  `.trim()

  return await sendEmail({
    to: [process.env.ADMIN_EMAIL || "admin@kuhlekt.com"],
    subject: emailSubject,
    body: emailBody,
  })
}

export async function sendDemoRequestEmail(data: {
  firstName: string
  lastName: string
  email: string
  company: string
  phone?: string
  message?: string
}) {
  const emailSubject = `Demo Request from ${data.firstName} ${data.lastName} - ${data.company}`
  const emailBody = `
New demo request submission:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Company: ${data.company}
Phone: ${data.phone || "Not provided"}
Message: ${data.message || "No additional message"}

Submitted at: ${new Date().toISOString()}

Please follow up with this prospect to schedule their demo.
  `.trim()

  return await sendEmail({
    to: [process.env.ADMIN_EMAIL || "admin@kuhlekt.com"],
    subject: emailSubject,
    body: emailBody,
  })
}
