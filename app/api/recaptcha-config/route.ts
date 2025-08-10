import { NextResponse } from "next/server"

export async function GET() {
  // Get the site key from server environment
  const siteKey = process.env.RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Test key fallback

  return NextResponse.json({
    siteKey: siteKey,
  })
}
