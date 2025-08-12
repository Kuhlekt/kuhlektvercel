"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function changeAdminPassword(prevState: any, formData: FormData) {
  // Check if user is authenticated
  const cookieStore = await cookies()
  const session = cookieStore.get("admin-session")

  if (!session || session.value !== "authenticated") {
    redirect("/admin/login")
  }

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  // Validation
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
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || currentPassword !== adminPassword) {
    return { error: "Current password is incorrect" }
  }

  // In a real application, you would update the password in your database
  // For now, we'll just show a success message since we can't modify environment variables
  // You would need to manually update the ADMIN_PASSWORD environment variable

  return {
    success: `Password change requested successfully. Please update your ADMIN_PASSWORD environment variable to: ${newPassword}`,
  }
}
