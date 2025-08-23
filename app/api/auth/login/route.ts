import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { KnowledgeBaseData, User } from "@/types/knowledge-base"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

async function loadUsers(): Promise<User[]> {
  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf-8")
    const data: KnowledgeBaseData = JSON.parse(fileContent)
    return data.users || []
  } catch (error) {
    console.error("Error loading users:", error)
    // Return default users if file doesn't exist
    return [
      {
        id: "user-1",
        username: "admin",
        password: "admin123",
        email: "admin@example.com",
        role: "admin",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "user-2",
        username: "editor",
        password: "editor123",
        email: "editor@example.com",
        role: "editor",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "user-3",
        username: "viewer",
        password: "viewer123",
        email: "viewer@example.com",
        role: "viewer",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 POST /api/auth/login - Processing login request...")

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 })
    }

    const users = await loadUsers()
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
