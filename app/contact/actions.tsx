"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const message = formData.get("message") as string

  if (!name || !email || !message) {
    return {
      success: false,
      message: "Please fill in all required fields",
    }
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    .field { margin: 15px 0; }
    .label { font-weight: bold; color: #667eea; }
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
        <div>${name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div>${email}</div>
      </div>
      ${company ? `<div class="field"><div class="label">Company:</div><div>${company}</div></div>` : ""}
      <div class="field">
        <div class="label">Message:</div>
        <div>${message}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `

  const textContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ""}
Message: ${message}
  `

  const result = await sendEmail({
    to: process.env.AWS_SES_FROM_EMAIL || "",
    subject: `Contact Form: ${name}`,
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
