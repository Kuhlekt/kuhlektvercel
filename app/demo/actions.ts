"use server"

import { verifyCaptcha } from "@/lib/captcha"
import { sendEmail } from "@/lib/email-service"
import { validateAffiliate } from "@/lib/affiliate-validation"

interface DemoFormState {
  success: boolean
  message: string
  errors: Record<string, string>
}

export async function submitDemoForm(prevState: DemoFormState, formData: FormData): Promise<DemoFormState> {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const jobTitle = formData.get("jobTitle") as string
    const phone = formData.get("phone") as string
    const companySize = formData.get("companySize") as string
    const industry = formData.get("industry") as string
    const currentArVolume = formData.get("currentArVolume") as string
    const affiliate = formData.get("affiliate") as string
    const currentChallenges = formData.get("currentChallenges") as string
    const timeframe = formData.get("timeframe") as string
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

    if (!company?.trim()) {
      errors.company = "Company is required"
    }

    if (!jobTitle?.trim()) {
      errors.jobTitle = "Job title is required"
    }

    if (!companySize?.trim()) {
      errors.companySize = "Company size is required"
    }

    if (!industry?.trim()) {
      errors.industry = "Industry is required"
    }

    if (phone && !/^[+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-$$$$]/g, ""))) {
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
      <h2>New Demo Request</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Job Title:</strong> ${jobTitle}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <p><strong>Company Size:</strong> ${companySize}</p>
      <p><strong>Industry:</strong> ${industry}</p>
      <p><strong>Current AR Volume:</strong> ${currentArVolume || "Not specified"}</p>
      <p><strong>Implementation Timeframe:</strong> ${timeframe || "Not specified"}</p>
      
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
      
      <p><strong>Current AR Challenges:</strong></p>
      <p>${currentChallenges || "Not specified"}</p>
      
      <hr style="margin: 20px 0;">
      <h3>Visitor Tracking Information</h3>
      <p><strong>Referrer:</strong> ${referrer || "Direct"}</p>
      <p><strong>UTM Source:</strong> ${utmSource || "None"}</p>
      <p><strong>UTM Campaign:</strong> ${utmCampaign || "None"}</p>
      <p><strong>Page Views:</strong> ${pageViews || "Unknown"}</p>
      <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
    `

    const userEmailContent = `
      <h2>Thank you for requesting a demo!</h2>
      <p>Dear ${firstName},</p>
      <p>Thank you for your interest in Kuhlekt's AR automation solutions. We have received your demo request and will contact you within 24 hours to schedule your personalized demonstration.</p>
      
      ${
        affiliateInfo?.isValid
          ? `
        <div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #22c55e; margin: 15px 0;">
          <h3 style="color: #16a34a; margin: 0 0 10px 0;">🎉 Affiliate Discount Applied!</h3>
          <p style="margin: 5px 0;">Your affiliate code <strong>${affiliateInfo.code}</strong> has been validated.</p>
          <p style="margin: 5px 0;">You're eligible for a <strong>${affiliateInfo.discount}% discount</strong> on our services!</p>
          <p style="margin: 5px 0;">Our team will include this discount in your personalized quote during the demo.</p>
        </div>
      `
          : ""
      }
      
      <p>Here's a summary of your demo request:</p>
      <ul>
        <li><strong>Name:</strong> ${firstName} ${lastName}</li>
        <li><strong>Company:</strong> ${company}</li>
        <li><strong>Job Title:</strong> ${jobTitle}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone || "Not provided"}</li>
        <li><strong>Company Size:</strong> ${companySize}</li>
        <li><strong>Industry:</strong> ${industry}</li>
        <li><strong>Implementation Timeframe:</strong> ${timeframe || "Not specified"}</li>
      </ul>
      
      <p>During the demo, we'll show you how Kuhlekt can:</p>
      <ul>
        <li>Automate your accounts receivable processes</li>
        <li>Reduce DSO (Days Sales Outstanding)</li>
        <li>Improve cash flow management</li>
        <li>Streamline customer communications</li>
        <li>Provide real-time AR analytics and reporting</li>
      </ul>
      
      <p>We look forward to showing you how Kuhlekt can transform your AR operations!</p>
      
      <p>Best regards,<br>The Kuhlekt Team</p>
    `

    // Send emails
    await Promise.all([
      sendEmail({
        to: process.env.AWS_SES_FROM_EMAIL!,
        subject: `New Demo Request - ${firstName} ${lastName} (${company})${affiliateInfo?.isValid ? ` - ${affiliateInfo.code} (${affiliateInfo.discount}% discount)` : ""}`,
        html: adminEmailContent,
      }),
      sendEmail({
        to: email,
        subject: "Your Kuhlekt Demo Request Confirmation",
        html: userEmailContent,
      }),
    ])

    return {
      success: true,
      message: affiliateInfo?.isValid
        ? `Thank you for requesting a demo! We'll contact you within 24 hours to schedule your personalized demonstration. Your affiliate code ${affiliateInfo.code} has been applied for a ${affiliateInfo.discount}% discount.`
        : "Thank you for requesting a demo! We'll contact you within 24 hours to schedule your personalized demonstration.",
      errors: {},
    }
  } catch (error) {
    console.error("Demo form submission error:", error)
    return {
      success: false,
      message: "There was an error processing your demo request. Please try again.",
      errors: {},
    }
  }
}

// Export alias for backward compatibility
export const submitDemoRequest = submitDemoForm
