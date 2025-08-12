"use server"

import { verifyAdminCredentials, createAdminSession, logAdminActivity } from "@/lib/auth/admin-auth"
import { cookies } from "next/headers"

export async function loginWithCredentials(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  console.log("Login attempt:", { username, hasPassword: !!password })

  if (!username || !password) {
    console.log("Missing credentials")
    return { success: false, error: "Username and password are required" }
  }

  try {
    // First try database authentication
    console.log("Attempting database authentication...")
    const user = await verifyAdminCredentials(username, password)
    console.log("Database auth result:", user ? "success" : "failed")

    if (user) {
      await createAdminSession(user)
      await logAdminActivity(user.id, user.username, "login_success", "authentication")
      console.log("Database login successful")
      return { success: true, redirectTo: "/admin/dashboard" }
    }

    // Fallback to environment variable authentication
    console.log("Attempting fallback authentication...")
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

    console.log("Fallback check:", {
      username,
      expectedUsername: "admin",
      hasEnvPassword: !!ADMIN_PASSWORD,
      passwordMatch: password === ADMIN_PASSWORD,
      actualPassword: password,
      expectedPassword: ADMIN_PASSWORD, // Temporarily show for debugging
      passwordLength: password.length,
      expectedLength: ADMIN_PASSWORD.length,
    })

    if (username === "admin" && password === ADMIN_PASSWORD) {
      // Create a simple session cookie for fallback mode
      console.log("Fallback authentication successful, setting cookie...")
      const cookieStore = cookies()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

      cookieStore.set("admin-session-fallback", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: expiresAt,
        path: "/admin",
      })

      console.log("Cookie set, returning success")
      return { success: true, redirectTo: "/admin/dashboard" }
    }

    console.log("All authentication methods failed")
    return {
      success: false,
      error: `Invalid username or password. Check console for details. Expected password length: ${ADMIN_PASSWORD.length}`,
    }
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
