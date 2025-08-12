"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyCaptcha } from "@/lib/captcha"
import { validateAffiliate } from "@/lib/affiliate-validation"

interface ContactFormState {
  success: boolean
  message: string
  errors: Record<string, string>
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
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

    // Visitor tracking data
    const referrer = formData.get("referrer") as string
    const utmSource = formData.get("utmSource") as string
    const utmCampaign = formData.get("utmCampaign") as string
    const pageViews = formData.get("pageViews") as string

    // Validation
    const errors: Record<string, string> = {}

    if (!firstName?.trim()) {
      errors.firstName = "First name is required"
    }

    if (!lastName?.trim()) {
      errors.lastName = "Last name is required"
    }

    if (!email?.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (phone && !/^[+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-()]/g, ""))) {
      errors.phone = "Please enter a valid phone number"
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Verify reCAPTCHA
    if (recaptchaToken) {
      const captchaResult = await verifyCaptcha(recaptchaToken)
      if (!captchaResult.success) {
        return {
          success: false,
          message: "reCAPTCHA verification failed. Please try again.",
          errors: {},
        }
      }
    }

    // Validate affiliate code if provided
    let affiliateInfo = null
    if (affiliate?.trim()) {
      affiliateInfo = validateAffiliate(affiliate.trim())
      if (!affiliateInfo.isValid) {
        errors.affiliate = "Invalid affiliate code"
        return {
          success: false,
          message: "Invalid affiliate code provided",
          errors,
        }
      }
    }

    // Prepare email content
    const adminEmailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || "Not provided"}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      ${
        affiliateInfo?.isValid
          ? `
        <div style="background-color: #f0f9ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 15px 0;">
          <h3 style="color: #1e40af; margin: 0 0 10px 0;">🎯 Affiliate Information</h3>
          <p style="margin: 5px 0;"><strong>Code:</strong> ${affiliateInfo.code}</p>
          <p style="margin: 5px 0;"><strong>Discount:</strong> ${affiliateInfo.discount}%</p>
          <p style="margin: 5px 0;"><strong>Type:</strong> ${affiliateInfo.type}</p>
        </div>
      `
          : ""
      }
      <p><strong>Message:</strong></p>
      <p>${message || "No message provided"}</p>
      
      <hr style="margin: 20px 0;">
      <h3>Visitor Tracking Information</h3>
      <p><strong>Referrer:</strong> ${referrer || "Direct"}</p>
      <p><strong>UTM Source:</strong> ${utmSource || "None"}</p>
      <p><strong>UTM Campaign:</strong> ${utmCampaign || "None"}</p>
      <p><strong>Page Views:</strong> ${pageViews || "Unknown"}</p>
      <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
    `

    const userEmailContent = `
      <h2>Thank you for contacting Kuhlekt!</h2>
      <p>Dear ${firstName},</p>
      <p>Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.</p>
      
      ${
        affiliateInfo?.isValid
          ? `
        <div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #22c55e; margin: 15px 0;">
          <h3 style="color: #16a34a; margin: 0 0 10px 0;">🎉 Affiliate Discount Applied!</h3>
          <p style="margin: 5px 0;">Your affiliate code <strong>${affiliateInfo.code}</strong> has been validated.</p>
          <p style="margin: 5px 0;">You're eligible for a <strong>${affiliateInfo.discount}% discount</strong> on our services!</p>
          <p style="margin: 5px 0;">Our team will include this discount in your personalized quote.</p>
        </div>
      `
          : ""
      }
      
      <p>Here's a summary of your submission:</p>
      <ul>
        <li><strong>Name:</strong> ${firstName} ${lastName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Company:</strong> ${company || "Not provided"}</li>
        <li><strong>Phone:</strong> ${phone || "Not provided"}</li>
      </ul>
      
      <p>In the meantime, feel free to explore our website to learn more about our AR automation solutions.</p>
      
      <p>Best regards,<br>The Kuhlekt Team</p>
    `

    // Send emails
    await Promise.all([
      sendEmailWithSES({
        to: [process.env.AWS_SES_FROM_EMAIL || "contact@kuhlekt.com"],
        subject: `New Contact Form Submission - ${firstName} ${lastName}${affiliateInfo?.isValid ? ` (${affiliateInfo.code} - ${affiliateInfo.discount}% discount)` : ""}`,
        body: adminEmailContent,
        replyTo: email,
      }),
      sendEmailWithSES({
        to: [email],
        subject: "Thank you for contacting Kuhlekt!",
        body: userEmailContent,
      }),
    ])

    return {
      success: true,
      message: affiliateInfo?.isValid
        ? `Thank you for your message! We'll be in touch within 24 hours. Your affiliate code ${affiliateInfo.code} has been applied for a ${affiliateInfo.discount}% discount.`
        : "Thank you for your message! We'll be in touch within 24 hours.",
      errors: {},
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "There was an error sending your message. Please try again.",
      errors: {},
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
