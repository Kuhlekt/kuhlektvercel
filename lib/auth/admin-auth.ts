import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as QRCode from "qrcode"
import { createServerClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export interface AdminSession {
  isAuthenticated: boolean
  requiresTwoFactor: boolean
  sessionId: string
  userId: number
  username: string
  role: string
  expiresAt: Date
}

export interface AdminUser {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  role: "super_admin" | "admin" | "viewer"
  is_active: boolean
  two_factor_enabled: boolean
  two_factor_secret?: string
}

export async function verifyAdminCredentials(username: string, password: string): Promise<AdminUser | null> {
  try {
    const supabase = createServerClient()

    const { data: user, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .eq("is_active", true)
      .single()

    if (error || !user) {
      return null
    }

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return null
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      // Increment failed login attempts
      await supabase
        .from("admin_users")
        .update({
          failed_login_attempts: user.failed_login_attempts + 1,
          locked_until: user.failed_login_attempts >= 4 ? new Date(Date.now() + 30 * 60 * 1000) : null, // Lock for 30 minutes after 5 failed attempts
        })
        .eq("id", user.id)

      return null
    }

    // Reset failed login attempts on successful login
    await supabase
      .from("admin_users")
      .update({
        failed_login_attempts: 0,
        locked_until: null,
        last_login: new Date().toISOString(),
      })
      .eq("id", user.id)

    return user
  } catch (error) {
    console.error("Error verifying admin credentials:", error)
    return null
  }
}

export async function createAdminSession(user: AdminUser): Promise<string> {
  try {
    const supabase = createServerClient()
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Get client IP and user agent
    const headers = await import("next/headers").then((mod) => mod.headers())
    const ip = headers.get("x-forwarded-for") || headers.get("x-real-ip") || "127.0.0.1"
    const userAgent = headers.get("user-agent") || ""

    // Store session in database
    await supabase.from("admin_sessions").insert({
      session_id: sessionId,
      user_id: user.id,
      ip_address: ip.split(",")[0].trim(),
      user_agent: userAgent,
      expires_at: expiresAt.toISOString(),
    })

    // Set cookies
    const cookieStore = cookies()
    cookieStore.set("admin-session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: expiresAt,
      path: "/admin",
    })

    return sessionId
  } catch (error) {
    console.error("Error creating admin session:", error)
    throw error
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("admin-session")?.value

    if (!sessionId) {
      return null
    }

    const supabase = createServerClient()

    // Get session with user data
    const { data: session, error } = await supabase
      .from("admin_sessions")
      .select(`
        *,
        admin_users (
          id,
          username,
          role,
          is_active,
          two_factor_enabled
        )
      `)
      .eq("session_id", sessionId)
      .single()

    if (error || !session || !session.admin_users) {
      await clearAdminSession()
      return null
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      await clearAdminSession()
      return null
    }

    // Check if user is still active
    if (!session.admin_users.is_active) {
      await clearAdminSession()
      return null
    }

    // Update last activity
    await supabase
      .from("admin_sessions")
      .update({ last_activity: new Date().toISOString() })
      .eq("session_id", sessionId)

    return {
      isAuthenticated: true,
      requiresTwoFactor: false,
      sessionId,
      userId: session.admin_users.id,
      username: session.admin_users.username,
      role: session.admin_users.role,
      expiresAt: new Date(session.expires_at),
    }
  } catch (error) {
    console.error("Error getting admin session:", error)
    return null
  }
}

export async function clearAdminSession(): Promise<void> {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("admin-session")?.value

    if (sessionId) {
      const supabase = createServerClient()
      await supabase.from("admin_sessions").delete().eq("session_id", sessionId)
    }

    cookieStore.delete("admin-session")
    cookieStore.delete("admin-2fa-pending")
  } catch (error) {
    console.error("Error clearing admin session:", error)
  }
}

export async function requireAdminAuth(): Promise<AdminSession> {
  const session = await getAdminSession()

  if (!session) {
    redirect("/admin/login")
  }

  return session
}

export async function verifyTwoFactorToken(token: string, userId?: number): Promise<boolean> {
  try {
    if (userId) {
      const supabase = createServerClient()
      const { data: user } = await supabase.from("admin_users").select("two_factor_secret").eq("id", userId).single()

      if (user?.two_factor_secret) {
        return await verifyTOTP(token, user.two_factor_secret, 2)
      }
    }

    // Fallback to environment variable for backward compatibility
    const ADMIN_2FA_SECRET = process.env.ADMIN_2FA_SECRET || "JBSWY3DPEHPK3PXP"
    return await verifyTOTP(token, ADMIN_2FA_SECRET, 2)
  } catch (error) {
    console.error("Error verifying 2FA token:", error)
    return false
  }
}

export async function logAdminActivity(
  userId: number,
  username: string,
  action: string,
  resource?: string,
  resourceId?: string,
  details?: any,
  success = true,
  errorMessage?: string,
): Promise<void> {
  try {
    const supabase = createServerClient()
    const headers = await import("next/headers").then((mod) => mod.headers())
    const ip = headers.get("x-forwarded-for") || headers.get("x-real-ip") || "127.0.0.1"
    const userAgent = headers.get("user-agent") || ""

    await supabase.from("admin_activity_log").insert({
      user_id: userId,
      username,
      action,
      resource,
      resource_id: resourceId,
      details,
      ip_address: ip.split(",")[0].trim(),
      user_agent: userAgent,
      success,
      error_message: errorMessage,
    })
  } catch (error) {
    console.error("Error logging admin activity:", error)
  }
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

export async function generateTwoFactorSecret(): Promise<{ secret: string; qrCode: string }> {
  // Generate 32 random bytes for the secret
  const secretBytes = crypto.getRandomValues(new Uint8Array(32))
  const secret = base32Encode(secretBytes)

  // Generate QR code data URL
  const issuer = "Kuhlekt Website"
  const label = "Kuhlekt Admin"
  const otpauthUrl = `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`

  const qrCode = await QRCode.toDataURL(otpauthUrl)

  return { secret, qrCode }
}

// Alias for compatibility
export const verifyTwoFactorCode = verifyTwoFactorToken

export async function generateNewAdminTwoFactorSecret(): Promise<{ secret: string; qrCode: string }> {
  return await generateTwoFactorSecret()
}

export async function generateQRCode(secret: string): Promise<string> {
  const issuer = "Kuhlekt Website"
  const label = "Kuhlekt Admin"

  return await QRCode.toDataURL(
    `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`,
  )
}

// Legacy functions for backward compatibility
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
  return password === ADMIN_PASSWORD
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
