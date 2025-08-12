import { NextResponse } from "next/server"

export async function GET() {
  // Only use the non-public environment variable on the server
  const siteKey = process.env.RECAPTCHA_SITE_KEY
  const isEnabled = !!siteKey

  return NextResponse.json({
    siteKey: siteKey || "",
    isEnabled,
  })
}
