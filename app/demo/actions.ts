"use server"

import { isValidAffiliate } from "@/lib/affiliate-management"
import { trackFormSubmission } from "@/lib/visitor-tracking"
import { headers } from "next/headers"

// AWS Signature Version 4 signing function
async function signAWSRequest(
  method: string,
  url: string,
  headers: Record<string, string>,
  payload: string,
  region: string,
  service: string,
  accessKeyId: string,
  secretAccessKey: string,
) {
  const { createHmac, createHash } = await import("crypto")

  const now = new Date()
  const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, "")
  const amzDate = now.toISOString().slice(0, 19).replace(/[-:]/g, "") + "Z"

  // Create canonical request
  const canonicalUri = "/"
  const canonicalQuerystring = ""
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map((key) => `${key.toLowerCase()}:${headers[key]}\n`)
    .join("")
  const signedHeaders = Object.keys(headers)
    .sort()
    .map((key) => key.toLowerCase())
    .join(";")

  const payloadHash = createHash("sha256").update(payload).digest("hex")

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQuerystring,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n")

  // Create string to sign
  const algorithm = "AWS4-HMAC-SHA256"
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n")

  // Calculate signature
  const kDate = createHmac("sha256", `AWS4${secretAccessKey}`).update(dateStamp).digest()
  const kRegion = createHmac("sha256", kDate).update(region).digest()
  const kService = createHmac("sha256", kRegion).update(service).digest()
  const kSigning = createHmac("sha256", kService).update("aws4_request").digest()
  const signature = createHmac("sha256", kSigning).update(stringToSign).digest("hex")

  // Create authorization header
  const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return {
    ...headers,
    "X-Amz-Date": amzDate,
    Authorization: authorizationHeader,
  }
}

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const role = formData.get("role") as string
    const challenges = formData.get("challenges") as string
    const affiliate = formData.get("affiliate") as string

    // Get request headers for tracking
    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      }
    }

    // Affiliate validation
    if (affiliate && !isValidAffiliate(affiliate)) {
      return {
        success: false,
        message: "Invalid affiliate code. Please check with your affiliate partner for the correct code.",
      }
    }

    // Track form submission
    const sessionId = headersList.get("x-session-id") || "unknown"
    trackFormSubmission({
      visitorId: `visitor_${sessionId}`,
      sessionId,
      formType: "demo",
      data: {
        firstName,
        lastName,
        email,
        company,
        role,
        challenges,
        affiliate,
      },
      ipAddress,
      userAgent,
    })

    // Try to send email with AWS SES
    try {
      if (
        process.env.AWS_SES_ACCESS_KEY_ID &&
        process.env.AWS_SES_SECRET_ACCESS_KEY &&
        process.env.AWS_SES_REGION &&
        process.env.AWS_SES_FROM_EMAIL
      ) {
        const sesEndpoint = `https://email.${process.env.AWS_SES_REGION}.amazonaws.com/`

        const subject = `New Demo Request from ${firstName} ${lastName}`
        const body = `
New Demo Request from Kuhlekt Website

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${company}
- Role: ${role || "Not specified"}

Challenges:
${challenges || "Not specified"}

Affiliate Code:
${affiliate || "Not specified"}

Technical Details:
- IP Address: ${ipAddress}
- User Agent: ${userAgent}
- Session ID: ${sessionId}
- Timestamp: ${new Date().toISOString()}

Please follow up with this prospect to schedule a demo.
        `

        // Create SES API parameters
        const params = new URLSearchParams({
          Action: "SendEmail",
          Version: "2010-12-01",
          Source: process.env.AWS_SES_FROM_EMAIL,
          "Destination.ToAddresses.member.1": "enquiries@kuhlekt.com",
          "Message.Subject.Data": subject,
          "Message.Body.Text.Data": body,
          "ReplyToAddresses.member.1": email,
        })

        const payload = params.toString()
        const headers = {
          "Content-Type": "application/x-www-form-urlencoded",
          Host: `email.${process.env.AWS_SES_REGION}.amazonaws.com`,
        }

        // Sign the request
        const signedHeaders = await signAWSRequest(
          "POST",
          sesEndpoint,
          headers,
          payload,
          process.env.AWS_SES_REGION,
          "ses",
          process.env.AWS_SES_ACCESS_KEY_ID,
          process.env.AWS_SES_SECRET_ACCESS_KEY,
        )

        const response = await fetch(sesEndpoint, {
          method: "POST",
          headers: signedHeaders,
          body: payload,
        })

        if (response.ok) {
          console.log("Email sent successfully via AWS SES API")
        } else {
          const errorText = await response.text()
          throw new Error(`SES API error: ${response.status} - ${errorText}`)
        }
      } else {
        console.log("AWS SES not configured, logging demo request:", {
          firstName,
          lastName,
          email,
          company,
          role,
          challenges,
          affiliate,
          ipAddress,
          userAgent,
          sessionId,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      console.log("Demo request data (email failed):", {
        firstName,
        lastName,
        email,
        company,
        role,
        challenges,
        affiliate,
        ipAddress,
        userAgent,
        sessionId,
        timestamp: new Date().toISOString(),
      })
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message:
        "Thank you! Your demo request has been submitted. We'll contact you within 24 hours to schedule your personalized demo.",
    }
  } catch (error) {
    console.error("Error submitting demo request:", error)
    return {
      success: false,
      message:
        "Sorry, there was an error submitting your request. Please try again or contact us directly at enquiries@kuhlekt.com",
    }
  }
}
