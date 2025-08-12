"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyCaptcha } from "@/lib/captcha"
import { createOrUpdateVisitor } from "@/lib/database/visitors"
import { validateAffiliateCode } from "@/lib/database/affiliates"
import { createFormSubmission } from "@/lib/database/form-submissions"
import { headers } from "next/headers"

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const affiliate = formData.get("affiliate") as string
    const message = formData.get("message") as string
    const recaptchaToken = formData.get("recaptchaToken") as string
    const referrer = formData.get("referrer") as string
    const utmSource = formData.get("utmSource") as string
    const utmCampaign = formData.get("utmCampaign") as string
    const pageViews = formData.get("pageViews") as string
    const sessionId = formData.get("sessionId") as string
    const userAgent = formData.get("userAgent") as string
    const landingPage = formData.get("landingPage") as string

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return {
        success: false,
        error: true,
        message: "Please fill in all required fields.",
      }
    }

    // Verify reCAPTCHA
    const captchaResult = await verifyCaptcha(recaptchaToken || "")
    if (!captchaResult.success) {
      return {
        success: false,
        error: true,
        message: "Please complete the reCAPTCHA verification.",
      }
    }

    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"

    let visitorId: string | undefined
    if (sessionId) {
      const visitorResult = await createOrUpdateVisitor({
        sessionId,
        ipAddress,
        userAgent,
        referrer,
        landingPage,
        pageViews: Number.parseInt(pageViews) || 1,
      })

      if (visitorResult.success && visitorResult.data) {
        visitorId = visitorResult.data.id
      }
    }

    let validAffiliate: { id: string; code: string; name: string } | null = null
    if (affiliate) {
      const affiliateResult = await validateAffiliateCode(affiliate)
      if (affiliateResult.success && affiliateResult.affiliate) {
        validAffiliate = {
          id: affiliateResult.affiliate.id,
          code: affiliateResult.affiliate.affiliateCode,
          name: affiliateResult.affiliate.affiliateName,
        }
      }
    }

    const submissionResult = await createFormSubmission({
      visitorId,
      affiliateId: validAffiliate?.id,
      formType: "contact",
      firstName,
      lastName,
      email,
      phone,
      company,
      message,
      affiliateReference: affiliate,
      sourcePage: landingPage || referrer,
      utmSource,
      utmCampaign,
      ipAddress,
      userAgent,
      formData: {
        referrer,
        pageViews: Number.parseInt(pageViews) || 1,
        sessionId,
      },
    })

    if (!submissionResult.success) {
      console.error("Failed to store form submission:", submissionResult.error)
      // Continue with email sending even if database storage fails
    }

    // Prepare email content
    const emailSubject = "New Contact Form Submission - Kuhlekt"
    const emailBody = `
      New contact form submission:
      
      Name: ${firstName} ${lastName}
      Email: ${email}
      Company: ${company || "Not provided"}
      Phone: ${phone || "Not provided"}
      ${validAffiliate ? `Affiliate: ${validAffiliate.code} (${validAffiliate.name})` : ""}
      Message: ${message || "No message provided"}
      
      Visitor Tracking:
      - Session ID: ${sessionId || "Not available"}
      - IP Address: ${ipAddress}
      - Referrer: ${referrer || "Not available"}
      - UTM Source: ${utmSource || "Not available"}
      - UTM Campaign: ${utmCampaign || "Not available"}
      - Page Views: ${pageViews || "Not available"}
      - Landing Page: ${landingPage || "Not available"}
      
      Database Status: ${submissionResult.success ? "Stored successfully" : "Storage failed"}
      Submitted at: ${new Date().toISOString()}
    `

    // Send email
    await sendEmailWithSES({
      to: [process.env.AWS_SES_FROM_EMAIL || "contact@kuhlekt.com"],
      subject: emailSubject,
      body: emailBody,
      replyTo: email,
    })

    return {
      success: true,
      error: false,
      message: "Thank you for your message! We'll get back to you soon.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      error: true,
      message: "Something went wrong. Please try again later.",
    }
  }
}

export async function testAWSSES() {
  try {
    console.log("Testing AWS SES connection...")

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

    // Check if all required variables are present
    const allConfigured = Object.values(envCheck).every(Boolean)

    if (!allConfigured) {
      return {
        success: false,
        message: "AWS SES is not fully configured. Missing environment variables.",
        details: envCheck,
      }
    }

    // Test connection by attempting to get send quota
    try {
      const endpoint = `https://email.${region}.amazonaws.com/`

      // Create test parameters
      const testParams = new URLSearchParams({
        Action: "GetSendQuota",
        Version: "2010-12-01",
      })

      // Create AWS signature v4
      const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "")
      const date = timestamp.substr(0, 8)

      const method = "POST"
      const canonicalUri = "/"
      const canonicalQueryString = ""
      const canonicalHeaders = `host:email.${region}.amazonaws.com\nx-amz-date:${timestamp}\n`
      const signedHeaders = "host;x-amz-date"

      const payload = testParams.toString()

      const algorithm = "AWS4-HMAC-SHA256"
      const credentialScope = `${date}/${region}/ses/aws4_request`
      const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${await sha256(payload)}`
      const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${await sha256(canonicalRequest)}`

      const kDate = await hmacSha256(`AWS4${secretAccessKey}`, date)
      const kRegion = await hmacSha256(kDate, region)
      const kService = await hmacSha256(kRegion, "ses")
      const kSigning = await hmacSha256(kService, "aws4_request")

      const signature = await hmacSha256(kSigning, stringToSign, "hex")
      const authorization = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

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
        console.error("AWS SES test failed:", errorText)
        return {
          success: false,
          message: `AWS SES test failed: ${response.status} ${response.statusText}`,
          details: envCheck,
        }
      }

      const responseText = await response.text()
      console.log("AWS SES test successful:", responseText)

      return {
        success: true,
        message: `AWS SES is working correctly!\n\nConfiguration Details:\n- Region: ${region}\n- From Email: ${fromEmail}\n\nThe email system is ready to use!`,
        details: envCheck,
      }
    } catch (testError) {
      console.error("AWS SES test error:", testError)
      return {
        success: false,
        message: `AWS SES test failed: ${testError instanceof Error ? testError.message : "Unknown error"}`,
        details: envCheck,
      }
    }
  } catch (error) {
    console.error("Test function error:", error)
    return {
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      details: {
        region: false,
        accessKey: false,
        secretKey: false,
        fromEmail: false,
      },
    }
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
