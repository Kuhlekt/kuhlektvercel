import { clearAdminSession } from "@/lib/auth/admin-auth"
import { NextResponse } from "next/server"

export async function POST() {
  await clearAdminSession()
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
}

export async function GET() {
  await clearAdminSession()
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
}
