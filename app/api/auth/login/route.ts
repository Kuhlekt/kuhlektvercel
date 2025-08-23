import { type NextRequest, NextResponse } from "next/server"
import { apiDatabase } from "@/utils/api-database"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 })
    }

    // Load data and find user
    const data = await apiDatabase.loadData()
    const user = data.users.find((u) => u.username === username && u.password === password && u.isActive)

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Update last login
    try {
      await apiDatabase.updateUserLastLogin(data.users, user.id)
    } catch (error) {
      console.warn("Failed to update last login:", error)
    }

    // Add audit log entry
    try {
      await apiDatabase.addAuditEntry(data.auditLog, {
        action: "login",
        userId: user.id,
        details: `User ${username} logged in`,
        performedBy: user.id,
      })
    } catch (error) {
      console.warn("Failed to add audit log entry:", error)
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
