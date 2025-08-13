"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function adminLogin(formData: FormData) {
  const password = formData.get("password") as string

  if (!password) {
    return {
      success: false,
      error: "Password is required",
    }
  }

  // Check password against environment variable
  if (password !== process.env.ADMIN_PASSWORD) {
    return {
      success: false,
      error: "Invalid password",
    }
  }

  // Set authentication cookie
  cookies().set("admin-auth", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  redirect("/admin/tracking")
}

export async function adminLogout() {
  cookies().delete("admin-auth")
  redirect("/admin/login")
}
