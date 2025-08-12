"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyCaptcha } from "@/lib/captcha"
import { normalizeAffiliateCode, getAffiliateDiscount } from "@/lib/affiliate-validation"

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const jobTitle = formData.get("jobTitle") as string
    const companySize = formData.get("companySize") as string
    const industry = formData.get("industry") as string
    const currentArVolume = formData.get("currentArVolume") as string
    const currentChallenges = formData.get("currentChallenges") as string
    const timeframe = formData.get("timeframe") as string
    const affiliate = formData.get("affiliate") as string
    const recaptchaToken = formData.get("recaptchaToken") as string
    const referrer = formData.get("referrer") as string
    const utmSource = formData.get("utmSource") as string
    const utmCampaign = formData.get("utmCampaign") as string
    const pageViews = formData.get("pageViews") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      }
    }

    // Verify CAPTCHA
    const captchaResult = await verifyCaptcha(recaptchaToken || "")
    if (!captchaResult.success) {
      return {
        success: false,
        message: captchaResult.error || "Please complete the CAPTCHA verification.",
      }
    }

    // Validate affiliate code if provided
    let validatedAffiliate: string | null = null
    let affiliateDiscount = 0
    let affiliateMessage = ""

    if (affiliate && affiliate.trim()) {
      validatedAffiliate = normalizeAffiliateCode(affiliate)
      if (validatedAffiliate) {
        affiliateDiscount = getAffiliateDiscount(validatedAffiliate)
        affiliateMessage = `Valid affiliate code applied: ${validatedAffiliate} (${affiliateDiscount}% discount)`
      } else {
        return {
          success: false,
          message: `Invalid affiliate code: "${affiliate}". Please check the code and try again.`,
        }
      }
    }

    const demoData = {
      firstName,
      lastName,
      email,
      company,
      jobTitle: jobTitle || "Not specified",
      phone: phone || "Not provided",
      companySize: companySize || "Not specified",
      industry: industry || "Not specified",
      currentArVolume: currentArVolume || "Not specified",
      currentChallenges: currentChallenges || "Not specified",
      timeframe: timeframe || "Not specified",
      affiliate: validatedAffiliate,
      affiliateDiscount,
      timestamp: new Date().toISOString(),
      captchaVerified: true,
      referrer: referrer || "Not available",
      utmSource: utmSource || "Not available",
      utmCampaign: utmCampaign || "Not available",
      pageViews: pageViews || "Not available",
    }

    console.log("Processing demo request:", {
      name: `${firstName} ${lastName}`,
      email,
      company,
      affiliate: validatedAffiliate,
      discount: affiliateDiscount,
      captchaVerified: true,
    })

    // Try to send email using AWS SES
    try {
      const emailSubject = `New Demo Request${validatedAffiliate ? ` - Affiliate: ${validatedAffiliate}` : ""} from ${firstName} ${lastName}`
      const emailBody = `
        <h2>New Demo Request from Kuhlekt Website</h2>

        <h3>Contact Information:</h3>
        <ul>
          <li><strong>Name:</strong> ${firstName} ${lastName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Company:</strong> ${company}</li>
          <li><strong>Job Title:</strong> ${jobTitle || "Not specified"}</li>
          <li><strong>Phone:</strong> ${phone || "Not provided"}</li>
        </ul>

        <h3>Company Details:</h3>
        <ul>
          <li><strong>Company Size:</strong> ${companySize || "Not specified"}</li>
          <li><strong>Industry:</strong> ${industry || "Not specified"}</li>
          <li><strong>Current AR Volume:</strong> ${currentArVolume || "Not specified"}</li>
          <li><strong>Implementation Timeframe:</strong> ${timeframe || "Not specified"}</li>
        </ul>

        ${
          validatedAffiliate
            ? `
        <h3>Affiliate Information:</h3>
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Affiliate Code:</strong> ${validatedAffiliate}</p>
          <p><strong>Discount:</strong> ${affiliateDiscount}%</p>
          <p style="color: green;"><strong>Status:</strong> ✅ Valid affiliate code</p>
        </div>
        `
            : ""
        }

        <h3>Current Challenges:</h3>
        <p>${currentChallenges || "Not specified"}</p>

        <h3>Visitor Tracking:</h3>
        <ul>
          <li><strong>Referrer:</strong> ${referrer || "Not available"}</li>
          <li><strong>UTM Source:</strong> ${utmSource || "Not available"}</li>
          <li><strong>UTM Campaign:</strong> ${utmCampaign || "Not available"}</li>
          <li><strong>Page Views:</strong> ${pageViews || "Not available"}</li>
        </ul>

        <h3>Security:</h3>
        <ul>
          <li><strong>CAPTCHA Verified:</strong> ✅ Yes</li>
          <li><strong>Timestamp:</strong> ${demoData.timestamp}</li>
        </ul>

        <hr>
        <p><strong>Action Required:</strong> Please follow up with this prospect to schedule a demo within 24 hours.</p>
      `

      const emailResult = await sendEmailWithSES({
        to: ["enquiries@kuhlekt.com"],
        subject: emailSubject,
        body: emailBody,
        replyTo: email,
      })

      if (emailResult.success) {
        console.log("Demo request email sent successfully:", emailResult.messageId)

        // Send confirmation email to user
        const confirmationSubject = "Demo Request Received - Kuhlekt AR Automation"
        const confirmationBody = `
          <h2>Thank you for your demo request!</h2>
          
          <p>Hi ${firstName},</p>
          
          <p>We've received your demo request and will contact you within 24 hours to schedule your personalized demo of Kuhlekt's AR automation platform.</p>
          
          ${
            validatedAffiliate
              ? `
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #0369a1; margin-top: 0;">🎉 Affiliate Code Applied!</h3>
            <p style="margin-bottom: 0;">Your affiliate code <strong>${validatedAffiliate}</strong> has been validated and you're eligible for a <strong>${affiliateDiscount}% discount</strong> on our services.</p>
          </div>
          `
              : ""
          }
          
          <h3>What happens next?</h3>
          <ol>
            <li>Our team will review your requirements</li>
            <li>We'll contact you at ${email} to schedule the demo</li>
            <li>During the demo, we'll show you how Kuhlekt can solve your specific AR challenges</li>
            <li>We'll provide a customized proposal based on your needs</li>
          </ol>
          
          <p>In the meantime, feel free to explore our website to learn more about our AR automation solutions.</p>
          
          <p>Best regards,<br>
          The Kuhlekt Team</p>
        `

        await sendEmailWithSES({
          to: [email],
          subject: confirmationSubject,
          body: confirmationBody,
        })
      } else {
        console.log("Email sending failed, logging demo data:", demoData)
        console.error("Email error:", emailResult.message)
      }
    } catch (emailError) {
      console.error("Error with AWS SES email service:", emailError)
      console.log("Logging demo data for manual follow-up:", demoData)
    }

    // Always return success to user
    return {
      success: true,
      message: `Thank you! Your demo request has been submitted. We'll contact you within 24 hours to schedule your personalized demo.${affiliateMessage ? ` ${affiliateMessage}` : ""}`,
    }
  } catch (error) {
    console.error("Error submitting demo request:", error)
    return {
      success: false,
      message:
        "Sorry, there was an error submitting your request. Please try again or contact us directly at enquiries@kuhlekt.com",
    }
  }
}

// Export alias for compatibility
export const submitDemoForm = submitDemoRequest
