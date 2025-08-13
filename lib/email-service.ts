"use server"

// Simple email service that works in edge runtime
interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Check if AWS SES is configured
  const region = process.env.AWS_SES_REGION
  const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY
  const fromEmail = process.env.AWS_SES_FROM_EMAIL

  if (!region || !accessKeyId || !secretAccessKey || !fromEmail) {
    console.log("AWS SES not configured, logging email for manual follow-up")
    console.log("Email details:", {
      to: options.to,
      subject: options.subject,
      body: options.text,
      timestamp: new Date().toISOString(),
    })
    return
  }

  try {
    // Use fetch to call AWS SES API directly instead of SDK
    const endpoint = `https://email.${region}.amazonaws.com/`

    // Create the email parameters
    const emailParams = {
      Action: "SendEmail",
      Version: "2010-12-01",
      Source: fromEmail,
      "Message.Subject.Data": options.subject,
      "Message.Body.Text.Data": options.text,
    }

    // Add destinations
    const emailArray = options.to.split(",").map((email) => email.trim())
    emailArray.forEach((email, index) => {
      emailParams[`Destination.ToAddresses.member.${index + 1}`] = email
    })

    // Add HTML body if provided
    if (options.html) {
      emailParams["Message.Body.Html.Data"] = options.html
    }

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
    const payload = new URLSearchParams(emailParams).toString()

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
      throw new Error(`AWS SES API error: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()

    // Parse the XML response to get MessageId
    const messageIdMatch = responseText.match(/<MessageId>([^<]+)<\/MessageId>/)
    const messageId = messageIdMatch ? messageIdMatch[1] : "unknown"

    console.log("Email sent successfully via AWS SES API:", messageId)
  } catch (error) {
    console.error("AWS SES Error:", error)
    // Log the email for manual follow-up even if sending fails
    console.log("Email failed, logging for manual follow-up:", {
      to: options.to,
      subject: options.subject,
      body: options.text,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    })
  }
}

// Helper functions for AWS signature
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
