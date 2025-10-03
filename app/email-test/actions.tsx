"use server"

import { sendEmail, testAWSSESConnection, validateSESConfiguration } from "@/lib/aws-ses"

export async function testEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const result = await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email from the Kuhlekt email system.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Test Email</h2>
          <p>This is a test email from the Kuhlekt email system.</p>
          <p style="color: #6b7280; font-size: 14px;">Sent at: ${new Date().toISOString()}</p>
        </div>
      `,
    })

    return result
  } catch (error) {
    console.error("Error in testEmail:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send test email",
    }
  }
}

export async function testEmailSystem(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    const connectionTest = await testAWSSESConnection()
    const configValidation = await validateSESConfiguration()

    return {
      success: connectionTest.success && configValidation.valid,
      message:
        connectionTest.success && configValidation.valid
          ? "Email system is properly configured"
          : "Email system has configuration issues",
      details: {
        connection: connectionTest,
        validation: configValidation,
      },
    }
  } catch (error) {
    console.error("Error in testEmailSystem:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to test email system",
    }
  }
}

export async function getEmailConfigStatus(): Promise<{ configured: boolean; issues: string[] }> {
  try {
    const validation = await validateSESConfiguration()
    return {
      configured: validation.valid,
      issues: validation.issues,
    }
  } catch (error) {
    console.error("Error in getEmailConfigStatus:", error)
    return {
      configured: false,
      issues: ["Failed to check email configuration"],
    }
  }
}
