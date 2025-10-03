"use server"

import { sendEmail, validateSESConfiguration } from "@/lib/aws-ses"

export async function testEmail(email: string) {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from the Kuhlekt website.</p>
        <p>If you received this, your email configuration is working correctly!</p>
      `,
      text: "This is a test email from the Kuhlekt website. If you received this, your email configuration is working correctly!",
    })

    return result
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send test email",
    }
  }
}

export async function testEmailSystem(email: string) {
  return await testEmail(email)
}

export async function getEmailConfigStatus() {
  try {
    const validation = await validateSESConfiguration()
    return {
      success: validation.valid,
      message: validation.message,
      config: {
        region: process.env.AWS_SES_REGION ? "Set" : "Missing",
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID ? "Set" : "Missing",
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY ? "Set" : "Missing",
        fromEmail: process.env.AWS_SES_FROM_EMAIL ? "Set" : "Missing",
      },
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to check email configuration",
      config: {
        region: "Error",
        accessKeyId: "Error",
        secretAccessKey: "Error",
        fromEmail: "Error",
      },
    }
  }
}
