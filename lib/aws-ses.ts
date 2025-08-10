"use server"

import { SESClient, SendEmailCommand, GetSendQuotaCommand } from "@aws-sdk/client-ses"

// Create SES client with configuration
function createSESClient() {
  const region = process.env.AWS_SES_REGION
  const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("AWS SES configuration incomplete")
  }

  return new SESClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    // Add retry configuration for better reliability
    maxAttempts: 3,
  })
}

export async function sendEmailWithSES(params: {
  to: string[]
  subject: string
  body: string
  replyTo?: string
}) {
  // Check if AWS SES is configured
  const region = process.env.AWS_SES_REGION
  const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY
  const fromEmail = process.env.AWS_SES_FROM_EMAIL

  if (!region || !accessKeyId || !secretAccessKey || !fromEmail) {
    console.log("AWS SES not configured, logging submission for manual follow-up")
    console.log("Email details:", {
      to: params.to,
      subject: params.subject,
      body: params.body,
      replyTo: params.replyTo,
      timestamp: new Date().toISOString(),
    })
    return {
      success: false,
      message: "Email service not configured - submission logged for manual follow-up",
      messageId: null,
    }
  }

  try {
    const sesClient = createSESClient()

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    for (const email of params.to) {
      if (!emailRegex.test(email)) {
        throw new Error(`Invalid email address: ${email}`)
      }
    }

    if (params.replyTo && !emailRegex.test(params.replyTo)) {
      throw new Error(`Invalid reply-to email address: ${params.replyTo}`)
    }

    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: params.to,
      },
      Message: {
        Subject: {
          Data: params.subject,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: params.body,
            Charset: "UTF-8",
          },
        },
      },
      ReplyToAddresses: params.replyTo ? [params.replyTo] : undefined,
      // Add configuration set if you have one configured
      // ConfigurationSetName: "your-configuration-set-name",
    })

    console.log("Sending email via AWS SES:", {
      to: params.to,
      subject: params.subject,
      from: fromEmail,
      region: region,
    })

    const response = await sesClient.send(command)

    console.log("Email sent successfully via AWS SDK:", {
      messageId: response.MessageId,
      to: params.to,
      subject: params.subject,
    })

    return {
      success: true,
      message: "Email sent successfully",
      messageId: response.MessageId || "unknown",
    }
  } catch (error) {
    console.error("AWS SES SDK Error:", error)

    // Log the submission for manual follow-up even if email fails
    console.log("Email failed, logging for manual follow-up:", {
      to: params.to,
      subject: params.subject,
      body: params.body,
      replyTo: params.replyTo,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    })

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      messageId: null,
    }
  }
}

export async function testAWSSESConnection() {
  try {
    console.log("Testing AWS SES SDK connection...")

    // Check environment variables
    const region = process.env.AWS_SES_REGION
    const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY
    const fromEmail = process.env.AWS_SES_FROM_EMAIL

    const envCheck = {
      region: !!region,
      accessKey: !!accessKeyId,
      secretKey: !!secretAccessKey,
      fromEmail: !!fromEmail,
    }

    console.log("Environment variables status:", envCheck)
    console.log("Configuration details:", {
      region: region || "NOT SET",
      fromEmail: fromEmail || "NOT SET",
      accessKeyId: accessKeyId ? `${accessKeyId.substring(0, 4)}...` : "NOT SET",
      secretAccessKey: secretAccessKey ? "SET (hidden)" : "NOT SET",
    })

    // Check if all required variables are present
    const allConfigured = Object.values(envCheck).every(Boolean)

    if (!allConfigured) {
      return {
        success: false,
        message: "AWS SES is not fully configured. Missing environment variables.",
        details: envCheck,
      }
    }

    // Test SES connection by checking send quota
    try {
      const sesClient = createSESClient()

      // First test: Check send quota (this validates credentials and permissions)
      const quotaCommand = new GetSendQuotaCommand({})
      const quotaResponse = await sesClient.send(quotaCommand)

      console.log("AWS SES quota check successful:", {
        maxSendRate: quotaResponse.MaxSendRate,
        max24HourSend: quotaResponse.Max24HourSend,
        sentLast24Hours: quotaResponse.SentLast24Hours,
      })

      // Second test: Send a test email
      const testResult = await sendEmailWithSES({
        to: ["test@example.com"],
        subject: "AWS SES SDK Configuration Test",
        body: `AWS SES SDK Test Email

This is a test email sent from Kuhlekt using the official AWS SDK for SES.

Configuration Details:
- Region: ${region}
- From Email: ${fromEmail}
- Timestamp: ${new Date().toISOString()}

If you receive this email, the AWS SES configuration is working correctly.`,
      })

      if (testResult.success) {
        return {
          success: true,
          message: `AWS SES SDK is working correctly! 
          
Send Quota: ${quotaResponse.Max24HourSend} emails/24h
Send Rate: ${quotaResponse.MaxSendRate} emails/second
Used Today: ${quotaResponse.SentLast24Hours} emails

Test email sent with Message ID: ${testResult.messageId}`,
          details: envCheck,
        }
      } else {
        return {
          success: false,
          message: `AWS SES SDK connection successful, but test email failed: ${testResult.message}`,
          details: envCheck,
        }
      }
    } catch (testError) {
      console.error("AWS SDK test error:", testError)
      const errorMessage = testError instanceof Error ? testError.message : "Unknown test error"

      // Check for common AWS SES errors
      let helpMessage = ""
      if (errorMessage.includes("InvalidParameterValue")) {
        helpMessage = " (Check if your from email is verified in SES)"
      } else if (errorMessage.includes("AccessDenied")) {
        helpMessage = " (Check IAM permissions for SES)"
      } else if (errorMessage.includes("SignatureDoesNotMatch")) {
        helpMessage = " (Check AWS credentials)"
      }

      return {
        success: false,
        message: `AWS SDK test failed: ${errorMessage}${helpMessage}`,
        details: envCheck,
      }
    }
  } catch (error) {
    console.error("Test function error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    return {
      success: false,
      message: `Test failed: ${errorMessage}`,
      details: {
        region: false,
        accessKey: false,
        secretKey: false,
        fromEmail: false,
      },
    }
  }
}

// Helper function to validate SES configuration
export async function validateSESConfiguration() {
  const region = process.env.AWS_SES_REGION
  const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY
  const fromEmail = process.env.AWS_SES_FROM_EMAIL

  const issues = []

  if (!region) issues.push("AWS_SES_REGION is not set")
  if (!accessKeyId) issues.push("AWS_SES_ACCESS_KEY_ID is not set")
  if (!secretAccessKey) issues.push("AWS_SES_SECRET_ACCESS_KEY is not set")
  if (!fromEmail) issues.push("AWS_SES_FROM_EMAIL is not set")

  if (fromEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
    issues.push("AWS_SES_FROM_EMAIL is not a valid email address")
  }

  return {
    isValid: issues.length === 0,
    issues,
    configuration: {
      region: region || null,
      fromEmail: fromEmail || null,
      hasAccessKey: !!accessKeyId,
      hasSecretKey: !!secretAccessKey,
    },
  }
}
