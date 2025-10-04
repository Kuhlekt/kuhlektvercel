"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const message = formData.get("message") as string

    if (!name || !email || !message) {
      return {
        success: false,
        message: "Name, email, and message are required",
      }
    }

    // Send email to admin
    const adminSubject = "New Contact Form Submission"
    const adminText = `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || "N/A"}\nPhone: ${phone || "N/A"}\nMessage: ${message}`
    const adminHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; }
            .content { padding: 20px; background-color: #f9fafb; }
            .field { margin: 15px 0; }
            .label { font-weight: bold; color: #1f2937; }
            .value { color: #4b5563; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <div class="label">Company:</div>
                <div class="value">${company || "N/A"}</div>
              </div>
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${phone || "N/A"}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${message}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const adminResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: adminSubject,
      text: adminText,
      html: adminHtml,
    })

    if (!adminResult.success) {
      return adminResult
    }

    // Send confirmation email to user
    const userSubject = "Thank you for contacting Kuhlekt"
    const userText = `Hi ${name},\n\nThank you for reaching out to Kuhlekt. We've received your message and will get back to you shortly.\n\nYour message:\n${message}\n\nBest regards,\nThe Kuhlekt Team`
    const userHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .message-box { background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Contacting Us</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for reaching out to Kuhlekt. We've received your message and will get back to you shortly.</p>
              
              <div class="message-box">
                <strong>Your message:</strong>
                <p>${message}</p>
              </div>

              <p>If you have any urgent questions, please don't hesitate to call us.</p>
              <p>Best regards,<br>The Kuhlekt Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail({
      to: email,
      subject: userSubject,
      text: userText,
      html: userHtml,
    })

    return {
      success: true,
      message: "Your message has been sent successfully",
    }
  } catch (error) {
    console.error("Error in sendContactForm:", error)
    return {
      success: false,
      message: "Failed to send contact form",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
