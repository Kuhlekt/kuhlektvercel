"use server"

import { isValidAffiliate } from "@/lib/affiliate-management"

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const role = formData.get("role") as string
    const challenges = formData.get("challenges") as string
    const affiliate = formData.get("affiliate") as string

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

    // Affiliate validation
    if (affiliate && !isValidAffiliate(affiliate)) {
      return {
        success: false,
        message: "Invalid affiliate code. Please check with your affiliate partner for the correct code.",
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

        const subject = `New Demo Request from ${firstName} ${lastName}`
        const body = `
New Demo Request from Kuhlekt Website

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${company}
- Role: ${role || "Not specified"}

Challenges:
${challenges || "Not specified"}

Affiliate Code:
${affiliate || "Not specified"}

Please follow up with this prospect to schedule a demo.
        `

        // Create basic SES API call
        const params = new URLSearchParams({
          Action: "SendEmail",
          Version: "2010-12-01",
          Source: process.env.AWS_SES_FROM_EMAIL,
          "Destination.ToAddresses.member.1": "enquiries@kuhlekt.com",
          "Message.Subject.Data": subject,
          "Message.Body.Text.Data": body,
          "ReplyToAddresses.member.1": email,
        })

        const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, "") + "Z"

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
        console.log("AWS SES not configured, logging demo request:", {
          firstName,
          lastName,
          email,
          company,
          role,
          challenges,
          affiliate,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      console.log("Demo request data (email failed):", {
        firstName,
        lastName,
        email,
        company,
        role,
        challenges,
        affiliate,
        timestamp: new Date().toISOString(),
      })
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message:
        "Thank you! Your demo request has been submitted. We'll contact you within 24 hours to schedule your personalized demo.",
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
