"use server"

import { z } from "zod"
import { sendEmail } from "@/lib/email-service"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

const demoSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required").max(100),
  phone: z.string().min(1, "Phone number is required"),
  jobTitle: z.string().min(1, "Job title is required").max(100),
  companySize: z.string().min(1, "Company size is required"),
  industry: z.string().min(1, "Industry is required"),
  currentArVolume: z.string().min(1, "AR volume is required"),
  preferredTime: z.string().optional(),
  affiliateCode: z.string().optional(),
  specificInterests: z.string().optional(),
  recaptchaToken: z.string().min(1, "Please complete the reCAPTCHA verification"),
})

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification")
    return true // Allow in development
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return false
  }
}

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    const rawData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      company: formData.get("company"),
      phone: formData.get("phone"),
      jobTitle: formData.get("jobTitle"),
      companySize: formData.get("companySize"),
      industry: formData.get("industry"),
      currentArVolume: formData.get("currentArVolume"),
      preferredTime: formData.get("preferredTime"),
      affiliateCode: formData.get("affiliateCode"),
      specificInterests: formData.get("specificInterests"),
      recaptchaToken: formData.get("recaptchaToken"),
    }

    const validatedData = demoSchema.parse(rawData)

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(validatedData.recaptchaToken)
    if (!isRecaptchaValid) {
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
        errors: { recaptcha: "Verification failed" },
      }
    }

    // Validate affiliate code if provided
    let affiliateInfo = null
    if (validatedData.affiliateCode) {
      affiliateInfo = validateAffiliateCode(validatedData.affiliateCode)
    }

    // Prepare email content
    const affiliateSection = affiliateInfo
      ? `
        <div style="background-color: #f0f9ff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e40af; margin: 0 0 8px 0; font-size: 16px;">🎉 Affiliate Code Applied</h3>
          <p style="margin: 4px 0; color: #1e40af;"><strong>Code:</strong> ${affiliateInfo.code}</p>
          <p style="margin: 4px 0; color: #1e40af;"><strong>Discount:</strong> ${affiliateInfo.discount}% off</p>
          <p style="margin: 4px 0; color: #1e40af;"><strong>Category:</strong> ${affiliateInfo.category.charAt(0).toUpperCase() + affiliateInfo.category.slice(1)}</p>
          <p style="margin: 4px 0; color: #1e40af;"><strong>Description:</strong> ${affiliateInfo.description}</p>
        </div>
      `
      : validatedData.affiliateCode
        ? `
          <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #ef4444;">
            <h3 style="color: #dc2626; margin: 0 0 8px 0; font-size: 16px;">❌ Invalid Affiliate Code</h3>
            <p style="margin: 4px 0; color: #dc2626;">Code entered: <strong>${validatedData.affiliateCode}</strong></p>
            <p style="margin: 4px 0; color: #dc2626;">This code is not valid or has expired.</p>
          </div>
        `
        : ""

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Demo Request</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; text-align: center; font-size: 28px;">New Demo Request</h1>
            <p style="color: #f0f0f0; text-align: center; margin: 10px 0 0 0; font-size: 16px;">Kuhlekt AR Automation Platform</p>
          </div>
          
          ${affiliateSection}
          
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2d3748; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Contact Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568; width: 140px;">Name:</td>
                <td style="padding: 8px 0; color: #2d3748;">${validatedData.firstName} ${validatedData.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Email:</td>
                <td style="padding: 8px 0; color: #2d3748;">${validatedData.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Phone:</td>
                <td style="padding: 8px 0; color: #2d3748;">${validatedData.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Company:</td>
                <td style="padding: 8px 0; color: #2d3748;">${validatedData.company}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Job Title:</td>
                <td style="padding: 8px 0; color: #2d3748;">${validatedData.jobTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Company Size:</td>
                <td style="padding: 8px 0; color: #2d3748;">${validatedData.companySize}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Industry:</td>
                <td style="padding: 8px 0; color: #2d3748;">${validatedData.industry}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">AR Volume:</td>
                <td style="padding: 8px 0; color: #2d3748;">${validatedData.currentArVolume}</td>
              </tr>
              ${
                validatedData.preferredTime
                  ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Preferred Time:</td>
                <td style="padding: 8px 0; color: #2d3748;">${validatedData.preferredTime}</td>
              </tr>
              `
                  : ""
              }
            </table>
          </div>
          
          ${
            validatedData.specificInterests
              ? `
          <div style="background-color: #f7fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2d3748; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Specific Interests</h2>
            <div style="background-color: white; padding: 20px; border-radius: 6px; border-left: 4px solid #4299e1;">
              <p style="margin: 0; color: #2d3748; white-space: pre-wrap;">${validatedData.specificInterests}</p>
            </div>
          </div>
          `
              : ""
          }
          
          <div style="background-color: #edf2f7; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #4a5568; font-size: 14px;">
              This demo request was submitted on ${new Date().toLocaleString()}
            </p>
            ${
              affiliateInfo
                ? `
              <p style="margin: 8px 0 0 0; color: #2b6cb0; font-weight: bold; font-size: 14px;">
                ⭐ Priority Demo - ${affiliateInfo.discount}% discount applied
              </p>
            `
                : ""
            }
          </div>
        </body>
      </html>
    `

    const emailText = `
New Demo Request - Kuhlekt AR Automation

${affiliateInfo ? `🎉 AFFILIATE CODE APPLIED: ${affiliateInfo.code} (${affiliateInfo.discount}% off - ${affiliateInfo.description})` : ""}
${validatedData.affiliateCode && !affiliateInfo ? `❌ INVALID AFFILIATE CODE: ${validatedData.affiliateCode}` : ""}

Contact Information:
- Name: ${validatedData.firstName} ${validatedData.lastName}
- Email: ${validatedData.email}
- Phone: ${validatedData.phone}
- Company: ${validatedData.company}
- Job Title: ${validatedData.jobTitle}
- Company Size: ${validatedData.companySize}
- Industry: ${validatedData.industry}
- AR Volume: ${validatedData.currentArVolume}
${validatedData.preferredTime ? `- Preferred Time: ${validatedData.preferredTime}` : ""}

${validatedData.specificInterests ? `Specific Interests:\n${validatedData.specificInterests}` : ""}

---
Submitted: ${new Date().toLocaleString()}
${affiliateInfo ? `Priority Demo - ${affiliateInfo.discount}% discount applied` : ""}
    `

    // Send email
    await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "demos@kuhlekt.com",
      subject: `Demo Request: ${validatedData.firstName} ${validatedData.lastName} from ${validatedData.company}${affiliateInfo ? ` (${affiliateInfo.discount}% discount)` : ""}`,
      html: emailHtml,
      text: emailText,
    })

    return {
      success: true,
      message: affiliateInfo
        ? `Thank you for your demo request! We've received your request with your ${affiliateInfo.discount}% discount code. Our team will contact you within 24 hours to schedule your personalized demo.`
        : "Thank you for your demo request! Our team will contact you within 24 hours to schedule your personalized demo.",
      errors: {},
    }
  } catch (error) {
    console.error("Demo request error:", error)

    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path) {
          fieldErrors[err.path[0]] = err.message
        }
      })

      return {
        success: false,
        message: "Please check the form for errors.",
        errors: fieldErrors,
      }
    }

    return {
      success: false,
      message: "An error occurred while submitting your demo request. Please try again.",
      errors: {},
    }
  }
}
