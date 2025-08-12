"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyCaptcha } from "@/lib/captcha"
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
    const affiliate = formData.get("affiliate") as string
    const currentSolution = formData.get("currentSolution") as string
    const challenges = formData.get("challenges") as string
    const preferredTime = formData.get("preferredTime") as string
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
      errors.email = "Please enter a valid business email address"
    }

    if (!company?.trim()) {
      errors.company = "Company name is required"
    }

    if (!jobTitle?.trim()) {
      errors.jobTitle = "Job title is required"
    }

    if (!phone?.trim()) {
      errors.phone = "Phone number is required"
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-()]/g, ""))) {
      errors.phone = "Please enter a valid phone number"
    }

    if (!companySize) {
      errors.companySize = "Please select your company size"
    }

    if (!industry) {
      errors.industry = "Please select your industry"
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">New Demo Request</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #16a34a; margin: 0 0 15px 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Job Title:</strong> ${jobTitle}</p>
          <p><strong>Phone:</strong> ${phone}</p>
        </div>

        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #16a34a; margin: 0 0 15px 0;">Company Details</h3>
          <p><strong>Company Size:</strong> ${companySize}</p>
          <p><strong>Industry:</strong> ${industry}</p>
          <p><strong>Current Solution:</strong> ${currentSolution || "Not specified"}</p>
          <p><strong>Preferred Demo Time:</strong> ${preferredTime || "Flexible"}</p>
        </div>

        ${
          affiliateInfo?.isValid
            ? `
          <div style="background-color: #f0f9ff; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <h3 style="color: #1e40af; margin: 0 0 15px 0;">🎯 Affiliate Information</h3>
            <p style="margin: 5px 0;"><strong>Code:</strong> ${affiliateInfo.code}</p>
            <p style="margin: 5px 0;"><strong>Discount:</strong> ${affiliateInfo.discount}%</p>
            <p style="margin: 5px 0;"><strong>Type:</strong> ${affiliateInfo.type}</p>
            <p style="margin: 5px 0;"><strong>Description:</strong> ${affiliateInfo.description}</p>
          </div>
        `
            : ""
        }

        ${
          challenges
            ? `
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin: 0 0 15px 0;">Current Challenges</h3>
            <p style="white-space: pre-wrap;">${challenges}</p>
          </div>
        `
            : ""
        }
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
          <h3 style="color: #374151; margin: 0 0 10px 0;">Visitor Tracking Information</h3>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Referrer:</strong> ${referrer || "Direct"}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>UTM Source:</strong> ${utmSource || "None"}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>UTM Campaign:</strong> ${utmCampaign || "None"}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Page Views:</strong> ${pageViews || "Unknown"}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #166534; margin: 0 0 15px 0;">Next Steps</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Schedule demo within 24 hours</li>
            <li>Prepare industry-specific use cases for ${industry}</li>
            <li>Review ${currentSolution || "current solution"} integration options</li>
            ${affiliateInfo?.isValid ? `<li><strong>Apply ${affiliateInfo.discount}% affiliate discount to proposal</strong></li>` : ""}
          </ul>
        </div>
      </div>
    `

    const userEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Thank you for requesting a demo!</h2>
        
        <p>Dear ${firstName},</p>
        
        <p>Thank you for your interest in Kuhlekt's AR automation platform. We're excited to show you how we can help streamline your accounts receivable process at ${company}.</p>
        
        ${
          affiliateInfo?.isValid
            ? `
          <div style="background-color: #f0fdf4; padding: 20px; border-left: 4px solid #22c55e; margin: 20px 0;">
            <h3 style="color: #16a34a; margin: 0 0 15px 0;">🎉 Affiliate Discount Applied!</h3>
            <p style="margin: 5px 0;">Your affiliate code <strong>${affiliateInfo.code}</strong> has been validated.</p>
            <p style="margin: 5px 0;">You're eligible for a <strong>${affiliateInfo.discount}% discount</strong> on our services!</p>
            <p style="margin: 5px 0;">${affiliateInfo.description}</p>
            <p style="margin: 5px 0;">We'll include this discount in your personalized proposal after the demo.</p>
          </div>
        `
            : ""
        }
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #16a34a; margin: 0 0 15px 0;">What Happens Next?</h3>
          <ol style="margin: 0; padding-left: 20px;">
            <li><strong>Demo Scheduling:</strong> Our team will contact you within 24 hours to schedule your personalized demo</li>
            <li><strong>Demo Preparation:</strong> We'll prepare industry-specific examples based on your ${industry} background</li>
            <li><strong>Live Demo:</strong> 30-45 minute screen share showing Kuhlekt in action</li>
            <li><strong>Custom Proposal:</strong> Tailored pricing and implementation plan for ${company}</li>
          </ol>
        </div>

        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin: 0 0 15px 0;">Your Demo Request Summary</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Company:</strong> ${company}</li>
            <li><strong>Industry:</strong> ${industry}</li>
            <li><strong>Company Size:</strong> ${companySize}</li>
            <li><strong>Current Solution:</strong> ${currentSolution || "Not specified"}</li>
            <li><strong>Preferred Time:</strong> ${preferredTime || "Flexible"}</li>
          </ul>
        </div>

        <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0277bd; margin: 0 0 15px 0;">During Your Demo, We'll Show You How To:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Automate invoice processing and payment reminders</li>
            <li>Reduce DSO (Days Sales Outstanding) by up to 40%</li>
            <li>Improve cash flow visibility with real-time analytics</li>
            <li>Streamline customer communications and collections</li>
            <li>Integrate seamlessly with your existing ${currentSolution || "ERP"} system</li>
            <li>Set up automated workflows for your ${industry} industry</li>
          </ul>
        </div>
        
        <p>In the meantime, feel free to explore our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/solutions" style="color: #16a34a;">solutions page</a> to learn more about our AR automation capabilities.</p>
        
        <p>We look forward to showing you how Kuhlekt can transform your accounts receivable process!</p>
        
        <p>Best regards,<br>
        <strong>The Kuhlekt Demo Team</strong></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <div style="text-align: center; color: #6b7280; font-size: 12px;">
          <p>Kuhlekt - AR Automation Solutions</p>
          <p>This email was sent in response to your demo request.</p>
        </div>
      </div>
    `

    // Send emails
    await Promise.all([
      sendEmailWithSES({
        to: [process.env.AWS_SES_FROM_EMAIL || "demos@kuhlekt.com"],
        subject: `New Demo Request - ${company} (${firstName} ${lastName})${affiliateInfo?.isValid ? ` - ${affiliateInfo.code} (${affiliateInfo.discount}% discount)` : ""}`,
        body: adminEmailContent,
        replyTo: email,
      }),
      sendEmailWithSES({
        to: [email],
        subject: `Demo Scheduled - Welcome to Kuhlekt!${affiliateInfo?.isValid ? ` (${affiliateInfo.discount}% Discount Applied)` : ""}`,
        body: userEmailContent,
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
      message:
        "There was an error processing your demo request. Please try again later or contact us directly at demos@kuhlekt.com.",
      errors: {},
    }
  }
}

// Export alias for backward compatibility
export const submitDemoRequest = submitDemoForm
