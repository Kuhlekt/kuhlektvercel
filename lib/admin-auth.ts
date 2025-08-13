import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const adminToken = cookieStore.get("admin-token")

    if (!adminToken) {
      return false
    }

    // In a real app, verify the token
    return adminToken.value === "authenticated"
  } catch (error) {
    console.error("Admin auth check error:", error)
    return false
  }
}

export async function setAdminAuthenticated(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("admin-token", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

export async function clearAdminAuthentication(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("admin-token")
}

export async function verifyAdminSession(): Promise<boolean> {
  const sessionCookie = cookies().get("admin_session")
  return sessionCookie?.value === "authenticated"
}

export async function clearAdminSession(): Promise<void> {
  cookies().delete("admin_session")
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyAdminPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error("Password verification error:", error)
    return false
  }
}
