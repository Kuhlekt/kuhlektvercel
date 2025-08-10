"use server"

import { trackFormSubmission, updateFormSubmissionStatus } from "@/lib/visitor-tracking"
import crypto from "crypto"

interface DemoFormData {
  name: string
  email: string
  company: string
  phone: string
  employees: string
  currentSolution: string
  challenges: string
  affiliateCode?: string
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

export async function submitDemoForm(formData: FormData) {
  try {
    const data: DemoFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      phone: formData.get("phone") as string,
      employees: formData.get("employees") as string,
      currentSolution: formData.get("currentSolution") as string,
      challenges: formData.get("challenges") as string,
      affiliateCode: (formData.get("affiliateCode") as string) || undefined,
    }

    // Get client IP and user agent for tracking
    const headers = await import("next/headers")
    const headersList = headers.headers()
    const forwarded = headersList.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : headersList.get("x-real-ip") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Track form submission before attempting to send email
    const submissionId = await trackFormSubmission(ip, userAgent, "demo", data)

    // Send email notification
    const subject = `New Demo Request from ${data.name} at ${data.company}`
    const body = `
New demo request submission:

Name: ${data.name}
Email: ${data.email}
Company: ${data.company}
Phone: ${data.phone}
Number of Employees: ${data.employees}
Current Solution: ${data.currentSolution}
${data.affiliateCode ? `Affiliate Code: ${data.affiliateCode}` : ""}

Challenges:
${data.challenges}

Submitted at: ${new Date().toISOString()}
IP Address: ${ip}
    `.trim()

    const emailSent = await sendEmailWithSES("demos@kuhlekt.com", subject, body)

    // Update submission status based on email result
    await updateFormSubmissionStatus(submissionId, emailSent ? "completed" : "failed")

    if (emailSent) {
      return {
        success: true,
        message:
          "Thank you for requesting a demo! We'll contact you within 24 hours to schedule your personalized demonstration.",
      }
    } else {
      return { success: false, message: "There was an error processing your demo request. Please try again." }
    }
  } catch (error) {
    console.error("Demo form submission error:", error)
    return { success: false, message: "There was an error processing your request. Please try again." }
  }
}
