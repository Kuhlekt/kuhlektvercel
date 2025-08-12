"use server"

import { verifyAdminCredentials, createAdminSession, logAdminActivity } from "@/lib/auth/admin-auth"
import { redirect } from "next/navigation"

export async function loginWithCredentials(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return { success: false, error: "Username and password are required" }
  }

  try {
    const user = await verifyAdminCredentials(username, password)

    if (!user) {
      // Log failed login attempt
      await logAdminActivity(
        0,
        username,
        "login_failed",
        "authentication",
        undefined,
        { username },
        false,
        "Invalid credentials",
      )
      return { success: false, error: "Invalid username or password" }
    }

    await createAdminSession(user)

    // Log successful login
    await logAdminActivity(user.id, user.username, "login_success", "authentication")

    redirect("/admin/dashboard")
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An unexpected error occurred" }
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
