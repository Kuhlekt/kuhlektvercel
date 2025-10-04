"use server"

import { sendEmail } from "@/lib/aws-ses"

export interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
  recaptchaToken: string
}

export async function submitContactForm(formData: ContactFormData): Promise<{ success: boolean; message: string }> {
  try {
    // Validate reCAPTCHA
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${formData.recaptchaToken}`,
      { method: "POST" },
    )
    const recaptchaData = await recaptchaResponse.json()

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
      }
    }

    // Send email notification
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
            .field-label { font-weight: bold; color: #667eea; }
            .field-value { margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Name</div>
                <div class="field-value">${formData.name}</div>
              </div>
              <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value">${formData.email}</div>
              </div>
              ${
                formData.company
                  ? `<div class="field">
                <div class="field-label">Company</div>
                <div class="field-value">${formData.company}</div>
              </div>`
                  : ""
              }
              ${
                formData.phone
                  ? `<div class="field">
                <div class="field-label">Phone</div>
                <div class="field-value">${formData.phone}</div>
              </div>`
                  : ""
              }
              <div class="field">
                <div class="field-label">Message</div>
                <div class="field-value">${formData.message}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
${formData.company ? `Company: ${formData.company}` : ""}
${formData.phone ? `Phone: ${formData.phone}` : ""}

Message:
${formData.message}
    `

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "contact@kuhlekt.com",
      subject: `New Contact Form: ${formData.name}`,
      text: emailText,
      html: emailHtml,
    })

    if (!result.success) {
      return {
        success: false,
        message: "Failed to send your message. Please try again.",
      }
    }

    // Send confirmation email to user
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Contacting Kuhlekt</h1>
            </div>
            <div class="content">
              <p>Dear ${formData.name},</p>
              <p>Thank you for reaching out to us. We've received your message and one of our team members will get back to you within 24 hours.</p>
              <p>In the meantime, feel free to explore our website to learn more about how Kuhlekt can transform your accounts receivable process.</p>
              <p>Best regards,<br>The Kuhlekt Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail({
      to: formData.email,
      subject: "Thank you for contacting Kuhlekt",
      text: `Dear ${formData.name},\n\nThank you for reaching out to us. We've received your message and one of our team members will get back to you within 24 hours.\n\nBest regards,\nThe Kuhlekt Team`,
      html: confirmationHtml,
    })

    return {
      success: true,
      message: "Thank you! Your message has been sent successfully.",
    }
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    }
  }
}
