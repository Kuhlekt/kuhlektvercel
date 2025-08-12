"use server"

import { validateAffiliateCode } from "@/lib/affiliate-validation"
import { sendEmail } from "@/lib/email-service"
import { verifyCaptcha } from "@/lib/captcha"

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

    if (phone && !/^[+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-$$$$]/g, ""))) {
      errors.phone = "Please enter a valid phone number"
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
    const emailSubject = `New Contact Form Submission from ${firstName} ${lastName}`

    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      ${message ? `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>` : ""}
      
      ${
        affiliateInfo
          ? `
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h3 style="color: #1e40af; margin: 0 0 10px 0;">🎯 Affiliate Code Applied</h3>
          <p><strong>Code:</strong> ${affiliateInfo.code}</p>
          <p><strong>Discount:</strong> ${affiliateInfo.discount}%</p>
          <p><strong>Category:</strong> ${affiliateInfo.category}</p>
          <p><strong>Description:</strong> ${affiliateInfo.description}</p>
        </div>
      `
          : ""
      }
      
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Submitted at: ${new Date().toLocaleString()}<br>
        IP: ${process.env.VERCEL_FORWARDED_FOR || "Unknown"}
      </p>
    `

    // Send email notification
    await sendEmail({
      to: "contact@kuhlekt.com",
      subject: emailSubject,
      html: emailContent,
    })

    // Send confirmation email to user
    const confirmationSubject = "Thank you for contacting Kuhlekt!"
    const confirmationContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Thank you for your interest in Kuhlekt!</h2>
        
        <p>Dear ${firstName},</p>
        
        <p>We've received your contact form submission and appreciate your interest in our AR automation solutions.</p>
        
        ${
          affiliateInfo
            ? `
          <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin: 0 0 10px 0;">🎉 Great news!</h3>
            <p>Your affiliate code <strong>${affiliateInfo.code}</strong> has been validated and you're eligible for <strong>${affiliateInfo.discount}% off</strong> our services!</p>
            <p>We'll make sure to apply this discount when we prepare your custom proposal.</p>
          </div>
        `
            : ""
        }
        
        <h3>What happens next?</h3>
        <ul>
          <li>Our team will review your submission within 24 hours</li>
          <li>We'll reach out to schedule a personalized consultation</li>
          <li>You'll receive a custom proposal tailored to your needs</li>
        </ul>
        
        <p>In the meantime, feel free to explore our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/solutions" style="color: #1e40af;">solutions page</a> to learn more about how we can help streamline your accounts receivable process.</p>
        
        <p>Best regards,<br>
        The Kuhlekt Team</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Kuhlekt - AR Automation & Digital Collections<br>
          Email: contact@kuhlekt.com | Phone: 1-800-KUHLEKT<br>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #1e40af;">Visit our website</a>
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
        ? `Thank you for your message! We've validated your affiliate code ${affiliateInfo.code} for ${affiliateInfo.discount}% off. We'll be in touch within 24 hours.`
        : "Thank you for your message! We'll be in touch within 24 hours.",
      errors: {},
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "There was an error sending your message. Please try again or contact us directly.",
      errors: {},
    }
  }
}

// Test function for AWS SES
export async function testAWSSES() {
  try {
    await sendEmail({
      to: "test@example.com",
      subject: "AWS SES Test Email",
      html: "<h1>Test Email</h1><p>This is a test email from AWS SES.</p>",
    })
    return { success: true, message: "Test email sent successfully!" }
  } catch (error) {
    console.error("AWS SES test error:", error)
    return { success: false, message: "Failed to send test email", error: error.message }
  }
}
