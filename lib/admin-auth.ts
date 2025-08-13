import { cookies } from "next/headers"

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
