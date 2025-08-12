"use server"

import { sendEmail } from "@/lib/email-service"
import { verifyCaptcha } from "@/lib/captcha"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

export async function submitDemoForm(prevState: any, formData: FormData) {
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

    // Validate required fields
    const errors: Record<string, string> = {}

    if (!firstName?.trim()) errors.firstName = "First name is required"
    if (!lastName?.trim()) errors.lastName = "Last name is required"
    if (!email?.trim()) errors.email = "Email is required"
    if (!company?.trim()) errors.company = "Company is required"
    if (!jobTitle?.trim()) errors.jobTitle = "Job title is required"
    if (!industry?.trim()) errors.industry = "Industry is required"

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, message: "Please fix the errors below", errors }
    }

    // Verify reCAPTCHA
    if (recaptchaToken) {
      const captchaResult = await verifyCaptcha(recaptchaToken)
      if (!captchaResult.success) {
        return { success: false, message: "reCAPTCHA verification failed. Please try again." }
      }
    }

    // Validate affiliate code if provided
    let affiliateInfo = null
    if (affiliate?.trim()) {
      const validation = validateAffiliateCode(affiliate.trim())
      if (validation.isValid && validation.info) {
        affiliateInfo = validation.info
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
      <p><strong>Company Size:</strong> ${companySize || "Not specified"}</p>
      <p><strong>Industry:</strong> ${industry}</p>
      <p><strong>Current AR Volume:</strong> ${currentArVolume || "Not specified"}</p>
      <p><strong>Implementation Timeframe:</strong> ${timeframe || "Not specified"}</p>
      
      ${
        affiliateInfo
          ? `
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="color: #1976d2; margin: 0 0 10px 0;">🎯 Affiliate Code Used</h3>
          <p><strong>Code:</strong> ${affiliate.trim().toUpperCase()}</p>
          <p><strong>Discount:</strong> ${affiliateInfo.discount}%</p>
          <p><strong>Description:</strong> ${affiliateInfo.description}</p>
        </div>
      `
          : ""
      }
      
      <p><strong>Current Challenges:</strong></p>
      <p>${currentChallenges || "None specified"}</p>
      
      <hr style="margin: 20px 0;">
      <h3>Visitor Tracking Information</h3>
      <p><strong>Referrer:</strong> ${referrer || "Direct"}</p>
      <p><strong>UTM Source:</strong> ${utmSource || "None"}</p>
      <p><strong>UTM Campaign:</strong> ${utmCampaign || "None"}</p>
      <p><strong>Page Views:</strong> ${pageViews || "Unknown"}</p>
      <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
    `

    const userEmailContent = `
      <h2>Thank you for requesting a Kuhlekt demo!</h2>
      <p>Dear ${firstName},</p>
      <p>Thank you for your interest in Kuhlekt's AR automation solutions. We have received your demo request and will contact you within 24 hours to schedule your personalized demonstration.</p>
      
      ${
        affiliateInfo
          ? `
        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="color: #2e7d32; margin: 0 0 10px 0;">🎉 Affiliate Discount Applied!</h3>
          <p>Excellent! Your affiliate code <strong>${affiliate.trim().toUpperCase()}</strong> is valid and provides a <strong>${affiliateInfo.discount}% discount</strong> on our services.</p>
          <p>${affiliateInfo.description}</p>
          <p>We'll make sure to apply this discount to any proposals we prepare for ${company}.</p>
        </div>
      `
          : ""
      }
      
      <p><strong>Your demo request details:</strong></p>
      <ul>
        <li>Name: ${firstName} ${lastName}</li>
        <li>Company: ${company}</li>
        <li>Job Title: ${jobTitle}</li>
        <li>Industry: ${industry}</li>
        <li>Company Size: ${companySize || "Not specified"}</li>
        <li>Implementation Timeframe: ${timeframe || "Not specified"}</li>
      </ul>
      
      <p>During the demo, we'll show you how Kuhlekt can help:</p>
      <ul>
        <li>Automate your accounts receivable processes</li>
        <li>Reduce DSO (Days Sales Outstanding)</li>
        <li>Improve cash flow management</li>
        <li>Streamline collections workflows</li>
        <li>Provide real-time AR analytics and reporting</li>
      </ul>
      
      <p>If you have any questions before our call, feel free to reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/help">help center</a>.</p>
      
      <p>Best regards,<br>The Kuhlekt Team</p>
    `

    // Send emails
    await Promise.all([
      sendEmail({
        to: process.env.AWS_SES_FROM_EMAIL!,
        subject: `New Demo Request from ${firstName} ${lastName} at ${company}${affiliateInfo ? " (Affiliate Code Used)" : ""}`,
        html: adminEmailContent,
      }),
      sendEmail({
        to: email,
        subject: `Your Kuhlekt Demo Request Confirmation${affiliateInfo ? " - Discount Applied!" : ""}`,
        html: userEmailContent,
      }),
    ])

    return {
      success: true,
      message: affiliateInfo
        ? `Thank you for requesting a demo! We'll contact you within 24 hours to schedule your personalized demonstration. Your ${affiliateInfo.discount}% affiliate discount has been noted.`
        : "Thank you for requesting a demo! We'll contact you within 24 hours to schedule your personalized demonstration.",
    }
  } catch (error) {
    console.error("Demo form submission error:", error)
    return {
      success: false,
      message: "There was an error processing your demo request. Please try again later.",
    }
  }
}

// Export alias for backward compatibility
export const submitDemoRequest = submitDemoForm
