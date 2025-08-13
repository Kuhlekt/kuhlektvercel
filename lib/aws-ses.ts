import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

interface EmailParams {
  to: string[]
  subject: string
  body: string
  replyTo?: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  message?: string
}

export async function sendEmailWithSES(params: EmailParams): Promise<EmailResult> {
  try {
    // Check for required environment variables
    const region = process.env.AWS_SES_REGION
    const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY
    const fromEmail = process.env.AWS_SES_FROM_EMAIL

    if (!region || !accessKeyId || !secretAccessKey || !fromEmail) {
      console.error("Missing AWS SES configuration")
      return {
        success: false,
        message: "Email service not configured",
      }
    }

    // Create SES client with explicit credentials
    const sesClient = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })

    // Prepare email command
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
    })

    // Send email
    const response = await sesClient.send(command)

    return {
      success: true,
      messageId: response.MessageId,
      message: "Email sent successfully",
    }
  } catch (error) {
    console.error("AWS SES Error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
