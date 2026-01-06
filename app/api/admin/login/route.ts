import { NextResponse } from "next/server"
import crypto from "crypto"

function verifyPassword(password: string): boolean {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH
  const plainPassword = process.env.ADMIN_PASSWORD

  if (passwordHash && passwordHash.includes(":")) {
    const [salt, hash] = passwordHash.split(":")
    const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
    return hash === verifyHash
  }

  if (plainPassword) {
    return password === plainPassword
  }

  return false
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ success: false, message: "Password is required" }, { status: 400 })
    }

    const isValid = verifyPassword(password)

    if (isValid) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 })
    }
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
