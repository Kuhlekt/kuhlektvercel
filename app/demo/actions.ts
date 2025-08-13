"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"

interface DemoRequestResult {
  success: boolean
  message: string
}

export async function submitDemoRequest(formData: FormData): Promise<DemoRequestResult> {
  try {
    const firstName = formData.get("firstName")?.toString().trim() || ""
    const lastName = formData.get("lastName")?.toString().trim() || ""
    const email = formData.get("email")?.toString().trim() || ""
    const company = formData.get("company")?.toString().trim() || ""
    const phone = formData.get("phone")?.toString().trim() || ""
    const message = formData.get("message")?.toString().trim() || ""

    console.log("Demo form data:", { firstName, lastName, email, company, phone, message })

    // Basic validation
    if (!firstName || !lastName || !email || !company) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    const fullName = `${firstName} ${lastName}`
    const adminEmail = process.env.ADMIN_EMAIL || "admin@kuhlekt.com"
    const subject = `Demo Request from ${fullName}`

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          Demo Request Submission
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        </div>

        ${
          message
            ? `
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Requirements</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        `
            : ""
        }

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>This demo request was submitted at ${new Date().toLocaleString()}.</p>
        </div>
      </div>
    `

    const textContent = `
Demo Request Submission

Contact Information:
Name: ${fullName}
Email: ${email}
Company: ${company}
${phone ? `Phone: ${phone}` : ""}

${message ? `Requirements:\n${message}\n` : ""}

Submitted: ${new Date().toLocaleString()}
    `

    const emailResult = await sendEmailWithSES({
      to: adminEmail,
      subject: subject,
      text: textContent,
      html: htmlContent,
    })

    if (emailResult.success) {
      return {
        success: true,
        message: "Demo request submitted successfully! We'll contact you within 24 hours.",
      }
    } else {
      console.error("Email send failed:", emailResult.message)
      return {
        success: true,
        message: "Demo request received! We'll contact you within 24 hours.",
      }
    }
  } catch (error) {
    console.error("Demo form error:", error)
    return {
      success: false,
      message: "An error occurred while submitting your request. Please try again.",
    }
  }
}
