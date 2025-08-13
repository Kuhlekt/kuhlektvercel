import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

const ADMIN_SESSION_COOKIE = "admin-session"

export interface AdminSession {
  isAuthenticated: boolean
  timestamp: number
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyAdminPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export async function createAdminSession(): Promise<void> {
  const cookieStore = cookies()
  const session: AdminSession = {
    isAuthenticated: true,
    timestamp: Date.now(),
  }

  cookieStore.set(ADMIN_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)

    if (!sessionCookie) {
      return null
    }

    const session: AdminSession = JSON.parse(sessionCookie.value)

    // Check if session is expired (24 hours)
    const isExpired = Date.now() - session.timestamp > 24 * 60 * 60 * 1000

    if (isExpired) {
      await destroyAdminSession()
      return null
    }

    return session
  } catch (error) {
    console.error("Error getting admin session:", error)
    return null
  }
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession()
  return session?.isAuthenticated ?? false
}

export async function requireAdminAuth(): Promise<void> {
  const isAuthenticated = await isAdminAuthenticated()
  if (!isAuthenticated) {
    throw new Error("Admin authentication required")
  }
}
