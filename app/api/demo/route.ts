import { NextResponse } from "next/server"
import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"

export async function POST(request: Request) {
  try {
    console.log("🔍 Demo API route called")

    const formData = await request.formData()

    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const recaptchaToken = formData.get("recaptcha-token") as string

    console.log("📝 Form data received:", {
      firstName,
      lastName,
      email,
      company,
      phone,
      recaptchaToken: recaptchaToken ? "✓" : "✗",
    })

    // Basic validation
    if (!firstName || !lastName || !email || !company || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be filled.",
          shouldClearForm: false,
          errors: {},
        },
        { status: 400 },
      )
    }

    // Verify reCAPTCHA
    console.log("🔒 Verifying reCAPTCHA...")
    const recaptchaResult = await verifyRecaptcha(recaptchaToken)

    if (!recaptchaResult.success) {
      console.warn("⚠️ reCAPTCHA verification failed, but allowing submission:", recaptchaResult.message)
      // Allow submission to proceed even if reCAPTCHA fails
    } else {
      console.log("✅ reCAPTCHA verification successful")
    }

    // Send email notification
    console.log("📧 Sending demo request email...")

    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      console.error("❌ ADMIN_EMAIL environment variable not set")
      return NextResponse.json(
        {
          success: false,
          message: "Email configuration error. Please try again later.",
          shouldClearForm: false,
          errors: {},
        },
        { status: 500 },
      )
    }

    const emailSubject = `New Demo Request from ${firstName} ${lastName} - ${company}`
    const emailText = `
New Demo Request Received

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${company}
- Phone: ${phone}

Submitted at: ${new Date().toLocaleString()}

Please follow up with this demo request within 24 hours.
    `.trim()

    const emailHtml = `
<h2>New Demo Request Received</h2>

<h3>Contact Information:</h3>
<ul>
  <li><strong>Name:</strong> ${firstName} ${lastName}</li>
  <li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
  <li><strong>Company:</strong> ${company}</li>
  <li><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></li>
</ul>

<p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>

<p><em>Please follow up with this demo request within 24 hours.</em></p>
    `.trim()

    const emailResult = await sendEmailWithSES({
      to: adminEmail,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    })

    if (!emailResult.success) {
      console.error("❌ Failed to send demo request email:", emailResult.message)
      // Still return success to user, but log the email failure
      console.log("📝 Demo request logged for manual follow-up:", {
        firstName,
        lastName,
        email,
        company,
        phone,
        timestamp: new Date().toISOString(),
      })
    } else {
      console.log("✅ Demo request email sent successfully:", emailResult.messageId)
    }

    console.log("✅ Demo form submission successful")

    return NextResponse.json({
      success: true,
      message: "Thank you for your demo request! We will contact you within 24 hours.",
      shouldClearForm: true,
      errors: {},
    })
  } catch (error) {
    console.error("❌ Demo API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while submitting your demo request. Please try again.",
        shouldClearForm: false,
        errors: {},
      },
      { status: 500 },
    )
  }
}
