"use server"

import { cookies } from "next/headers"
import { createHmac } from "crypto"

async function generateSecureToken(userId: string): Promise<string> {
  const secret = process.env.ADMIN_2FA_SECRET || "fallback-secret"
  const timestamp = Date.now().toString()
  const payload = `${userId}:${timestamp}`
  const signature = createHmac("sha256", secret).update(payload).digest("hex")
  return `${Buffer.from(payload).toString("base64")}.${signature}`
}

async function validateSecureToken(token: string): Promise<{ valid: boolean; expired: boolean }> {
  try {
    const [payloadB64, signature] = token.split(".")
    if (!payloadB64 || !signature) return { valid: false, expired: false }

    const payload = Buffer.from(payloadB64, "base64").toString()
    const [userId, timestamp] = payload.split(":")

    // Verify signature
    const secret = process.env.ADMIN_2FA_SECRET || "fallback-secret"
    const expectedSignature = createHmac("sha256", secret).update(payload).digest("hex")

    if (signature !== expectedSignature) {
      return { valid: false, expired: false }
    }

    // Check expiration (24 hours)
    const tokenAge = Date.now() - Number.parseInt(timestamp)
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours

    return {
      valid: true,
      expired: tokenAge > maxAge,
    }
  } catch {
    return { valid: false, expired: false }
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const adminToken = cookieStore.get("__Host-admin-token")

    if (!adminToken) {
      return false
    }

    const validation = await validateSecureToken(adminToken.value)
    return validation.valid && !validation.expired
  } catch (error) {
    console.error("Admin auth check error:", error)
    return false
  }
}

export async function setAdminAuthenticated(): Promise<void> {
  const cookieStore = await cookies()
  const secureToken = await generateSecureToken("admin")

  cookieStore.set("__Host-admin-token", secureToken, {
    httpOnly: true,
    secure: true, // Always require HTTPS
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/", // Required for __Host- prefix
  })
}

export async function clearAdminAuthentication(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("__Host-admin-token")
}
