import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("🔍 Demo API route called")

    const formData = await request.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const message = formData.get("message") as string
    const recaptchaToken = formData.get("recaptcha-token") as string

    console.log("📝 Form data received:", { name, email, company, message, recaptchaToken: recaptchaToken ? "✓" : "✗" })

    // Basic validation
    if (!name || !email || !company || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
          shouldClearForm: false,
        },
        { status: 400 },
      )
    }

    // For now, just return success without sending email
    console.log("✅ Demo form submission successful")

    return NextResponse.json({
      success: true,
      message: "Thank you for your demo request! We will contact you soon.",
      shouldClearForm: true,
    })
  } catch (error) {
    console.error("❌ Demo API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while submitting your demo request. Please try again.",
        shouldClearForm: false,
      },
      { status: 500 },
    )
  }
}
