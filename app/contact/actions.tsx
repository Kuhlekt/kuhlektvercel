"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const message = formData.get("message") as string
  const recaptchaToken = formData.get("recaptchaToken") as string

  if (!name || !email || !message) {
    return { success: false, message: "Missing required fields" }
  }

  if (!recaptchaToken) {
    return { success: false, message: "reCAPTCHA verification required" }
  }

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`
  const verifyResponse = await fetch(verifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
  })

  const verifyData = await verifyResponse.json()

  if (!verifyData.success || verifyData.score < 0.5) {
    return { success: false, message: "reCAPTCHA verification failed" }
  }

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Contact Form Submission</h1>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      </body>
    </html>
  `

  const textContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ""}

Message:
${message}
  `

  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: `New Contact Form: ${name}`,
    text: textContent,
    html: htmlContent,
  })

  return result
}

export async function sendTestEmail(to: string) {
  const result = await sendEmail({
    to,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email from the Kuhlekt contact form.",
    html: "<p>This is a test email from the Kuhlekt contact form.</p>",
  })

  return result
}
