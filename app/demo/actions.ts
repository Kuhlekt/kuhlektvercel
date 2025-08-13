"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { validateAffiliate } from "@/lib/affiliate-validation"

interface DemoFormData {
  firstName: string
  lastName: string
  businessEmail: string
  companyName: string
  phoneNumber: string
  arChallenges?: string
  affiliateCode?: string
}

export async function submitDemoRequest(formData: FormData) {
  try {
    // Extract form data
    const data: DemoFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      businessEmail: formData.get("businessEmail") as string,
      companyName: formData.get("companyName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      arChallenges: (formData.get("arChallenges") as string) || "",
      affiliateCode: (formData.get("affiliateCode") as string) || "",
    }

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "businessEmail", "companyName", "phoneNumber"]
    const missingFields = requiredFields.filter((field) => !data[field as keyof DemoFormData])

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.businessEmail)) {
      return {
        success: false,
        message: "Please enter a valid email address",
      }
    }

    // Validate affiliate code if provided
    let affiliateStatus = ""
    if (data.affiliateCode) {
      const isValidAffiliate = validateAffiliate(data.affiliateCode)
      affiliateStatus = isValidAffiliate
        ? `✅ Valid affiliate code: ${data.affiliateCode.toUpperCase()}`
        : `⚠️ Invalid affiliate code: ${data.affiliateCode}`
    }

    // Prepare email content
    const emailSubject = `New Demo Request from ${data.firstName} ${data.lastName} - ${data.companyName}`

    const emailText = `
New Demo Request Received

Contact Information:
- Name: ${data.firstName} ${data.lastName}
- Email: ${data.businessEmail}
- Company: ${data.companyName}
- Phone: ${data.phoneNumber}

AR Challenges:
${data.arChallenges || "Not specified"}

${affiliateStatus ? `Affiliate Information:\n${affiliateStatus}` : ""}

Submitted: ${new Date().toLocaleString()}
    `.trim()

    const emailHtml = `
      <h2>New Demo Request Received</h2>
      
      <h3>Contact Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
        <li><strong>Email:</strong> ${data.businessEmail}</li>
        <li><strong>Company:</strong> ${data.companyName}</li>
        <li><strong>Phone:</strong> ${data.phoneNumber}</li>
      </ul>

      <h3>AR Challenges:</h3>
      <p>${data.arChallenges || "Not specified"}</p>

      ${affiliateStatus ? `<h3>Affiliate Information:</h3><p>${affiliateStatus}</p>` : ""}

      <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
    `

    // Send email
    const emailResult = await sendEmailWithSES({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    })

    if (emailResult.success) {
      return {
        success: true,
        message:
          "Demo request submitted successfully! We'll contact you within 24 hours to schedule your personalized demo.",
      }
    } else {
      // Log the submission even if email fails
      console.log("Demo request logged for manual follow-up:", {
        ...data,
        timestamp: new Date().toISOString(),
        emailError: emailResult.message,
      })

      return {
        success: true,
        message: "Demo request received! We'll contact you within 24 hours to schedule your personalized demo.",
      }
    }
  } catch (error) {
    console.error("Demo submission error:", error)

    // Log the submission for manual follow-up
    console.log("Demo request logged for manual follow-up due to error:", {
      formData: Object.fromEntries(formData.entries()),
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    })

    return {
      success: false,
      message: "There was an error submitting your request. Please try again or contact us directly.",
    }
  }
}
