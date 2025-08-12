"use server"

import { validateAffiliateCode } from "@/lib/affiliate-validation"
import { sendEmail } from "@/lib/email-service"
import { verifyCaptcha } from "@/lib/captcha"

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
      errors.company = "Company name is required"
    }

    if (!jobTitle?.trim()) {
      errors.jobTitle = "Job title is required"
    }

    if (!phone?.trim()) {
      errors.phone = "Phone number is required"
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-$$$$]/g, ""))) {
      errors.phone = "Please enter a valid phone number"
    }

    if (!companySize?.trim()) {
      errors.companySize = "Company size is required"
    }

    if (!industry?.trim()) {
      errors.industry = "Industry is required"
    }

    // Validate reCAPTCHA
    if (!recaptchaToken) {
      return {
        success: false,
        message: "Please complete the reCAPTCHA verification",
        errors: {},
      }
    }

    const captchaValid = await verifyCaptcha(recaptchaToken)
    if (!captchaValid) {
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
        errors: {},
      }
    }

    // Validate affiliate code if provided
    let affiliateInfo = null
    if (affiliate?.trim()) {
      affiliateInfo = validateAffiliateCode(affiliate.trim())
      if (!affiliateInfo) {
        errors.affiliate = "Invalid affiliate code"
      }
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Prepare email content
    const emailSubject = `New Demo Request from ${firstName} ${lastName} at ${company}`

    const emailContent = `
      <h2>New Demo Request</h2>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0;">Contact Information</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Job Title:</strong> ${jobTitle}</p>
      </div>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0;">Company Details</h3>
        <p><strong>Company Size:</strong> ${companySize}</p>
        <p><strong>Industry:</strong> ${industry}</p>
        ${currentSolution ? `<p><strong>Current AR Solution:</strong> ${currentSolution}</p>` : ""}
        ${preferredTime ? `<p><strong>Preferred Demo Time:</strong> ${preferredTime}</p>` : ""}
      </div>
      
      ${
        challenges
          ? `
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin: 0 0 15px 0;">Current Challenges</h3>
          <p>${challenges.replace(/\n/g, "<br>")}</p>
        </div>
      `
          : ""
      }
      
      ${
        affiliateInfo
          ? `
        <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #166534; margin: 0 0 15px 0;">🎯 Affiliate Code Applied</h3>
          <p><strong>Code:</strong> ${affiliateInfo.code}</p>
          <p><strong>Discount:</strong> ${affiliateInfo.discount}%</p>
          <p><strong>Category:</strong> ${affiliateInfo.category}</p>
          <p><strong>Description:</strong> ${affiliateInfo.description}</p>
          <p style="color: #166534; font-weight: bold;">⚠️ Remember to apply this discount in the proposal!</p>
        </div>
      `
          : ""
      }
      
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">
        Submitted at: ${new Date().toLocaleString()}<br>
        IP: ${process.env.VERCEL_FORWARDED_FOR || "Unknown"}
      </p>
    `

    // Send email notification to sales team
    await sendEmail({
      to: "demos@kuhlekt.com",
      subject: emailSubject,
      html: emailContent,
    })

    // Send confirmation email to user
    const confirmationSubject = "Your Kuhlekt Demo is Being Scheduled!"
    const confirmationContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Thank you for requesting a demo!</h2>
        
        <p>Dear ${firstName},</p>
        
        <p>We're excited to show you how Kuhlekt can transform your accounts receivable process at ${company}!</p>
        
        ${
          affiliateInfo
            ? `
          <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin: 0 0 10px 0;">🎉 Excellent news!</h3>
            <p>Your affiliate code <strong>${affiliateInfo.code}</strong> has been validated and you're eligible for <strong>${affiliateInfo.discount}% off</strong> our services!</p>
            <p>We'll make sure to include this special pricing in your custom proposal after the demo.</p>
          </div>
        `
            : ""
        }
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin: 0 0 15px 0;">What happens next?</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Our demo specialist will contact you within 24 hours</li>
            <li>We'll schedule a 30-45 minute personalized demo</li>
            <li>You'll see exactly how Kuhlekt fits your ${industry.toLowerCase()} business</li>
            <li>We'll provide a custom proposal with ROI projections</li>
          </ul>
        </div>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin: 0 0 15px 0;">Demo Highlights</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Automated invoice processing and payment reminders</li>
            <li>Real-time AR analytics and reporting</li>
            <li>Seamless integration with your current systems</li>
            <li>Customer portal and self-service options</li>
            <li>Collections workflow automation</li>
          </ul>
        </div>
        
        <p>In the meantime, feel free to explore our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/solutions" style="color: #16a34a;">solutions page</a> to learn more about our AR automation capabilities.</p>
        
        <p>Looking forward to showing you how we can help reduce your DSO and improve cash flow!</p>
        
        <p>Best regards,<br>
        The Kuhlekt Demo Team</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Kuhlekt - AR Automation & Digital Collections<br>
          Email: demos@kuhlekt.com | Phone: 1-800-KUHLEKT<br>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #16a34a;">Visit our website</a>
        </p>
      </div>
    `

    await sendEmail({
      to: email,
      subject: confirmationSubject,
      html: confirmationContent,
    })

    return {
      success: true,
      message: affiliateInfo
        ? `Thank you for requesting a demo! We've validated your affiliate code ${affiliateInfo.code} for ${affiliateInfo.discount}% off. Our team will contact you within 24 hours to schedule your personalized demo.`
        : "Thank you for requesting a demo! Our team will contact you within 24 hours to schedule your personalized demo.",
      errors: {},
    }
  } catch (error) {
    console.error("Demo form submission error:", error)
    return {
      success: false,
      message: "There was an error processing your demo request. Please try again or contact us directly.",
      errors: {},
    }
  }
}
