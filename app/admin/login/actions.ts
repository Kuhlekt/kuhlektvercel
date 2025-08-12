"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface LoginState {
  error?: string
}

export async function loginAdmin(prevState: LoginState | null, formData: FormData): Promise<LoginState> {
  const password = formData.get("password") as string

  if (!password) {
    return { error: "Password is required" }
  }

  // Check against environment variable
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Invalid password" }
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set("admin_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  redirect("/admin/tracking")
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  redirect("/admin/login")
}
