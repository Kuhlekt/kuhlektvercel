"use server"

import { sendEmailWithSES } from "@/lib/aws-ses"
import { validateAffiliate } from "@/lib/affiliate-validation"

export async function submitDemoRequest(formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const challenges = formData.get("challenges") as string
    const affiliate = formData.get("affiliate") as string
    const recaptchaToken = formData.get("recaptchaToken") as string

    // Basic validation
    if (!firstName || !lastName || !email || !company || !phone) {
      return {
        success: false,
        error: "Please fill in all required fields.",
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Please enter a valid email address.",
      }
    }

    // Validate affiliate code if provided
    if (affiliate && !validateAffiliate(affiliate)) {
      return {
        success: false,
        error: "Invalid affiliate code provided.",
      }
    }

    // Prepare email content
    const adminEmail = process.env.ADMIN_EMAIL || "admin@kuhlekt.com"
    const subject = `Demo Request from ${firstName} ${lastName} at ${company}`

    const emailContent = `
New Demo Request Received

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${company}
- Phone: ${phone}

${challenges ? `AR Challenges:\n${challenges}\n` : ""}
${affiliate ? `Affiliate Code: ${affiliate}\n` : ""}

Submitted: ${new Date().toLocaleString()}
    `.trim()

    // Send email notification
    try {
      await sendEmailWithSES({
        to: adminEmail,
        subject,
        text: emailContent,
        html: emailContent.replace(/\n/g, "<br>"),
      })

      console.log("Demo request email sent successfully")
    } catch (emailError) {
      console.error("Failed to send demo request email:", emailError)
      // Continue execution - don't fail the form submission if email fails
    }

    // Log the submission for debugging
    console.log("Demo request submitted:", {
      firstName,
      lastName,
      email,
      company,
      phone,
      haschallenges: !!challenges,
      hasAffiliate: !!affiliate,
      timestamp: new Date().toISOString(),
    })

    return {
      success: true,
      message:
        "Thank you for your demo request! We'll contact you within 24 hours to schedule your personalized demonstration.",
    }
  } catch (error) {
    console.error("Demo request submission error:", error)
    return {
      success: false,
      error: "An error occurred while submitting your request. Please try again.",
    }
  }
}
