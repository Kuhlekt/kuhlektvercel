"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function changeAdminPassword(prevState: any, formData: FormData) {
  try {
    // Check if user is authenticated
    const cookieStore = cookies()
    const adminSession = cookieStore.get("admin_session")

    if (!adminSession) {
      redirect("/admin/login")
    }

    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: "All fields are required" }
    }

    if (newPassword.length < 8) {
      return { error: "New password must be at least 8 characters long" }
    }

    if (newPassword !== confirmPassword) {
      return { error: "New passwords do not match" }
    }

    // Verify current password
    const adminPassword = process.env.ADMIN_PASSWORD
    if (currentPassword !== adminPassword) {
      return { error: "Current password is incorrect" }
    }

    // In a real application, you would update the password in a database
    // For this demo, we'll just show a success message with instructions
    return {
      success: `Password change successful! Please update your ADMIN_PASSWORD environment variable to: ${newPassword}`,
    }
  } catch (error) {
    console.error("Password change error:", error)
    return { error: "An error occurred while changing the password" }
  }
}
