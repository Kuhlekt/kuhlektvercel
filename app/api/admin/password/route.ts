import { type NextRequest, NextResponse } from "next/server"
import { setAdminPassword, validateAdminPassword } from "@/lib/admin-config"

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()

    // Validate current password
    if (!validateAdminPassword(currentPassword)) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 })
    }

    // Set new password
    const success = setAdminPassword(newPassword)
    if (success) {
      return NextResponse.json({ success: true, message: "Password updated successfully" })
    } else {
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating admin password:", error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}
