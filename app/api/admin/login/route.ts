import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(":")
    const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
    return hash === verifyHash
  } catch {
    return false
  }
}

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export async function POST(request: NextRequest) {
  console.log("[v0] Login route started")

  try {
    const body = await request.json()
    console.log("[v0] Request body parsed")

    const { password } = body

    if (!password) {
      console.log("[v0] No password provided")
      return NextResponse.json({ success: false, error: "Password is required" }, { status: 400 })
    }

    console.log("[v0] Checking password")

    const storedHash = process.env.ADMIN_PASSWORD_HASH
    const plainPassword = process.env.ADMIN_PASSWORD

    let isValid = false

    if (storedHash && storedHash.includes(":")) {
      console.log("[v0] Using hashed password")
      isValid = verifyPassword(password, storedHash)
    } else if (plainPassword) {
      console.log("[v0] Using plaintext password")
      isValid = password === plainPassword
    } else {
      console.log("[v0] No password configured")
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 })
    }

    if (!isValid) {
      console.log("[v0] Invalid password")
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Password valid, creating session")

    const sessionToken = generateSessionToken()
    const isProduction = process.env.NODE_ENV === "production"

    console.log("[v0] Returning success response with cookie")

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      redirectTo: "/admin",
    })

    // Set cookie using NextResponse cookie API
    response.cookies.set("admin-token", sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during login",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
