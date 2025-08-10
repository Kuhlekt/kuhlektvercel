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
        const { SESClient, SendEmailCommand } = await import("@aws-sdk/client-ses")

        const ses = new SESClient({
          region: process.env.AWS_SES_REGION,
          credentials: {
            accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
          },
        })

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

        const params = {
          Destination: {
            ToAddresses: ["enquiries@kuhlekt.com"],
          },
          Message: {
            Body: {
              Text: { Data: body },
            },
            Subject: { Data: subject },
          },
          Source: process.env.AWS_SES_FROM_EMAIL,
          ReplyToAddresses: [email],
        }

        await ses.send(new SendEmailCommand(params))
        console.log("Email sent successfully via AWS SES")
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
