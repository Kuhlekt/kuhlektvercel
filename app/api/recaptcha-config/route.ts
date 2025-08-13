import { NextResponse } from "next/server"

export async function GET() {
  const response = NextResponse.json({
    siteKey: process.env.RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", // Google's test key
    isEnabled: !!process.env.RECAPTCHA_SITE_KEY,
  })

  response.headers.set("Cache-Control", "public, max-age=3600") // Cache for 1 hour
  response.headers.set("X-Content-Type-Options", "nosniff")

  return response
}
