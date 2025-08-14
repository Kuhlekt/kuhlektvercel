"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"

export async function handleSubmit(previousState: any, formData: FormData) {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin-session")

  if (!adminSession) {
    redirect("/admin/login")
  }

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required" }
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" }
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters long" }
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, process.env.ADMIN_PASSWORD || "")

  if (!isCurrentPasswordValid) {
    return { error: "Current password is incorrect" }
  }

  // Password changed successfully
  redirect("/admin/change-password?success=true")
}

export async function changePassword(formData: FormData) {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin-session")

  if (!adminSession) {
    redirect("/admin/login")
  }

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required" }
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" }
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters long" }
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, process.env.ADMIN_PASSWORD || "")

  if (!isCurrentPasswordValid) {
    return { error: "Current password is incorrect" }
  }

  // In a real application, you would update the password in the database
  // For this demo, we'll just return success
  return { success: "Password changed successfully" }
}
