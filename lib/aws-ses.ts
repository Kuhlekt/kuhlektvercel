// AWS SES implementation using direct API calls (edge runtime compatible)

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

// AWS Signature Version 4 implementation using Web Crypto API
async function createSignature(
  method: string,
  url: string,
  headers: Record<string, string>,
  payload: string,
  region: string,
  service: string,
  accessKey: string,
  secretKey: string,
): Promise<string> {
  const encoder = new TextEncoder()

  // Create canonical request
  const canonicalUri = new URL(url).pathname
  const canonicalQueryString = ""
  const canonicalHeaders = Object.entries(headers)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key.toLowerCase()}:${value}`)
    .join("\n")
  const signedHeaders = Object.keys(headers)
    .sort()
    .map((key) => key.toLowerCase())
    .join(";")

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    "",
    signedHeaders,
    await sha256(payload),
  ].join("\n")

  // Create string to sign
  const date = headers["x-amz-date"]
  const dateStamp = date.substring(0, 8)
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const algorithm = "AWS4-HMAC-SHA256"

  const stringToSign = [algorithm, date, credentialScope, await sha256(canonicalRequest)].join("\n")

  // Calculate signature
  const signingKey = await getSignatureKey(secretKey, dateStamp, region, service)
  const signature = await hmacSha256(signingKey, stringToSign)

  return `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
}

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function hmacSha256(key: CryptoKey, message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const signature = await crypto.subtle.sign("HMAC", key, data)
  const signatureArray = Array.from(new Uint8Array(signature))
  return signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function getSignatureKey(
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string,
): Promise<CryptoKey> {
  const encoder = new TextEncoder()

  const kDate = await crypto.subtle.importKey(
    "raw",
    encoder.encode("AWS4" + key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )

  const kRegion = await crypto.subtle.importKey(
    "raw",
    new Uint8Array(await crypto.subtle.sign("HMAC", kDate, encoder.encode(dateStamp))),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )

  const kService = await crypto.subtle.importKey(
    "raw",
    new Uint8Array(await crypto.subtle.sign("HMAC", kRegion, encoder.encode(regionName))),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )

  const kSigning = await crypto.subtle.importKey(
    "raw",
    new Uint8Array(await crypto.subtle.sign("HMAC", kService, encoder.encode(serviceName))),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )

  return await crypto.subtle.importKey(
    "raw",
    new Uint8Array(await crypto.subtle.sign("HMAC", kSigning, encoder.encode("aws4_request"))),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
}

export async function sendEmailViaSES(params: EmailParams): Promise<SendEmailResult> {
  try {
    const accessKey = process.env.AWS_SES_ACCESS_KEY_ID
    const secretKey = process.env.AWS_SES_SECRET_ACCESS_KEY
    const region = process.env.AWS_SES_REGION || "us-east-1"
    const fromEmail = process.env.AWS_SES_FROM_EMAIL

    if (!accessKey || !secretKey || !fromEmail) {
      throw new Error("AWS SES credentials not configured")
    }

    const toAddresses = Array.isArray(params.to) ? params.to : [params.to]
    const endpoint = `https://email.${region}.amazonaws.com/`

    // Prepare the request payload
    const payload = new URLSearchParams({
      Action: "SendEmail",
      Source: fromEmail,
      "Message.Subject.Data": params.subject,
      "Message.Subject.Charset": "UTF-8",
      "Message.Body.Text.Data": params.body,
      "Message.Body.Text.Charset": "UTF-8",
      Version: "2010-12-01",
    })

    // Add destinations
    toAddresses.forEach((email, index) => {
      payload.append(`Destination.ToAddresses.member.${index + 1}`, email)
    })

    if (params.replyTo) {
      payload.append("ReplyToAddresses.member.1", params.replyTo)
    }

    const payloadString = payload.toString()

    // Prepare headers
    const now = new Date()
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "")

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      Host: `email.${region}.amazonaws.com`,
      "X-Amz-Date": amzDate,
    }

    // Create authorization header
    const authorization = await createSignature(
      "POST",
      endpoint,
      headers,
      payloadString,
      region,
      "ses",
      accessKey,
      secretKey,
    )

    // Send the request
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: authorization,
      },
      body: payloadString,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`AWS SES API error: ${response.status} ${errorText}`)
    }

    const responseText = await response.text()

    // Extract message ID from XML response
    const messageIdMatch = responseText.match(/<MessageId>([^<]+)<\/MessageId>/)
    const messageId = messageIdMatch ? messageIdMatch[1] : undefined

    return {
      success: true,
      messageId,
    }
  } catch (error) {
    console.error("AWS SES send error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function testAWSSES(): Promise<{ success: boolean; message: string }> {
  try {
    const testEmail = process.env.AWS_SES_FROM_EMAIL || "test@example.com"

    const result = await sendEmailViaSES({
      to: testEmail,
      subject: "AWS SES Test Email",
      body: "This is a test email to verify AWS SES configuration.",
    })

    if (result.success) {
      return {
        success: true,
        message: `Test email sent successfully. Message ID: ${result.messageId}`,
      }
    } else {
      return {
        success: false,
        message: `Test email failed: ${result.error}`,
      }
    }
  } catch (error) {
    return {
      success: false,
      message: `Test email error: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
