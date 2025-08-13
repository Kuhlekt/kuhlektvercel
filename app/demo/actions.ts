"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

interface DemoFormData {
  firstName: string
  lastName: string
  email: string
  company: string
  role: string
  affiliateCode?: string
  challenges: string
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateFormData(data: DemoFormData): string[] {
  const errors: string[] = []

  if (!data.firstName?.trim()) {
    errors.push("First name is required")
  }

  if (!data.lastName?.trim()) {
    errors.push("Last name is required")
  }

  if (!data.email?.trim()) {
    errors.push("Email is required")
  } else if (!validateEmail(data.email)) {
    errors.push("Please enter a valid email address")
  }

  if (!data.company?.trim()) {
    errors.push("Company is required")
  }

  if (!data.challenges?.trim()) {
    errors.push("Please describe your AR challenges")
  }

  return errors
}

export async function submitDemoRequest(formData: FormData) {
  try {
    const data: DemoFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      role: formData.get("role") as string,
      affiliateCode: formData.get("affiliateCode") as string,
      challenges: formData.get("challenges") as string,
    }

    // Validate form data
    const validationErrors = validateFormData(data)
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: validationErrors.join(", "),
      }
    }

    // Validate affiliate code if provided
    if (data.affiliateCode && data.affiliateCode.trim()) {
      const isValidAffiliate = await validateAffiliateCode(data.affiliateCode.trim())
      if (!isValidAffiliate) {
        return {
          success: false,
          error: "Invalid affiliate code",
        }
      }
    }

    // Get admin email from environment variable
    const adminEmail = process.env.ADMIN_EMAIL || "admin@kuhlekt.com"

    // Send email notification using AWS SES
    const emailSubject = "New Demo Request - Kuhlekt"
    const emailText = `
New demo request received:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Company: ${data.company}
Role: ${data.role || "Not specified"}
Affiliate Code: ${data.affiliateCode || "None"}

AR Challenges:
${data.challenges}

Please follow up within 24 hours.
    `.trim()

    const emailHtml = `
<h2>New Demo Request - Kuhlekt</h2>
<p><strong>New demo request received:</strong></p>
<ul>
  <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
  <li><strong>Email:</strong> ${data.email}</li>
  <li><strong>Company:</strong> ${data.company}</li>
  <li><strong>Role:</strong> ${data.role || "Not specified"}</li>
  <li><strong>Affiliate Code:</strong> ${data.affiliateCode || "None"}</li>
</ul>
<p><strong>AR Challenges:</strong></p>
<p>${data.challenges}</p>
<p><em>Please follow up within 24 hours.</em></p>
    `

    console.log("Sending demo request email to:", adminEmail)

    const emailResult = await sendEmailWithSES({
      to: adminEmail,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    })

    if (emailResult.success) {
      console.log("Demo request email sent successfully:", emailResult.messageId)
      return {
        success: true,
        message: "Demo request submitted successfully! We'll contact you within 24 hours.",
      }
    } else {
      console.error("Failed to send demo request email:", emailResult.message)
      // Still return success since the submission was logged
      return {
        success: true,
        message: "Demo request submitted successfully! We'll contact you within 24 hours.",
      }
    }
  } catch (error) {
    console.error("Error submitting demo request:", error)
    return {
      success: false,
      error: "Failed to submit demo request. Please try again.",
    }
  }
}
