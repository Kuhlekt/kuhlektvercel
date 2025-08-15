import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form data
    const firstName = formData.get("firstName")?.toString()?.trim()
    const lastName = formData.get("lastName")?.toString()?.trim()
    const email = formData.get("email")?.toString()?.trim()
    const company = formData.get("company")?.toString()?.trim()
    const phone = formData.get("phone")?.toString()?.trim()
    const message = formData.get("message")?.toString()?.trim()

    // Basic validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
          errors: {
            firstName: !firstName ? "First name is required" : undefined,
            lastName: !lastName ? "Last name is required" : undefined,
            email: !email ? "Email is required" : undefined,
          },
        },
        { status: 400 },
      )
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
          errors: { email: "Please enter a valid email address" },
        },
        { status: 400 },
      )
    }

    // Log the submission (for now, just return success)
    console.log("Contact form submission:", {
      firstName,
      lastName,
      email,
      company,
      phone,
      message,
      timestamp: new Date().toISOString(),
    })

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      shouldClearForm: true,
      errors: {},
    })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
        shouldClearForm: false,
        errors: {},
      },
      { status: 500 },
    )
  }
}
