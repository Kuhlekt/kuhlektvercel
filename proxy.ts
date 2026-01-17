import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const supabaseResponse = await updateSession(request)

  // If Supabase middleware returned a redirect, use it
  if (supabaseResponse.status === 302) {
    return supabaseResponse
  }

  const response = NextResponse.next()

  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "SAMEORIGIN")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()")

  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://hc-chatbot-v22.vercel.app; style-src 'self' 'unsafe-inline' https://hc-chatbot-v22.vercel.app; img-src 'self' data: https: blob:; font-src 'self' data: https://hc-chatbot-v22.vercel.app; connect-src 'self' https://*.supabase.co https://hc-chatbot-v22.vercel.app; frame-src 'self' https://www.google.com https://hc-chatbot-v22.vercel.app; child-src 'self' https://hc-chatbot-v22.vercel.app; object-src 'none'; base-uri 'self'; form-action 'self';",
  )

  return response
}

export const config = {
  matcher: ["/auth/:path*", "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
