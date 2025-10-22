import { type NextRequest, NextResponse } from "next/server"
import { setAdminAuthenticated } from "@/lib/admin-auth"
import { adminLoginSchema } from "@/lib/validation-schemas"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = adminLoginSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.errors[0].message,
        },
        { status: 400 },
      )
    }

    const { password } = validation.data

    // Validate password length to prevent timing attacks
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password",
        },
        { status: 400 },
      )
    }

    // Check password against environment variable
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password",
        },
        { status: 401 },
      )
    }

    // Use secure token-based session management
    await setAdminAuthenticated()

    return NextResponse.json({
      success: true,
      message: "Login successful",
      redirectTo: "/admin",
    })
  } catch (error) {
    console.error("Admin login error")
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during login. Please try again.",
      },
      { status: 500 },
    )
  }
}
