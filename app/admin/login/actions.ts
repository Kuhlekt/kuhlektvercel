"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Simple base32 decode function
function base32Decode(encoded: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let bits = 0
  let value = 0
  const output = []

  for (let i = 0; i < encoded.length; i++) {
    const char = encoded[i].toUpperCase()
    if (char === "=") break

    const index = alphabet.indexOf(char)
    if (index === -1) continue

    value = (value << 5) | index
    bits += 5

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }

  return new Uint8Array(output)
}

// HMAC-SHA1 implementation
async function hmacSha1(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-1" }, false, ["sign"])

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, data)
  return new Uint8Array(signature)
}

// TOTP verification function
async function verifyTOTP(token: string, secret: string): Promise<boolean> {
  try {
    const key = base32Decode(secret)
    const time = Math.floor(Date.now() / 1000 / 30)

    // Check current time window and adjacent windows for clock drift
    for (let i = -1; i <= 1; i++) {
      const timeCounter = time + i
      const timeBuffer = new ArrayBuffer(8)
      const timeView = new DataView(timeBuffer)
      timeView.setUint32(4, timeCounter, false)

      const hmac = await hmacSha1(key, new Uint8Array(timeBuffer))
      const offset = hmac[19] & 0xf
      const code =
        (((hmac[offset] & 0x7f) << 24) |
          ((hmac[offset + 1] & 0xff) << 16) |
          ((hmac[offset + 2] & 0xff) << 8) |
          (hmac[offset + 3] & 0xff)) %
        1000000

      if (code.toString().padStart(6, "0") === token) {
        return true
      }
    }

    return false
  } catch (error) {
    console.error("TOTP verification error:", error)
    return false
  }
}

export async function adminLogin(formData: FormData) {
  const password = formData.get("password") as string

  if (!password) {
    return { error: "Password is required" }
  }

  // Verify password
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Invalid password" }
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set("admin-session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  redirect("/admin/tracking")
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-session")
  redirect("/admin/login")
}
