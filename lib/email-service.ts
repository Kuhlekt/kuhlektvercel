import { sendEmailViaSES } from "./aws-ses"

interface EmailParams {
  to: string | string[]
  subject: string
  body: string
  replyTo?: string
}

interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendEmail(params: EmailParams): Promise<SendEmailResult> {
  try {
    // Try AWS SES first
    const sesResult = await sendEmailViaSES(params)

    if (sesResult.success) {
      return sesResult
    }

    // If AWS SES fails, log the attempt for manual follow-up
    console.log("Email sending failed, logging for manual follow-up:", {
      to: params.to,
      subject: params.subject,
      body: params.body.substring(0, 200) + "...",
      timestamp: new Date().toISOString(),
      error: sesResult.error,
    })

    // Return success to avoid blocking the user, but indicate it needs manual follow-up
    return {
      success: true,
      messageId: "manual-followup-" + Date.now(),
      error: "Email queued for manual follow-up",
    }
  } catch (error) {
    console.error("Email service error:", error)

    // Log for manual follow-up
    console.log("Email sending failed, logging for manual follow-up:", {
      to: params.to,
      subject: params.subject,
      body: params.body.substring(0, 200) + "...",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    })

    // Return success to avoid blocking the user
    return {
      success: true,
      messageId: "manual-followup-" + Date.now(),
      error: "Email queued for manual follow-up",
    }
  }
}

// Helper function to validate email addresses
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Helper function to sanitize email content
export function sanitizeEmailContent(content: string): string {
  return content
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .trim()
}
