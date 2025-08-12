"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function loginAdmin(prevState: any, formData: FormData) {
  const password = formData.get("password") as string

  if (!password) {
    return { error: "Password is required" }
  }

  // Check password
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || password !== adminPassword) {
    return { error: "Invalid password" }
  }

  // Set admin session cookie
  const cookieStore = await cookies()
  cookieStore.set("admin-session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  redirect("/admin/tracking")
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-session")
  redirect("/admin/login")
}
