"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function loginAdmin(prevState: any, formData: FormData) {
  try {
    const password = formData.get("password") as string

    if (!password) {
      return { error: "Password is required" }
    }

    // Check against environment variable
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return { error: "Admin password not configured" }
    }

    if (password !== adminPassword) {
      return { error: "Invalid password" }
    }

    // Set session cookie
    const cookieStore = cookies()
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    redirect("/admin/tracking")
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An error occurred during login" }
  }
}

export async function logoutAdmin() {
  const cookieStore = cookies()
  cookieStore.delete("admin_session")
  redirect("/admin/login")
}
