"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { verifyAdminPassword, hashPassword } from "@/lib/admin-auth"

export async function changePassword(currentPassword: string, newPassword: string) {
  // Verify current password
  if (!verifyAdminPassword(currentPassword)) {
    return { success: false, message: "Current password is incorrect" }
  }

  // Validate new password
  if (newPassword.length < 8) {
    return { success: false, message: "New password must be at least 8 characters long" }
  }

  // Hash and save new password
  const hashedNewPassword = await hashPassword(newPassword)
  process.env.ADMIN_PASSWORD = hashedNewPassword

  console.log("Admin password changed successfully")

  revalidatePath("/admin")
  redirect("/admin")
}
