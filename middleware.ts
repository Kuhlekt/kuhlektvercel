import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Block admin routes from being indexed by search engines
  if (pathname.startsWith("/admin")) {
    const response = NextResponse.next()

    // Add security headers for admin routes
    response.headers.set("X-Robots-Tag", "noindex, nofollow, nosnippet, noarchive, noimageindex")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "no-referrer")
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, private")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  }

  // Block API admin routes
  if (pathname.startsWith("/api/admin")) {
    const response = NextResponse.next()

    response.headers.set("X-Robots-Tag", "noindex, nofollow, nosnippet, noarchive, noimageindex")
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, private")

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
