import type { NextRequest } from "next/server"
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
      return new Response(JSON.stringify({ success: false, error: "Password is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
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
      return new Response(JSON.stringify({ success: false, error: "Server configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!isValid) {
      console.log("[v0] Invalid password")
      return new Response(JSON.stringify({ success: false, error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log("[v0] Password valid, creating session")

    const sessionToken = generateSessionToken()
    const isProduction = process.env.NODE_ENV === "production"

    const cookieValue = [
      `admin-token=${sessionToken}`,
      "HttpOnly",
      isProduction ? "Secure" : "",
      "SameSite=Strict",
      `Max-Age=${60 * 60 * 24}`,
      "Path=/",
    ]
      .filter(Boolean)
      .join("; ")

    console.log("[v0] Returning success response with cookie")

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login successful",
        redirectTo: "/admin",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieValue,
        },
      },
    )
  } catch (error) {
    console.error("[v0] Login error:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: "An error occurred during login",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
