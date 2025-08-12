"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createHmac } from "crypto"

function base32Decode(encoded: string): Buffer {
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

  return Buffer.from(output)
}

function verifyTOTP(token: string, secret: string): boolean {
  const timeStep = 30
  const currentTime = Math.floor(Date.now() / 1000 / timeStep)

  // Check current time window and previous/next windows for clock drift
  for (let i = -1; i <= 1; i++) {
    const time = currentTime + i
    const timeBuffer = Buffer.alloc(8)
    timeBuffer.writeUInt32BE(0, 0)
    timeBuffer.writeUInt32BE(time, 4)

    const secretBuffer = base32Decode(secret)
    const hash = createHmac("sha1", secretBuffer).update(timeBuffer).digest()

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

  if (!password || !twofa) {
    return { error: "Password and 2FA code are required" }
  }

  // Check password
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || password !== adminPassword) {
    return { error: "Invalid credentials" }
  }

  // Check 2FA
  const adminSecret = process.env.ADMIN_2FA_SECRET
  if (!adminSecret) {
    return { error: "2FA not configured" }
  }

  if (!verifyTOTP(twofa, adminSecret)) {
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
