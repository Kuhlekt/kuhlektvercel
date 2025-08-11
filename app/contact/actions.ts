"use server"

import { trackFormSubmission, updateFormSubmissionStatus } from "@/lib/visitor-tracking"
import { trackAffiliateActivity } from "@/lib/affiliate-management"
import { verifyRecaptcha } from "@/lib/recaptcha"
import crypto from "crypto"

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

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    // Check if formData is valid
    if (!formData || typeof formData.get !== "function") {
      console.error("Invalid formData received")
      return {
        success: false,
        message: "Invalid form data. Please try again.",
      }
    }

    const data = {
      firstName: formData.get("firstName")?.toString() || "",
      lastName: formData.get("lastName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      company: formData.get("company")?.toString() || "",
      role: formData.get("role")?.toString() || "",
      companySize: formData.get("companySize")?.toString() || "",
      message: formData.get("message")?.toString() || "",
      affiliate: formData.get("affiliate")?.toString() || undefined,
      recaptchaToken: formData.get("recaptchaToken")?.toString() || undefined,
    }

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.company || !data.message) {
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

    // Use default values for tracking
    const ip = "unknown"
    const userAgent = "unknown"

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
            // Track affiliate contact form submission
            trackAffiliateActivity(result.affiliate.code, "contact")
          }
        } else {
          console.warn(`Affiliate validation failed with status: ${affiliateResponse.status}`)
        }
      } catch (error) {
        console.warn("Affiliate validation unavailable, continuing without validation:", error)
        // Continue processing the form even if affiliate validation fails
      }
    }

    // Track form submission
    const submissionId = await trackFormSubmission(ip, userAgent, "contact", {
      ...data,
      affiliate: affiliateData?.code || data.affiliate,
      affiliateValid: !!affiliateData,
    })

    // Send email notification
    const subject = `New Contact Form Submission from ${data.firstName} ${data.lastName}`
    const body = `
New contact form submission:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Company: ${data.company}
Role: ${data.role}
Company Size: ${data.companySize}
${data.affiliate ? `Affiliate Code: ${data.affiliate}${affiliateData ? ` (Valid - ${affiliateData.name})` : " (Invalid)"}` : ""}

Message:
${data.message}

Submitted at: ${new Date().toISOString()}
    `.trim()

    const emailSent = await sendEmailWithSES("enquiries@kuhlekt.com", subject, body)

    // Update submission status based on email result
    await updateFormSubmissionStatus(submissionId, emailSent ? "completed" : "failed")

    if (emailSent) {
      return {
        success: true,
        message: "Thank you for your message. We'll get back to you soon!",
        affiliate: affiliateData?.code,
      }
    } else {
      return {
        success: false,
        message: "There was an error sending your message. Please try again.",
      }
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "There was an error processing your request. Please try again.",
    }
  }
}
