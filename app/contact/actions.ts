"use server"

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const ses = new SESClient({
  region: process.env.AWS_SES_REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      }
    }

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
      Source: process.env.AWS_SES_FROM_EMAIL!,
      ReplyToAddresses: [email],
    }

    await ses.send(new SendEmailCommand(params))

    console.log("Contact form submitted:", {
      firstName,
      lastName,
      email,
      company,
      role,
      companySize,
      message,
      affiliate,
    })

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message: "Thank you for your message! We've received your inquiry and will get back to you within 24 hours.",
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
