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

// Generate TOTP token
async function generateTOTP(secret: string, timeStep = 30): Promise<string> {
  const key = base32Decode(secret)
  const time = Math.floor(Date.now() / 1000 / timeStep)

  // Convert time to 8-byte array
  const timeBytes = new Uint8Array(8)
  for (let i = 7; i >= 0; i--) {
    timeBytes[i] = time & 0xff
    time >>> 8
  }

  const hmac = await hmacSha1(key, timeBytes)
  const offset = hmac[hmac.length - 1] & 0xf
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)

  return (code % 1000000).toString().padStart(6, "0")
}

// Verify TOTP token
async function verifyTOTP(token: string, secret: string): Promise<boolean> {
  // Check current time window and adjacent windows for clock drift
  for (let i = -1; i <= 1; i++) {
    const timeStep = Math.floor(Date.now() / 1000 / 30) + i
    const key = base32Decode(secret)

    // Convert time to 8-byte array
    const timeBytes = new Uint8Array(8)
    let time = timeStep
    for (let j = 7; j >= 0; j--) {
      timeBytes[j] = time & 0xff
      time = Math.floor(time / 256)
    }

    const hmac = await hmacSha1(key, timeBytes)
    const offset = hmac[hmac.length - 1] & 0xf
    const code =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)

    const expectedToken = (code % 1000000).toString().padStart(6, "0")
    if (token === expectedToken) {
      return true
    }
  }
  return false
}

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string
  const totpCode = formData.get("totpCode") as string

  // Check password
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Invalid credentials" }
  }

  // Check TOTP if secret is configured
  if (process.env.ADMIN_2FA_SECRET) {
    if (!totpCode) {
      return { error: "2FA code is required" }
    }

    const isValidTOTP = await verifyTOTP(totpCode, process.env.ADMIN_2FA_SECRET)
    if (!isValidTOTP) {
      return { error: "Invalid 2FA code" }
    }
  }

  // Set authentication cookie
  const cookieStore = await cookies()
  cookieStore.set("admin-auth", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  redirect("/admin/tracking")
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-auth")
  redirect("/admin/login")
}
