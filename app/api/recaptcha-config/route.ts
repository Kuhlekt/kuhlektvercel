import { NextResponse } from "next/server"

export async function GET() {
  // Access environment variables directly in the API route
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  const isEnabled = !!(siteKey && secretKey)

  return NextResponse.json({
    siteKey,
    isEnabled,
  })
}
