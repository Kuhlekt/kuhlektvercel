import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const ADMIN_SESSION_COOKIE = "admin-session"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyAdminPassword(password: string, hashedPassword: string): Promise<boolean> {
  // For development, use plain text comparison
  // In production, you should hash the admin password
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD not configured")
    return false
  }

  return password === adminPassword
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)

  if (!sessionCookie) {
    return false
  }

  // In a real app, you'd verify the session token against a database
  // For now, we'll just check if the cookie exists and has the right value
  return sessionCookie.value === "authenticated"
}

export async function createAdminSession() {
  const cookieStore = cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function destroyAdminSession() {
  const cookieStore = cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

export async function requireAdminAuth() {
  const isAuthenticated = await verifyAdminSession()
  if (!isAuthenticated) {
    redirect("/admin/login")
  }
}
