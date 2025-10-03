"use server"

import { sendEmailWithSES, validateSESConfiguration } from "@/lib/aws-ses"

export interface TestResult {
  success: boolean
  message: string
  details?: any
}

export async function testAWSSES(): Promise<TestResult> {
  try {
    console.log("[Email Test] Starting AWS SES test")

    // First validate configuration
    const validation = validateSESConfiguration()
    if (!validation.valid) {
      console.error("[Email Test] Configuration validation failed:", validation.errors)
      return {
        success: false,
        message: "AWS SES configuration is invalid",
        details: validation.errors,
      }
    }

    console.log("[Email Test] Configuration validated successfully")

    // Try to send a test email
    const testEmailAddress = process.env.AWS_SES_FROM_EMAIL

    if (!testEmailAddress) {
      return {
        success: false,
        message: "AWS_SES_FROM_EMAIL environment variable is not set",
      }
    }

    console.log("[Email Test] Sending test email to:", testEmailAddress)

    const result = await sendEmailWithSES({
      to: testEmailAddress,
      subject: "Kuhlekt Email System Test",
      html: `
        <h1>Email System Test</h1>
        <p>This is a test email from the Kuhlekt website.</p>
        <p>If you received this email, AWS SES is configured correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `,
      text: `
Email System Test

This is a test email from the Kuhlekt website.

If you received this email, AWS SES is configured correctly.

Timestamp: ${new Date().toISOString()}
      `.trim(),
    })

    console.log("[Email Test] Email send result:", result)

    if (result.success) {
      return {
        success: true,
        message: `Test email sent successfully to ${testEmailAddress}`,
        details: {
          messageId: result.messageId,
          recipient: testEmailAddress,
        },
      }
    } else {
      return {
        success: false,
        message: result.message || "Failed to send test email",
        details: result,
      }
    }
  } catch (error) {
    console.error("[Email Test] Unexpected error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
      details: error,
    }
  }
}
