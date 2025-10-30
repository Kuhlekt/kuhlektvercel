import { cookies } from "next/headers"
import crypto from "crypto"

const COOKIE_NAME = "admin-token"

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

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

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)
    return !!token?.value && token.value.length > 0
  } catch (error) {
    console.error("Auth check error:", error)
    return false
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const storedHash = process.env.ADMIN_PASSWORD_HASH

  if (storedHash && storedHash.includes(":")) {
    // Hashed password format
    return verifyPassword(password, storedHash)
  } else {
    // Fallback to plaintext comparison (legacy support)
    return password === process.env.ADMIN_PASSWORD
  }
}

export async function setAdminAuthenticated(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const sessionToken = generateSessionToken()

    cookieStore.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })
  } catch (error) {
    console.error("Set auth error:", error)
    throw error
  }
}

export async function clearAdminAuthentication(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
  } catch (error) {
    console.error("Clear auth error:", error)
  }
}

export async function generatePasswordHash(password: string): Promise<string> {
  return hashPassword(password)
}
