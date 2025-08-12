import { NextResponse } from "next/server"
import type { NextRequest } from "next/request"

export function middleware(request: NextRequest) {
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to login page
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Check for admin session
    const adminSession = request.cookies.get("admin-session")
    const sessionExpires = request.cookies.get("admin-session-expires")

    if (!adminSession || !sessionExpires) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Check if session is expired
    const expiryDate = new Date(sessionExpires.value)
    if (expiryDate < new Date()) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url))
      response.cookies.delete("admin-session")
      response.cookies.delete("admin-session-expires")
      response.cookies.delete("admin-2fa-pending")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
