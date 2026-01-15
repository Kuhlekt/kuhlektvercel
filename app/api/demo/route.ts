import { NextResponse } from "next/server"
import { sendEmailWithSES } from "@/lib/aws-ses"
import { verifyRecaptcha } from "@/lib/recaptcha-actions"
import { neon } from "@neondatabase/serverless"

const neonDb = neon(process.env.NEON_DATABASE_URL!)

export async function POST(request: Request) {
  try {
    console.log("🔍 Demo API route called")

    const formData = await request.formData()

    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const promoCode = formData.get("promoCode") as string

    console.log("📝 Form data received:", {
      firstName,
      lastName,
      email,
      company,
      phone,
      promoCode: promoCode || "none",
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
    const recaptchaResult = await verifyRecaptcha(formData.get("recaptcha-token") as string)

    if (!recaptchaResult.success) {
      console.warn("⚠️ reCAPTCHA verification failed, but allowing submission:", recaptchaResult.error)
      // Allow submission to proceed even if reCAPTCHA fails
    } else {
      console.log("✅ reCAPTCHA verification successful")
    }

    let promoDetails = null

    if (promoCode) {
      console.log("🎁 Validating promo code:", promoCode)

      const now = new Date().toISOString()
      const codeResult = await neonDb`
        SELECT * FROM promo_codes
        WHERE code = ${promoCode.toUpperCase()} AND is_active = true
        AND valid_from <= ${now} AND valid_until >= ${now}
        LIMIT 1
      `

      if (!codeResult || codeResult.length === 0) {
        console.warn("⚠️ Invalid promo code:", promoCode)
        return NextResponse.json(
          {
            success: false,
            message: "Invalid or expired promo code. Please check the code and try again.",
            shouldClearForm: false,
            errors: { promoCode: "Invalid or expired promo code" },
          },
          { status: 400 },
        )
      }

      const codeData = codeResult[0]
      if (codeData.max_uses && codeData.current_uses >= codeData.max_uses) {
        console.warn("⚠️ Promo code usage limit reached:", promoCode)
        return NextResponse.json(
          {
            success: false,
            message: "This promo code has reached its usage limit.",
            shouldClearForm: false,
            errors: { promoCode: "Promo code usage limit reached" },
          },
          { status: 400 },
        )
      }

      console.log("✅ Promo code valid:", {
        code: codeData.code,
        discount: codeData.discount_percent,
        freeSetup: codeData.free_setup,
      })

      promoDetails = {
        discount: codeData.discount_percent,
        freeSetup: codeData.free_setup,
      }

      // Record the redemption
      await neonDb`
        INSERT INTO promo_code_redemptions (promo_code_id, email, first_name, last_name, company, phone, redeemed_at)
        VALUES (${codeData.id}, ${email}, ${firstName}, ${lastName}, ${company}, ${phone}, ${now})
      `

      // Increment usage counter
      await neonDb`UPDATE promo_codes SET current_uses = current_uses + 1, updated_at = ${now} WHERE id = ${codeData.id}`

      console.log("✅ Promo code redeemed successfully")
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

    const promoText = promoDetails
      ? `\n\n🎁 PROMO CODE USED: ${promoCode}\n- Discount: ${promoDetails.discount}%\n- Free Setup: ${promoDetails.freeSetup ? "YES" : "NO"}`
      : ""

    const promoHtml = promoDetails
      ? `
<div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
  <h3 style="color: #92400e; margin: 0 0 10px 0;">🎁 Promo Code Applied</h3>
  <ul style="margin: 0; padding-left: 20px;">
    <li><strong>Code:</strong> ${promoCode}</li>
    <li><strong>Discount:</strong> ${promoDetails.discount}%</li>
    <li><strong>Free Setup:</strong> ${promoDetails.freeSetup ? "YES ($2,500 value)" : "NO"}</li>
  </ul>
</div>`
      : ""

    const emailSubject = promoCode
      ? `🎁 New Demo Request with ${promoCode} from ${firstName} ${lastName} - ${company}`
      : `New Demo Request from ${firstName} ${lastName} - ${company}`

    const emailText = `
New Demo Request Received

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${company}
- Phone: ${phone}${promoText}

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

${promoHtml}

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
        promoCode: promoCode || null,
        timestamp: new Date().toISOString(),
      })
    } else {
      console.log("✅ Demo request email sent successfully:", emailResult.messageId)
    }

    console.log("✅ Demo form submission successful")

    const successMessage = promoDetails
      ? `Thank you for your demo request! Your ${promoCode} promo code (${promoDetails.discount}% off + ${promoDetails.freeSetup ? "free setup" : "regular setup"}) has been applied. We will contact you within 24 hours.`
      : "Thank you for your demo request! We will contact you within 24 hours."

    return NextResponse.json({
      success: true,
      message: successMessage,
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
