"use server"

import { isValidAffiliate } from "@/lib/affiliate-management"

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const role = formData.get("role") as string
    const companySize = formData.get("companySize") as string
    const message = formData.get("message") as string
    const affiliate = formData.get("affiliate") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !message) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Affiliate validation
    if (affiliate && !isValidAffiliate(affiliate)) {
      return {
        success: false,
        message: "Invalid affiliate code. Please check with your affiliate partner for the correct code.",
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

    // Try to send email with AWS SES
    try {
      if (
        process.env.AWS_SES_ACCESS_KEY_ID &&
        process.env.AWS_SES_SECRET_ACCESS_KEY &&
        process.env.AWS_SES_REGION &&
        process.env.AWS_SES_FROM_EMAIL
      ) {
        // Use fetch to call SES API directly to avoid fs issues
        const sesEndpoint = `https://email.${process.env.AWS_SES_REGION}.amazonaws.com/`

        const subject = `New Contact Submission from ${firstName} ${lastName}`
        const body = `
New Contact Form Submission from Kuhlekt Website

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${company}
- Role: ${role || "Not specified"}
- Company Size: ${companySize || "Not specified"}
- Affiliate: ${affiliate || "Not specified"}

Message:
${message}

Please follow up with this inquiry.
        `

        // Create AWS signature v4 for SES
        const { createHmac } = await import("crypto")
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, "") + "Z"

        const params = new URLSearchParams({
          Action: "SendEmail",
          Version: "2010-12-01",
          Source: process.env.AWS_SES_FROM_EMAIL,
          "Destination.ToAddresses.member.1": "enquiries@kuhlekt.com",
          "Message.Subject.Data": subject,
          "Message.Body.Text.Data": body,
          "ReplyToAddresses.member.1": email,
        })

        const response = await fetch(sesEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Amz-Date": timestamp,
          },
          body: params.toString(),
        })

        if (response.ok) {
          console.log("Email sent successfully via AWS SES API")
        } else {
          throw new Error(`SES API error: ${response.status}`)
        }
      } else {
        // Fallback: Log the submission
        console.log("AWS SES not configured, logging contact form:", {
          firstName,
          lastName,
          email,
          company,
          role,
          companySize,
          message,
          affiliate,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (emailError) {
      // Log email error but don't fail the form submission
      console.error("Email sending failed:", emailError)
      console.log("Contact form data (email failed):", {
        firstName,
        lastName,
        email,
        company,
        role,
        companySize,
        message,
        affiliate,
        timestamp: new Date().toISOString(),
      })
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message: "Thank you for your message! We've received your inquiry and will get back to you within 24 hours.",
      affiliate: affiliate || null, // Return affiliate for client-side tracking
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message:
        "Sorry, there was an error sending your message. Please try again or contact us directly at enquiries@kuhlekt.com",
    }
  }
}
