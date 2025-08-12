"use server"

import {
  verifyAdminPassword,
  verifyTwoFactorToken,
  createAdminSession,
  setPendingTwoFactor,
  clearPendingTwoFactor,
  generateTwoFactorSecret,
} from "@/lib/auth/admin-auth"
import { redirect } from "next/navigation"

export async function loginWithPassword(formData: FormData) {
  const password = formData.get("password") as string

  if (!password) {
    return { success: false, error: "Password is required" }
  }

  const isValid = await verifyAdminPassword(password)

  if (!isValid) {
    return { success: false, error: "Invalid password" }
  }

  // Set pending 2FA state
  await setPendingTwoFactor()

  return { success: true, requiresTwoFactor: true }
}

export async function verifyTwoFactor(formData: FormData) {
  const token = formData.get("token") as string

  if (!token) {
    return { success: false, error: "2FA token is required" }
  }

  const isValid = await verifyTwoFactorToken(token)

  if (!isValid) {
    return { success: false, error: "Invalid 2FA token" }
  }

  // Clear pending 2FA and create session
  await clearPendingTwoFactor()
  await createAdminSession()

  redirect("/admin/database")
}

export async function generateQRCode() {
  try {
    const { secret, qrCode } = await generateTwoFactorSecret()
    return { success: true, qrCode, secret }
  } catch (error) {
    return { success: false, error: "Failed to generate QR code" }
  }
}
