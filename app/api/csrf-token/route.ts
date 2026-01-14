import { NextResponse } from "next/server"
import { generateCSRFToken } from "@/lib/csrf"

export async function GET() {
  const token = generateCSRFToken()

  const response = NextResponse.json({ token })

  response.cookies.set("csrf-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })

  return response
}
