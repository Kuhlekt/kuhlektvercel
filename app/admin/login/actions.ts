"use server"

import { verifyAdminCredentials, createAdminSession, logAdminActivity } from "@/lib/auth/admin-auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function loginWithCredentials(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return { success: false, error: "Username and password are required" }
  }

  try {
    // First try database authentication
    const user = await verifyAdminCredentials(username, password)

    if (user) {
      await createAdminSession(user)
      await logAdminActivity(user.id, user.username, "login_success", "authentication")
      redirect("/admin/dashboard")
    }

    // Fallback to environment variable authentication
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
    if (username === "admin" && password === ADMIN_PASSWORD) {
      // Create a simple session cookie for fallback mode
      const cookieStore = cookies()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

      cookieStore.set("admin-session-fallback", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: expiresAt,
        path: "/admin",
      })

      redirect("/admin/dashboard")
    }

    return { success: false, error: "Invalid username or password" }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: `Login failed: ${error.message}` }
  }
}

// Legacy function for backward compatibility
export async function loginWithPassword(formData: FormData) {
  const password = formData.get("password") as string

  // Try to login with 'admin' username and provided password
  const newFormData = new FormData()
  newFormData.set("username", "admin")
  newFormData.set("password", password)

  return await loginWithCredentials(newFormData)
}
