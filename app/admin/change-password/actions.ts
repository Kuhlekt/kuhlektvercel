"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface ChangePasswordState {
  error?: string
  success?: string
}

export async function changeAdminPassword(
  prevState: ChangePasswordState | null,
  formData: FormData,
): Promise<ChangePasswordState> {
  // Check if user is authenticated
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")

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
  if (currentPassword !== process.env.ADMIN_PASSWORD) {
    return { error: "Current password is incorrect" }
  }

  // In a real application, you would update the password in a database
  // For this demo, we'll just show a success message with instructions
  return {
    success: `Password change validated! To complete the change, please update your ADMIN_PASSWORD environment variable to: ${newPassword}`,
  }
}
