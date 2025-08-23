import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Demo authentication - in production, use proper authentication
    const validUsers = [
      { username: "admin", password: "admin123", role: "admin" },
      { username: "editor", password: "editor123", role: "editor" },
      { username: "viewer", password: "viewer123", role: "viewer" },
    ]

    const user = validUsers.find((u) => u.username === username && u.password === password)

    if (user) {
      return NextResponse.json({
        success: true,
        user: {
          username: user.username,
          role: user.role,
        },
      })
    }

    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
