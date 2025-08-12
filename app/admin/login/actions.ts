"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { authenticator } from "otplib"

export async function adminLogin(formData: FormData) {
  const password = formData.get("password") as string
  const totpCode = formData.get("totpCode") as string

  if (!password || !totpCode) {
    return { error: "Password and 2FA code are required" }
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD || "")

  if (!isPasswordValid) {
    return { error: "Invalid credentials" }
  }

  // Verify TOTP
  const secret = process.env.ADMIN_2FA_SECRET
  if (!secret) {
    return { error: "2FA not configured" }
  }

  const isValidToken = authenticator.verify({
    token: totpCode,
    secret: secret,
  })

  if (!isValidToken) {
    return { error: "Invalid 2FA code" }
  }

  // Set session cookie
  const cookieStore = cookies()
  cookieStore.set("admin-session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  redirect("/admin/tracking")
}
