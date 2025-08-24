import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, updateDatabase } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 POST /api/auth/login - Processing login request...")

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      console.log("❌ Missing username or password")
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 })
    }

    // Get current database
    const data = getDatabase()
    console.log(
      "👥 Available users:",
      data.users.map((u) => ({
        username: u.username,
        role: u.role,
        isActive: u.isActive,
      })),
    )

    // Find user
    const user = data.users.find((u) => u.username === username && u.password === password && u.isActive)

    if (!user) {
      console.log("❌ Login failed for username:", username)
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    console.log("✅ Login successful for user:", {
      id: user.id,
      username: user.username,
      role: user.role,
    })

    // Update last login time
    const updatedUsers = data.users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u))

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

    const updatedAuditLog = [...data.auditLog, auditEntry]

    // Update database
    updateDatabase({
      users: updatedUsers,
      auditLog: updatedAuditLog,
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({
      success: true,
      user: {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString(),
      },
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
