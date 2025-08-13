"use server"

import { verifyAdminPassword } from "@/lib/admin-auth"

export async function adminLogin(password: string, totpCode?: string) {
  try {
    // Verify password
    if (!verifyAdminPassword(password)) {
      return { success: false, message: "Invalid password" }
    }

    // If TOTP is configured, verify it
    const totpSecret = process.env.ADMIN_2FA_SECRET
    if (totpSecret && totpCode) {
      // In a real implementation, you would verify the TOTP code here
      // For now, we'll skip this verification
      console.log("TOTP verification would happen here")
    }

    return { success: true }
  } catch (error) {
    console.error("Admin login error:", error)
    return { success: false, message: "Login failed" }
  }
}
