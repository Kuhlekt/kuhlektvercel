import { NextResponse } from "next/server"

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

    // For now, just return success without sending email
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
