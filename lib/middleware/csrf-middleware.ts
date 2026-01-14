import { NextResponse, type NextRequest } from "next/server"
import { verifyCSRFToken } from "@/lib/csrf"

export function csrfMiddleware(request: NextRequest) {
  // Only check CSRF for state-changing requests
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    return null
  }

  const token = request.headers.get("x-csrf-token")
  const sessionToken = request.cookies.get("csrf-token")?.value

  if (!token || !sessionToken || !verifyCSRFToken(token, sessionToken)) {
    return NextResponse.json({ error: "CSRF token validation failed" }, { status: 403 })
  }

  return null
}
