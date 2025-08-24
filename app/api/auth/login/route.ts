import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/utils/database"

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 POST /api/auth/login - Processing login request...")

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 })
    }

    // Load users from database
    const data = await database.loadData()
    const users = data.users || []

    console.log(
      "👥 Available users:",
      users.map((u) => ({ username: u.username, role: u.role, isActive: u.isActive })),
    )

    const user = users.find((u) => u.username === username && u.password === password && u.isActive)

    if (!user) {
      console.log("❌ Login failed for username:", username)
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    console.log("✅ Login successful for user:", { id: user.id, username: user.username, role: user.role })

    // Update last login time
    const updatedUser = { ...user, lastLogin: new Date().toISOString() }
    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))

    // Add audit log entry
    const auditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action: "user_login",
      performedBy: user.username,
      userId: user.id,
      username: user.username,
      timestamp: new Date().toISOString(),
      details: `User ${user.username} logged in successfully`,
    }

    const updatedAuditLog = [...(data.auditLog || []), auditEntry]

    // Save updated data
    try {
      await database.saveData({
        users: updatedUsers,
        auditLog: updatedAuditLog,
      })
    } catch (error) {
      console.warn("⚠️ Failed to update login info, but continuing:", error)
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("❌ Login API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      Allow: "POST, OPTIONS",
      "Content-Type": "application/json",
    },
  })
}
