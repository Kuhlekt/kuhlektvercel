// AWS SES Email Service using fetch API (Edge Runtime compatible)

interface SendEmailParams {
  to: string
  subject: string
  htmlBody: string
  textBody?: string
}

async function createAWSSignature(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string,
  region: string,
  accessKeyId: string,
  secretAccessKey: string,
): Promise<Record<string, string>> {
  const date = new Date()
  const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, "")
  const dateStamp = amzDate.slice(0, 8)

  const service = "ses"
  const algorithm = "AWS4-HMAC-SHA256"
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`

  // Create canonical request
  const parsedUrl = new URL(url)
  const canonicalUri = parsedUrl.pathname
  const canonicalQuerystring = ""
  const canonicalHeaders = `host:${parsedUrl.host}\nx-amz-date:${amzDate}\n`
  const signedHeaders = "host;x-amz-date"

  const encoder = new TextEncoder()
  const bodyData = encoder.encode(body)
  const bodyHashBuffer = await crypto.subtle.digest("SHA-256", bodyData)
  const bodyHash = Array.from(new Uint8Array(bodyHashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${bodyHash}`

  // Create string to sign
  const canonicalRequestData = encoder.encode(canonicalRequest)
  const canonicalRequestHashBuffer = await crypto.subtle.digest("SHA-256", canonicalRequestData)
  const canonicalRequestHash = Array.from(new Uint8Array(canonicalRequestHashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${canonicalRequestHash}`

  // Calculate signature
  async function hmac(key: Uint8Array, data: string): Promise<Uint8Array> {
    const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data))
    return new Uint8Array(signature)
  }

  const kDate = await hmac(encoder.encode(`AWS4${secretAccessKey}`), dateStamp)
  const kRegion = await hmac(kDate, region)
  const kService = await hmac(kRegion, service)
  const kSigning = await hmac(kService, "aws4_request")
  const signature = await hmac(kSigning, stringToSign)

  const signatureHex = Array.from(signature)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signatureHex}`

  return {
    "X-Amz-Date": amzDate,
    Authorization: authorizationHeader,
  }
}

export async function sendEmail({ to, subject, htmlBody, textBody }: SendEmailParams): Promise<boolean> {
  try {
    const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY
    const region = process.env.AWS_SES_REGION || "us-east-1"
    const fromEmail = process.env.AWS_SES_FROM_EMAIL

    if (!accessKeyId || !secretAccessKey || !fromEmail) {
      console.error("AWS SES configuration missing:", {
        hasAccessKeyId: !!accessKeyId,
        hasSecretAccessKey: !!secretAccessKey,
        hasFromEmail: !!fromEmail,
        region,
      })
      throw new Error("AWS SES is not properly configured")
    }

    const url = `https://email.${region}.amazonaws.com/`

    // Build the email body
    const emailBody = textBody || htmlBody.replace(/<[^>]*>/g, "")

    const params: Record<string, string> = {
      Action: "SendEmail",
      Source: fromEmail,
      "Destination.ToAddresses.member.1": to,
      "Message.Subject.Data": subject,
      "Message.Body.Html.Data": htmlBody,
      "Message.Body.Text.Data": emailBody,
    }

    const body = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&")

    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
      Host: `email.${region}.amazonaws.com`,
    }

    const authHeaders = await createAWSSignature("POST", url, headers, body, region, accessKeyId, secretAccessKey)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...headers,
        ...authHeaders,
      },
      body,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("AWS SES Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      throw new Error(`AWS SES request failed: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    console.log("AWS SES Success:", responseText)
    return true
  } catch (error) {
    console.error("Error sending email via AWS SES:", error)
    throw error
  }
}
