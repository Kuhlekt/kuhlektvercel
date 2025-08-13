interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmailWithSES({ to, subject, text, html }: EmailOptions) {
  const region = process.env.AWS_SES_REGION
  const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY
  const fromEmail = process.env.AWS_SES_FROM_EMAIL

  if (!region || !accessKeyId || !secretAccessKey || !fromEmail) {
    console.log("AWS SES not configured, logging email instead:")
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${text}`)
    return { success: true, messageId: "logged" }
  }

  try {
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "")
    const date = timestamp.substr(0, 8)
    const service = "ses"
    const region_name = region

    // Create the canonical request
    const method = "POST"
    const uri = "/"
    const queryString = ""
    const headers = {
      "content-type": "application/x-amz-json-1.0",
      "x-amz-target": "AWSSimpleEmailServiceV2.SendEmail",
      host: `email.${region}.amazonaws.com`,
      "x-amz-date": timestamp,
    }

    const payload = JSON.stringify({
      Destination: {
        ToAddresses: [to],
      },
      Content: {
        Simple: {
          Subject: {
            Data: subject,
            Charset: "UTF-8",
          },
          Body: {
            Text: {
              Data: text,
              Charset: "UTF-8",
            },
            ...(html && {
              Html: {
                Data: html,
                Charset: "UTF-8",
              },
            }),
          },
        },
      },
      FromEmailAddress: fromEmail,
    })

    // Create signature
    const canonicalHeaders = Object.entries(headers)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join("\n")

    const signedHeaders = Object.keys(headers).sort().join(";")
    const payloadHash = await sha256(payload)

    const canonicalRequest = [method, uri, queryString, canonicalHeaders, "", signedHeaders, payloadHash].join("\n")

    const algorithm = "AWS4-HMAC-SHA256"
    const credentialScope = `${date}/${region_name}/${service}/aws4_request`
    const stringToSign = [algorithm, timestamp, credentialScope, await sha256(canonicalRequest)].join("\n")

    const signingKey = await getSignatureKey(secretAccessKey, date, region_name, service)
    const signature = await hmacSha256(signingKey, stringToSign)

    const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

    // Make the request
    const response = await fetch(`https://email.${region}.amazonaws.com/`, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: authorizationHeader,
      },
      body: payload,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`AWS SES API error: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    return { success: true, messageId: result.MessageId }
  } catch (error) {
    console.error("AWS SES send error:", error)
    throw error
  }
}

// Helper functions for AWS signature
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function hmacSha256(key: ArrayBuffer, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message))
  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function getSignatureKey(
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string,
): Promise<ArrayBuffer> {
  const kDate = await hmacSha256Buffer(new TextEncoder().encode(`AWS4${key}`), dateStamp)
  const kRegion = await hmacSha256Buffer(kDate, regionName)
  const kService = await hmacSha256Buffer(kRegion, serviceName)
  const kSigning = await hmacSha256Buffer(kService, "aws4_request")
  return kSigning
}

async function hmacSha256Buffer(key: ArrayBuffer, message: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  return await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message))
}
