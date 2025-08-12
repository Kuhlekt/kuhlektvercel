"use server"

import { verifyAdminPassword, createAdminSession } from "@/lib/auth/admin-auth"
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

  await createAdminSession()
  redirect("/admin/database")
}
