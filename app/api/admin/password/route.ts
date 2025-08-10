import { type NextRequest, NextResponse } from "next/server"
import { validateAdminPassword, updateAdminPassword } from "@/lib/admin-config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate current password
    if (!validateAdminPassword(currentPassword)) {
      return NextResponse.json({ error: "Invalid current password" }, { status: 401 })
    }

    // Update password
    updateAdminPassword(newPassword)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating admin password:", error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Simple authentication check - in production, use proper session management
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const password = authHeader.substring(7)
    if (!validateAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error validating admin password:", error)
    return NextResponse.json({ error: "Failed to validate password" }, { status: 500 })
  }
}
