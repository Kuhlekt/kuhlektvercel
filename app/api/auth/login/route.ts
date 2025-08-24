import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, updateDatabase } from "@/lib/database"
import type { AuditLogEntry } from "@/types/knowledge-base"

export async function POST(request: NextRequest) {
  try {
    console.log("📡 API: POST /api/auth/login - Processing login...")

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Username and password are required",
        },
        { status: 400 },
      )
    }

    const data = getDatabase()
    const user = data.users.find((u) => u.username === username && u.password === password && u.isActive)

    if (!user) {
      console.log("❌ API: Invalid credentials for username:", username)

      // Add failed login audit entry
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userId: "unknown",
        username: username,
        action: "login_failed",
        details: `Failed login attempt for username: ${username}`,
        ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
      }

      updateDatabase({
        auditLog: [...data.auditLog, auditEntry],
      })

      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password",
        },
        { status: 401 },
      )
    }

    // Update last login
    const updatedUsers = data.users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u))

    // Add successful login audit entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      userId: user.id,
      username: user.username,
      action: "login_success",
      details: `User logged in successfully`,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
    }

    updateDatabase({
      users: updatedUsers,
      auditLog: [...data.auditLog, auditEntry],
    })

    console.log("✅ API: Login successful for user:", user.username)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("❌ API: Login error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
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
