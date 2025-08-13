import { cookies } from "next/headers"
import { createHmac } from "crypto"

function generateSecureToken(userId: string): string {
  const secret = process.env.ADMIN_2FA_SECRET || "fallback-secret"
  const timestamp = Date.now().toString()
  const payload = `${userId}:${timestamp}`
  const signature = createHmac("sha256", secret).update(payload).digest("hex")
  return `${Buffer.from(payload).toString("base64")}.${signature}`
}

function validateSecureToken(token: string): { valid: boolean; expired: boolean } {
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
    const adminToken = cookieStore.get("admin-token")

    if (!adminToken) {
      return false
    }

    const validation = validateSecureToken(adminToken.value)
    return validation.valid && !validation.expired
  } catch (error) {
    console.error("Admin auth check error:", error)
    return false
  }
}

export async function setAdminAuthenticated(): Promise<void> {
  const cookieStore = await cookies()
  const secureToken = generateSecureToken("admin")

  cookieStore.set("admin-token", secureToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/admin", // Restrict cookie scope to admin paths
  })
}

export async function clearAdminAuthentication(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("admin-token")
}
