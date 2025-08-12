import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as speakeasy from "speakeasy"
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

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD
}

export async function generateTwoFactorSecret(): Promise<{ secret: string; qrCode: string }> {
  const secret = speakeasy.generateSecret({
    name: "Kuhlekt Admin",
    issuer: "Kuhlekt Website",
    length: 32,
  })

  const qrCode = await QRCode.toDataURL(secret.otpauth_url!)

  return {
    secret: secret.base32!,
    qrCode,
  }
}

// Export both function names for compatibility
export async function verifyTwoFactorToken(token: string, secret?: string): Promise<boolean> {
  const secretToUse = secret || ADMIN_2FA_SECRET

  return speakeasy.totp.verify({
    secret: secretToUse,
    token,
    window: 2, // Allow 2 time steps (60 seconds) of drift
  })
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
  const secret = speakeasy.generateSecret({
    name: "Kuhlekt Admin",
    issuer: "Kuhlekt Website",
    length: 32,
  })

  const qrCode = await QRCode.toDataURL(secret.otpauth_url!)

  return {
    secret: secret.base32!,
    qrCode,
  }
}

export async function generateQRCode(secret: string): Promise<string> {
  const otpauth = speakeasy.otpauthURL({
    secret,
    label: "Kuhlekt Admin",
    issuer: "Kuhlekt Website",
  })

  return await QRCode.toDataURL(otpauth)
}
