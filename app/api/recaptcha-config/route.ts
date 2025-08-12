import { NextResponse } from "next/server"

export async function GET() {
  const siteKey = process.env.RECAPTCHA_SITE_KEY || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  const isEnabled = !!siteKey

  return NextResponse.json({
    siteKey: siteKey || "",
    isEnabled,
  })
}
