"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { authenticator } from "otplib"

export async function loginAdmin(prevState: any, formData: FormData) {
  const password = formData.get("password") as string
  const twofa = formData.get("twofa") as string

  // Check password
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Invalid credentials" }
  }

  // Check 2FA
  const secret = process.env.ADMIN_2FA_SECRET
  if (!secret) {
    return { error: "Server configuration error" }
  }

  const isValid = authenticator.verify({
    token: twofa,
    secret: secret,
  })

  if (!isValid) {
    return { error: "Invalid 2FA code" }
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
