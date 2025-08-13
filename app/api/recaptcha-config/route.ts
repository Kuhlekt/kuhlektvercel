import { NextResponse } from "next/server"

export async function GET() {
  // Use only server-side environment variable
  const siteKey = process.env.RECAPTCHA_SITE_KEY

  return NextResponse.json({
    siteKey: siteKey || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", // Google's test key
    isEnabled: !!siteKey,
  })
}
