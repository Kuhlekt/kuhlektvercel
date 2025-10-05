import {
  SESClient,
  SendEmailCommand,
  VerifyEmailIdentityCommand,
  ListVerifiedEmailAddressesCommand,
} from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

interface EmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, from, replyTo }: EmailParams) {
  const fromAddress = from || process.env.AWS_SES_FROM_EMAIL || "noreply@kuhlekt.com"
  const toAddresses = Array.isArray(to) ? to : [to]

  const params = {
    Source: fromAddress,
    Destination: {
      ToAddresses: toAddresses,
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: html,
          Charset: "UTF-8",
        },
      },
    },
    ...(replyTo && {
      ReplyToAddresses: [replyTo],
    }),
  }

  try {
    const command = new SendEmailCommand(params)
    const response = await sesClient.send(command)
    console.log("Email sent successfully:", response.MessageId)
    return { success: true, messageId: response.MessageId }
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

// Alias for backward compatibility
export async function sendEmailWithSES(params: EmailParams) {
  return sendEmail(params)
}

export async function testAWSSESConnection() {
  try {
    const command = new ListVerifiedEmailAddressesCommand({})
    const response = await sesClient.send(command)
    return {
      success: true,
      verifiedEmails: response.VerifiedEmailAddresses || [],
    }
  } catch (error) {
    console.error("AWS SES connection test failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function validateSESConfiguration() {
  const requiredEnvVars = ["AWS_SES_ACCESS_KEY_ID", "AWS_SES_SECRET_ACCESS_KEY", "AWS_SES_REGION", "AWS_SES_FROM_EMAIL"]

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    return {
      valid: false,
      error: `Missing required environment variables: ${missingVars.join(", ")}`,
    }
  }

  const connectionTest = await testAWSSESConnection()

  return {
    valid: connectionTest.success,
    error: connectionTest.success ? null : connectionTest.error,
    verifiedEmails: connectionTest.verifiedEmails || [],
  }
}

export async function verifyEmailAddress(email: string) {
  try {
    const command = new VerifyEmailIdentityCommand({ EmailAddress: email })
    await sesClient.send(command)
    return { success: true, message: `Verification email sent to ${email}` }
  } catch (error) {
    console.error("Error verifying email address:", error)
    throw error
  }
}
