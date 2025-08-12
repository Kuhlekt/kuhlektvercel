import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as QRCode from "qrcode"

// Admin credentials - in production, store these securely
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
const ADMIN_2FA_SECRET = process.env.ADMIN_2FA_SECRET || "JBSWY3DPEHPK3PXP"

export interface AdminSession {
  isAuthenticated: boolean
  requiresTwoFactor: boolean
  sessionId: string
  expiresAt: Date
}

// Base32 encoding/decoding functions for TOTP
const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

function base32Decode(encoded: string): Uint8Array {
  encoded = encoded.toUpperCase().replace(/=+$/, "")
  let bits = 0
  let value = 0
  const output = new Uint8Array(Math.floor((encoded.length * 5) / 8))
  let index = 0

  for (let i = 0; i < encoded.length; i++) {
    const char = encoded[i]
    const charIndex = base32Chars.indexOf(char)
    if (charIndex === -1) throw new Error("Invalid base32 character")

    value = (value << 5) | charIndex
    bits += 5

    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 255
      bits -= 8
    }
  }

  return output.slice(0, index)
}

function base32Encode(data: Uint8Array): string {
  let bits = 0
  let value = 0
  let output = ""

  for (let i = 0; i < data.length; i++) {
    value = (value << 8) | data[i]
    bits += 8

    while (bits >= 5) {
      output += base32Chars[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    output += base32Chars[(value << (5 - bits)) & 31]
  }

  return output
}

async function hmacSha1(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-1" }, false, ["sign"])

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, data)
  return new Uint8Array(signature)
}

async function generateTOTP(secret: string, timeStep = 30, digits = 6): Promise<string> {
  const secretBytes = base32Decode(secret)
  const time = Math.floor(Date.now() / 1000 / timeStep)

  // Convert time to 8-byte array
  const timeBytes = new Uint8Array(8)
  for (let i = 7; i >= 0; i--) {
    timeBytes[i] = time & 0xff
    time >>> 8
  }

  const hmac = await hmacSha1(secretBytes, timeBytes)
  const offset = hmac[hmac.length - 1] & 0xf

  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)

  return (code % Math.pow(10, digits)).toString().padStart(digits, "0")
}

async function verifyTOTP(token: string, secret: string, window = 2): Promise<boolean> {
  const timeStep = 30
  const currentTime = Math.floor(Date.now() / 1000 / timeStep)

  for (let i = -window; i <= window; i++) {
    const testTime = currentTime + i
    const timeBytes = new Uint8Array(8)
    let time = testTime
    for (let j = 7; j >= 0; j--) {
      timeBytes[j] = time & 0xff
      time = Math.floor(time / 256)
    }

    const secretBytes = base32Decode(secret)
    const hmac = await hmacSha1(secretBytes, timeBytes)
    const offset = hmac[hmac.length - 1] & 0xf

    const code =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)

    const expectedToken = (code % 1000000).toString().padStart(6, "0")

    if (expectedToken === token) {
      return true
    }
  }

  return false
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD
}

export async function generateTwoFactorSecret(): Promise<{ secret: string; qrCode: string }> {
  // Generate 32 random bytes for the secret
  const secretBytes = crypto.getRandomValues(new Uint8Array(32))
  const secret = base32Encode(secretBytes)

  // Generate QR code data URL
  const issuer = "Kuhlekt Website"
  const label = "Kuhlekt Admin"
  const otpauthUrl = `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`

  // Simple QR code generation (you might want to use a proper QR library)
  const qrCode = await QRCode.toDataURL(otpauthUrl)

  return { secret, qrCode }
}

export async function verifyTwoFactorToken(token: string, secret?: string): Promise<boolean> {
  const secretToUse = secret || ADMIN_2FA_SECRET
  return await verifyTOTP(token, secretToUse, 2)
}

// Alias for compatibility
export const verifyTwoFactorCode = verifyTwoFactorToken

export async function createAdminSession(): Promise<string> {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  const cookieStore = cookies()
  cookieStore.set("admin-session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: expiresAt,
    path: "/admin",
  })

  cookieStore.set("admin-session-expires", expiresAt.toISOString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: expiresAt,
    path: "/admin",
  })

  return sessionId
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("admin-session")?.value
  const expiresAt = cookieStore.get("admin-session-expires")?.value

  if (!sessionId || !expiresAt) {
    return null
  }

  const expiry = new Date(expiresAt)
  if (expiry < new Date()) {
    await clearAdminSession()
    return null
  }

  return {
    isAuthenticated: true,
    requiresTwoFactor: false,
    sessionId,
    expiresAt: expiry,
  }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete("admin-session")
  cookieStore.delete("admin-session-expires")
  cookieStore.delete("admin-2fa-pending")
}

export async function requireAdminAuth(): Promise<AdminSession> {
  const session = await getAdminSession()

  if (!session) {
    redirect("/admin/login")
  }

  return session
}

export async function setPendingTwoFactor(): Promise<void> {
  const cookieStore = cookies()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  cookieStore.set("admin-2fa-pending", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: expiresAt,
    path: "/admin",
  })
}

export async function isPendingTwoFactor(): Promise<boolean> {
  const cookieStore = cookies()
  return cookieStore.get("admin-2fa-pending")?.value === "true"
}

export async function clearPendingTwoFactor(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete("admin-2fa-pending")
}

export async function generateNewAdminTwoFactorSecret(): Promise<{ secret: string; qrCode: string }> {
  return await generateTwoFactorSecret()
}

export async function generateQRCode(secret: string): Promise<string> {
  const issuer = "Kuhlekt Website"
  const label = "Kuhlekt Admin"

  // Simple QR code representation
  return await QRCode.toDataURL(
    `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`,
  )
}
