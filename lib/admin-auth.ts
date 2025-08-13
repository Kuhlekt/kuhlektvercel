import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const ADMIN_SESSION_COOKIE = "admin-session"
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

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
  const session: AdminSession = {
    isAuthenticated: true,
    timestamp: Date.now(),
  }

  const cookieStore = cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_DURATION / 1000,
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

    // Check if session is expired
    if (Date.now() - session.timestamp > SESSION_DURATION) {
      await clearAdminSession()
      return null
    }

    return session
  } catch (error) {
    console.error("Error getting admin session:", error)
    return null
  }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

export async function requireAdminAuth(): Promise<void> {
  const session = await getAdminSession()

  if (!session || !session.isAuthenticated) {
    redirect("/admin/login")
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession()
  return session?.isAuthenticated ?? false
}
