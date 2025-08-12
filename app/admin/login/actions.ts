"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Simple TOTP implementation without external dependencies
function generateTOTP(secret: string, timeStep = 30): string {
  const time = Math.floor(Date.now() / 1000 / timeStep)

  // Simple hash-based implementation
  // In production, you'd want a proper TOTP library
  const hash = require("crypto")
    .createHmac("sha1", Buffer.from(secret, "base32"))
    .update(Buffer.from(time.toString(16).padStart(16, "0"), "hex"))
    .digest()

  const offset = hash[hash.length - 1] & 0xf
  const code =
    (((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff)) %
    1000000

  return code.toString().padStart(6, "0")
}

function verifyTOTP(token: string, secret: string): boolean {
  // Check current time window and previous/next windows for clock drift
  const timeStep = 30
  const currentTime = Math.floor(Date.now() / 1000 / timeStep)

  for (let i = -1; i <= 1; i++) {
    const time = currentTime + i
    const hash = require("crypto")
      .createHmac("sha1", Buffer.from(secret, "base32"))
      .update(Buffer.from(time.toString(16).padStart(16, "0"), "hex"))
      .digest()

    const offset = hash[hash.length - 1] & 0xf
    const code =
      (((hash[offset] & 0x7f) << 24) |
        ((hash[offset + 1] & 0xff) << 16) |
        ((hash[offset + 2] & 0xff) << 8) |
        (hash[offset + 3] & 0xff)) %
      1000000

    if (code.toString().padStart(6, "0") === token) {
      return true
    }
  }

  return false
}

export async function loginAdmin(prevState: any, formData: FormData) {
  const password = formData.get("password") as string
  const twofa = formData.get("twofa") as string

  // Check password
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Invalid credentials" }
  }

  // Check 2FA
  const secret = process.env.ADMIN_2FA_SECRET
  if (!secret) {
    return { error: "Server configuration error" }
  }

  const isValid = verifyTOTP(twofa, secret)

  if (!isValid) {
    return { error: "Invalid 2FA code" }
  }

  // Set admin session cookie
  const cookieStore = await cookies()
  cookieStore.set("admin-session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  redirect("/admin/tracking")
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-session")
  redirect("/admin/login")
}
