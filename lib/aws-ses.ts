"use server"

// Simple AWS SES implementation that works in edge runtime
import { SESClient } from "@aws-sdk/client-ses"

// Ensure region is properly set
const region = process.env.AWS_SES_REGION || "us-east-1"

const sesClient = new SESClient({
  region: region,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

interface EmailParams {
  to: string | string[]
  subject: string
  text: string
  html?: string
  from?: string
}

export async function sendEmail(
  params: EmailParams,
): Promise<{ success: boolean; message?: string; messageId?: string }> {
  // Check if AWS SES is configured
  const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY
  const fromEmail = params.from || process.env.AWS_SES_FROM_EMAIL

  if (!accessKeyId || !secretAccessKey || !fromEmail) {
    console.log("AWS SES not configured, logging submission for manual follow-up")
    console.log("Email details:", {
      to: params.to,
      subject: params.subject,
      body: params.text,
      timestamp: new Date().toISOString(),
    })
    return {
      success: false,
      message: "Email service not configured - submission logged for manual follow-up",
    }
  }

  try {
    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const toAddresses = Array.isArray(params.to) ? params.to : [params.to]

    for (const address of toAddresses) {
      if (!emailRegex.test(address)) {
        throw new Error(`Invalid email address: ${address}`)
      }
    }

    if (!emailRegex.test(fromEmail)) {
      throw new Error(`Invalid from email address: ${fromEmail}`)
    }

    // Use fetch to call AWS SES API directly
    const endpoint = `https://email.${region}.amazonaws.com/`

    // Create the email parameters
    const emailParams = new URLSearchParams({
      Action: "SendEmail",
      Version: "2010-12-01",
      Source: fromEmail,
      "Message.Subject.Data": params.subject,
      "Message.Body.Text.Data": params.text,
    })

    if (params.html) {
      emailParams.append("Message.Body.Html.Data", params.html)
    }

    // Add destinations
    toAddresses.forEach((address, index) => {
      emailParams.append(`Destination.ToAddresses.member.${index + 1}`, address)
    })

    // Create AWS signature v4
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "")
    const date = timestamp.substr(0, 8)

    // Create canonical request
    const method = "POST"
    const canonicalUri = "/"
    const canonicalQueryString = ""
    const canonicalHeaders = `host:email.${region}.amazonaws.com\nx-amz-date:${timestamp}\n`
    const signedHeaders = "host;x-amz-date"

    // Create payload
    const payload = emailParams.toString()

    // Create string to sign
    const algorithm = "AWS4-HMAC-SHA256"
    const credentialScope = `${date}/${region}/ses/aws4_request`
    const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${await sha256(payload)}`
    const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${await sha256(canonicalRequest)}`

    // Create signing key
    const kDate = await hmacSha256(`AWS4${secretAccessKey}`, date)
    const kRegion = await hmacSha256(kDate, region)
    const kService = await hmacSha256(kRegion, "ses")
    const kSigning = await hmacSha256(kService, "aws4_request")

    // Create signature
    const signature = await hmacSha256(kSigning, stringToSign, "hex")

    // Create authorization header
    const authorization = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

    console.log("Sending email via AWS SES API:", {
      to: toAddresses,
      subject: params.subject,
      from: fromEmail,
      region: region,
    })

    // Make the request
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Amz-Date": timestamp,
        Authorization: authorization,
      },
      body: payload,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("AWS SES API Error:", errorText)

      let errorMessage = `AWS SES API error: ${response.status} ${response.statusText}`

      if (errorText.includes("Email address is not verified")) {
        errorMessage = `The sender email ${fromEmail} is not verified in AWS SES. Please verify it in the AWS SES console.`
      } else if (errorText.includes("MessageRejected")) {
        errorMessage = "Email was rejected by AWS SES. Check that both sender and recipient emails are verified."
      } else if (errorText.includes("InvalidParameterValue")) {
        errorMessage = "Invalid email parameters. Check that all email addresses are valid."
      }

      throw new Error(errorMessage)
    }

    const responseText = await response.text()

    // Parse the XML response to get MessageId
    const messageIdMatch = responseText.match(/<MessageId>([^<]+)<\/MessageId>/)
    const messageId = messageIdMatch ? messageIdMatch[1] : "unknown"

    console.log("Email sent successfully via AWS SES API:", messageId)

    return {
      success: true,
      message: "Email sent successfully",
      messageId: messageId,
    }
  } catch (error) {
    console.error("AWS SES Error:", error)

    // Log the submission for manual follow-up even if email fails
    console.log("Email failed, logging for manual follow-up:", {
      to: params.to,
      subject: params.subject,
      body: params.text,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    })

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function testAWSSESConnection() {
  try {
    console.log("Testing AWS SES connection using direct API calls...")

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

    // Test SES connection by checking send quota using direct API call
    try {
      const endpoint = `https://email.${region}.amazonaws.com/`

      // Create the parameters for GetSendQuota
      const quotaParams = new URLSearchParams({
        Action: "GetSendQuota",
        Version: "2010-12-01",
      })

      // Create AWS signature v4 for quota check
      const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "")
      const date = timestamp.substr(0, 8)

      const method = "POST"
      const canonicalUri = "/"
      const canonicalQueryString = ""
      const canonicalHeaders = `host:email.${region}.amazonaws.com\nx-amz-date:${timestamp}\n`
      const signedHeaders = "host;x-amz-date"

      const payload = quotaParams.toString()

      const algorithm = "AWS4-HMAC-SHA256"
      const credentialScope = `${date}/${region}/ses/aws4_request`
      const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${await sha256(payload)}`
      const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${await sha256(canonicalRequest)}`

      const kDate = await hmacSha256(`AWS4${secretAccessKey!}`, date)
      const kRegion = await hmacSha256(kDate, region!)
      const kService = await hmacSha256(kRegion, "ses")
      const kSigning = await hmacSha256(kService, "aws4_request")

      const signature = await hmacSha256(kSigning, stringToSign, "hex")
      const authorization = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

      console.log("Testing AWS SES quota check...")

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Amz-Date": timestamp,
          Authorization: authorization,
        },
        body: payload,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("AWS SES quota check failed:", errorText)

        // Parse common AWS errors
        let helpMessage = ""
        if (errorText.includes("InvalidParameterValue")) {
          helpMessage = " (Check if your from email is verified in SES)"
        } else if (errorText.includes("SignatureDoesNotMatch")) {
          helpMessage = " (Check AWS credentials)"
        } else if (errorText.includes("AccessDenied")) {
          helpMessage = " (Check IAM permissions for SES)"
        }

        return {
          success: false,
          message: `AWS SES API test failed: ${response.status} ${response.statusText}${helpMessage}`,
          details: envCheck,
        }
      }

      const responseText = await response.text()
      console.log("AWS SES quota response:", responseText)

      // Parse quota information from XML response
      const maxSendRateMatch = responseText.match(/<MaxSendRate>([^<]+)<\/MaxSendRate>/)
      const max24HourSendMatch = responseText.match(/<Max24HourSend>([^<]+)<\/Max24HourSend>/)
      const sentLast24HoursMatch = responseText.match(/<SentLast24Hours>([^<]+)<\/SentLast24Hours>/)

      const maxSendRate = maxSendRateMatch ? maxSendRateMatch[1] : "unknown"
      const max24HourSend = max24HourSendMatch ? max24HourSendMatch[1] : "unknown"
      const sentLast24Hours = sentLast24HoursMatch ? sentLast24HoursMatch[1] : "unknown"

      console.log("AWS SES quota check successful:", {
        maxSendRate,
        max24HourSend,
        sentLast24Hours,
      })

      return {
        success: true,
        message: `AWS SES is working correctly! 

Configuration Details:
- Region: ${region}
- From Email: ${fromEmail}

Send Quota Information:
- Daily Limit: ${max24HourSend} emails/24h
- Send Rate: ${maxSendRate} emails/second
- Used Today: ${sentLast24Hours} emails

The email system is ready to use!`,
        details: envCheck,
      }
    } catch (testError) {
      console.error("AWS SES test error:", testError)
      const errorMessage = testError instanceof Error ? testError.message : "Unknown test error"

      return {
        success: false,
        message: `AWS SES test failed: ${errorMessage}`,
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

// Helper functions for AWS signature (using Web Crypto API)
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function hmacSha256(
  key: string | Uint8Array,
  message: string,
  encoding: "hex" | "binary" = "binary",
): Promise<string | Uint8Array> {
  const keyBuffer = typeof key === "string" ? new TextEncoder().encode(key) : key
  const messageBuffer = new TextEncoder().encode(message)

  const cryptoKey = await crypto.subtle.importKey("raw", keyBuffer, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageBuffer)
  const signatureArray = new Uint8Array(signature)

  if (encoding === "hex") {
    return Array.from(signatureArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  return signatureArray
}

// Legacy exports for backward compatibility
export const sendEmailWithSES = sendEmail
export const sendEmailLegacy = sendEmail
