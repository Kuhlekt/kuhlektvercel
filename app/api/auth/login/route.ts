import { type NextRequest, NextResponse } from "next/server"
import { apiDatabase } from "@/utils/api-database"

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 POST /api/auth/login - Processing login request...")

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Username and password are required" }, { status: 400 })
    }

    // Load data and find user
    const data = await apiDatabase.loadData()
    const user = data.users.find((u) => u.username === username && u.password === password && u.isActive)

    if (!user) {
      console.log("❌ Login failed - Invalid credentials")
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // Update last login
    try {
      await apiDatabase.updateUserLastLogin(data.users, user.id)
    } catch (error) {
      console.warn("⚠️ Failed to update last login:", error)
      // Don't fail the login for this
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    console.log("✅ Login successful for user:", user.username)
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
