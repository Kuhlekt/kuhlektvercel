"use server"

import { sendEmailWithSES, testAWSSESConnection } from "@/lib/aws-ses"

export async function testEmailSystem() {
  try {
    console.log("Testing email system configuration...")
    const result = await testAWSSESConnection()
    console.log("Email system test result:", result)
    return result
  } catch (error) {
    console.error("Email system test error:", error)
    return {
      success: false,
      message: `System test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      details: {
        region: false,
        accessKey: false,
        secretKey: false,
        fromEmail: false,
      },
    }
  }
}

export async function sendTestEmail(testEmailAddress: string) {
  try {
    console.log("Sending test email to:", testEmailAddress)

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(testEmailAddress)) {
      return {
        success: false,
        message: "Invalid email address format",
      }
    }

    const emailContent = `Hello!

This is a test email from the Kuhlekt website email system.

If you receive this email, it means:
✓ AWS SES is properly configured
✓ Email sending is working correctly
✓ The contact forms on the website will work properly

Test Details:
- Sent at: ${new Date().toISOString()}
- From: Kuhlekt Email System
- To: ${testEmailAddress}

You can safely delete this email.

Best regards,
Kuhlekt Team`

    const result = await sendEmailWithSES({
      to: testEmailAddress,
      subject: "Kuhlekt Email System Test",
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello!</h2>
          <p>This is a test email from the Kuhlekt website email system.</p>
          <p>If you receive this email, it means:</p>
          <ul>
            <li>✓ AWS SES is properly configured</li>
            <li>✓ Email sending is working correctly</li>
            <li>✓ The contact forms on the website will work properly</li>
          </ul>
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>Sent at: ${new Date().toISOString()}</li>
            <li>From: Kuhlekt Email System</li>
            <li>To: ${testEmailAddress}</li>
          </ul>
          <p>You can safely delete this email.</p>
          <p>Best regards,<br>Kuhlekt Team</p>
        </div>
      `,
    })

    if (result.success) {
      return {
        success: true,
        message: `Test email sent successfully to ${testEmailAddress}!\n\nPlease check your inbox (and spam folder) for the test email.\n\nMessage ID: ${result.messageId}`,
        messageId: result.messageId,
      }
    } else {
      return {
        success: false,
        message: `Failed to send test email: ${result.message}\n\nThe email has been logged for manual follow-up.`,
      }
    }
  } catch (error) {
    console.error("Test email error:", error)
    return {
      success: false,
      message: `Test email failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

// Additional helper to check current email configuration status
export async function getEmailConfigStatus() {
  const region = process.env.AWS_SES_REGION
  const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY
  const fromEmail = process.env.AWS_SES_FROM_EMAIL

  return {
    configured: !!(region && accessKeyId && secretAccessKey && fromEmail),
    details: {
      region: !!region,
      accessKey: !!accessKeyId,
      secretKey: !!secretAccessKey,
      fromEmail: !!fromEmail,
    },
    values: {
      region: region || "Not set",
      fromEmail: fromEmail || "Not set",
      accessKeyId: accessKeyId ? `${accessKeyId.substring(0, 4)}...` : "Not set",
    },
  }
}
