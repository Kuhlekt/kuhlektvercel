"use server"

import { trackFormSubmission, updateFormSubmissionStatus } from "@/lib/visitor-tracking"
import { trackAffiliateActivity } from "@/lib/affiliate-management"
import { verifyRecaptcha } from "@/lib/recaptcha"
import crypto from "crypto"

interface DemoFormData {
  firstName: string
  lastName: string
  email: string
  company: string
  role: string
  challenges: string
  affiliate?: string
  recaptchaToken?: string
}

function createSignature(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string,
  secretKey: string,
): string {
  const canonicalRequest = [
    method,
    url,
    Object.keys(headers)
      .sort()
      .map((key) => `${key}:${headers[key]}`)
      .join("\n"),
    body,
  ].join("\n")

  return crypto.createHmac("sha256", secretKey).update(canonicalRequest).digest("base64")
}

async function sendEmailWithSES(to: string, subject: string, body: string): Promise<boolean> {
  try {
    const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY
    const region = process.env.AWS_SES_REGION
    const fromEmail = process.env.AWS_SES_FROM_EMAIL

    if (!accessKeyId || !secretAccessKey || !region || !fromEmail) {
      console.error("Missing AWS SES configuration")
      return false
    }

    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "")
    const date = timestamp.substr(0, 8)

    const params = new URLSearchParams({
      Action: "SendEmail",
      Source: fromEmail,
      "Destination.ToAddresses.member.1": to,
      "Message.Subject.Data": subject,
      "Message.Body.Text.Data": body,
      Version: "2010-12-01",
    })

    const payload = params.toString()
    const host = `email.${region}.amazonaws.com`
    const url = `https://${host}/`

    // Create AWS Signature Version 4
    const algorithm = "AWS4-HMAC-SHA256"
    const credentialScope = `${date}/${region}/ses/aws4_request`

    const canonicalHeaders = [`host:${host}`, `x-amz-date:${timestamp}`].join("\n") + "\n"

    const signedHeaders = "host;x-amz-date"

    const payloadHash = crypto.createHash("sha256").update(payload).digest("hex")

    const canonicalRequest = ["POST", "/", "", canonicalHeaders, signedHeaders, payloadHash].join("\n")

    const stringToSign = [
      algorithm,
      timestamp,
      credentialScope,
      crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
    ].join("\n")

    const kDate = crypto.createHmac("sha256", `AWS4${secretAccessKey}`).update(date).digest()
    const kRegion = crypto.createHmac("sha256", kDate).update(region).digest()
    const kService = crypto.createHmac("sha256", kRegion).update("ses").digest()
    const kSigning = crypto.createHmac("sha256", kService).update("aws4_request").digest()

    const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex")

    const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authorizationHeader,
        "X-Amz-Date": timestamp,
        Host: host,
      },
      body: payload,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("SES API Error:", response.status, errorText)
      return false
    }

    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    // Check if formData is valid
    if (!formData || typeof formData.get !== "function") {
      console.error("Invalid formData received")
      return {
        success: false,
        message: "Invalid form data. Please try again.",
      }
    }

    const data: DemoFormData = {
      firstName: formData.get("firstName")?.toString() || "",
      lastName: formData.get("lastName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      company: formData.get("company")?.toString() || "",
      role: formData.get("role")?.toString() || "",
      challenges: formData.get("challenges")?.toString() || "",
      affiliate: formData.get("affiliate")?.toString() || undefined,
      recaptchaToken: formData.get("recaptchaToken")?.toString() || undefined,
    }

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.company) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Verify reCAPTCHA only if configured and token provided
    const isRecaptchaConfigured = !!process.env.RECAPTCHA_SECRET_KEY
    if (isRecaptchaConfigured && data.recaptchaToken) {
      const recaptchaValid = await verifyRecaptcha(data.recaptchaToken)
      if (!recaptchaValid) {
        return {
          success: false,
          message: "reCAPTCHA verification failed. Please try again.",
        }
      }
    }

    // Get client IP and user agent for tracking
    let ip = "unknown"
    let userAgent = "unknown"

    try {
      const headers = await import("next/headers")
      const headersList = headers.headers()

      if (headersList) {
        const forwarded = headersList.get("x-forwarded-for")
        ip = forwarded ? forwarded.split(",")[0] : headersList.get("x-real-ip") || "unknown"
        userAgent = headersList.get("user-agent") || "unknown"
      }
    } catch (error) {
      console.error("Error getting headers:", error)
      // Continue with default values
    }

    // Validate affiliate code if provided
    let affiliateData = null
    if (data.affiliate && data.affiliate.trim().length > 0) {
      try {
        // Use relative URL for internal API calls
        const baseUrl = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

        const affiliateResponse = await fetch(`${baseUrl}/api/validate-affiliate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Kuhlekt-Internal/1.0",
          },
          body: JSON.stringify({ code: data.affiliate.trim() }),
        })

        if (affiliateResponse.ok) {
          const result = await affiliateResponse.json()
          if (result.valid) {
            affiliateData = result.affiliate
            // Track affiliate demo form submission
            trackAffiliateActivity(result.affiliate.code, "demo")
          }
        } else {
          console.warn(`Affiliate validation failed with status: ${affiliateResponse.status}`)
        }
      } catch (error) {
        console.warn("Affiliate validation unavailable, continuing without validation:", error)
        // Continue processing the form even if affiliate validation fails
      }
    }

    // Track form submission before attempting to send email
    const submissionId = await trackFormSubmission(ip, userAgent, "demo", {
      ...data,
      affiliate: affiliateData?.code || data.affiliate,
      affiliateValid: !!affiliateData,
    })

    // Send email notification
    const subject = `New Demo Request from ${data.firstName} ${data.lastName} at ${data.company}`
    const body = `
New demo request submission:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Company: ${data.company}
Role: ${data.role}
${data.affiliate ? `Affiliate Code: ${data.affiliate}${affiliateData ? ` (Valid - ${affiliateData.name})` : " (Invalid)"}` : ""}

Challenges:
${data.challenges}

Submitted at: ${new Date().toISOString()}
IP Address: ${ip}
    `.trim()

    const emailSent = await sendEmailWithSES("enquiries@kuhlekt.com", subject, body)

    // Update submission status based on email result
    await updateFormSubmissionStatus(submissionId, emailSent ? "completed" : "failed")

    if (emailSent) {
      return {
        success: true,
        message:
          "Thank you for requesting a demo! We'll contact you within 24 hours to schedule your personalized demonstration.",
        affiliate: affiliateData?.code,
      }
    } else {
      return {
        success: false,
        message: "There was an error processing your demo request. Please try again.",
      }
    }
  } catch (error) {
    console.error("Demo form submission error:", error)
    return {
      success: false,
      message: "There was an error processing your request. Please try again.",
    }
  }
}
