"use server"

import { sendEmail } from "@/lib/aws-ses"
import { createClient } from "@/lib/supabase/server"

interface ContactFormData {
  name: string
  email: string
  company: string
  phone?: string
  message: string
  recaptchaToken: string
}

export async function submitContactForm(data: ContactFormData) {
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${data.recaptchaToken}`,
      { method: "POST" },
    )
    const recaptchaResult = await response.json()

    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      return { success: false, message: "reCAPTCHA verification failed" }
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .field { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #0066cc; }
            .label { font-weight: bold; color: #666; }
            .value { margin-top: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${data.name}</div>
              </div>
              
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${data.email}</div>
              </div>
              
              <div class="field">
                <div class="label">Company:</div>
                <div class="value">${data.company}</div>
              </div>
              
              ${
                data.phone
                  ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${data.phone}</div>
              </div>
              `
                  : ""
              }
              
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${data.message}</div>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 Kuhlekt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Company: ${data.company}
${data.phone ? `Phone: ${data.phone}` : ""}

Message:
${data.message}

© 2025 Kuhlekt. All rights reserved.
    `

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `New Contact Form Submission from ${data.name}`,
      text: emailText,
      html: emailHtml,
    })

    if (!result.success) {
      throw new Error(result.error || "Failed to send email")
    }

    const supabase = await createClient()
    await supabase.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      company: data.company,
      phone: data.phone,
      message: data.message,
      created_at: new Date().toISOString(),
    })

    return { success: true, message: "Your message has been sent successfully!" }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
