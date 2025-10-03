interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text: string
}

interface SendEmailResult {
  success: boolean
  message?: string
  messageId?: string
}

async function hmacSha256(key: Uint8Array, data: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data))
  return new Uint8Array(signature)
}

async function sha256(data: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data))
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function getSignatureKey(
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string,
): Promise<Uint8Array> {
  const kDate = await hmacSha256(new TextEncoder().encode(`AWS4${key}`), dateStamp)
  const kRegion = await hmacSha256(kDate, regionName)
  const kService = await hmacSha256(kRegion, serviceName)
  const kSigning = await hmacSha256(kService, "aws4_request")
  return kSigning
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  try {
    const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY
    const region = process.env.AWS_SES_REGION || "us-east-1"
    const fromEmail = process.env.AWS_SES_FROM_EMAIL

    if (!accessKeyId || !secretAccessKey || !fromEmail) {
      console.error("AWS SES configuration missing:", {
        hasAccessKey: !!accessKeyId,
        hasSecretKey: !!secretAccessKey,
        hasFromEmail: !!fromEmail,
        region,
      })
      return {
        success: false,
        message: "AWS SES is not configured. Please check environment variables.",
      }
    }

    const toAddresses = Array.isArray(params.to) ? params.to : [params.to]

    const emailParams = {
      Source: fromEmail,
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Subject: {
          Data: params.subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: params.html,
            Charset: "UTF-8",
          },
          Text: {
            Data: params.text,
            Charset: "UTF-8",
          },
        },
      },
    }

    const host = `email.${region}.amazonaws.com`
    const endpoint = `https://${host}/`
    const service = "ses"
    const method = "POST"

    const now = new Date()
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "")
    const dateStamp = amzDate.substring(0, 8)

    const canonicalUri = "/"
    const canonicalQuerystring = ""
    const canonicalHeaders = `content-type:application/x-www-form-urlencoded
host:${host}
x-amz-date:${amzDate}
`
    const signedHeaders = "content-type;host;x-amz-date"

    const requestParameters = new URLSearchParams({
      Action: "SendEmail",
      ...flattenObject(emailParams),
    }).toString()

    const payloadHash = await sha256(requestParameters)
    const canonicalRequest = `${method}
${canonicalUri}
${canonicalQuerystring}
${canonicalHeaders}
${signedHeaders}
${payloadHash}`

    const algorithm = "AWS4-HMAC-SHA256"
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
    const stringToSign = `${algorithm}
${amzDate}
${credentialScope}
${await sha256(canonicalRequest)}`

    const signingKey = await getSignatureKey(secretAccessKey, dateStamp, region, service)
    const signature = Array.from(await hmacSha256(signingKey, stringToSign))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Amz-Date": amzDate,
        Authorization: authorizationHeader,
      },
      body: requestParameters,
    })

    const responseText = await response.text()

    if (!response.ok) {
      console.error("AWS SES error:", {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      })
      return {
        success: false,
        message: `Failed to send email: ${response.statusText}`,
      }
    }

    const messageIdMatch = responseText.match(/<MessageId>(.*?)<\/MessageId>/)
    const messageId = messageIdMatch ? messageIdMatch[1] : undefined

    return {
      success: true,
      message: "Email sent successfully",
      messageId,
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

function flattenObject(obj: any, prefix = ""): Record<string, string> {
  const flattened: Record<string, string> = {}

  for (const key in obj) {
    const value = obj[key]
    const newKey = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey))
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object") {
          Object.assign(flattened, flattenObject(item, `${newKey}.member.${index + 1}`))
        } else {
          flattened[`${newKey}.member.${index + 1}`] = String(item)
        }
      })
    } else {
      flattened[newKey] = String(value)
    }
  }

  return flattened
}
