import { NextResponse } from "next/server"

export async function GET() {
  // Use Google's test key for development or if no key is configured
  const siteKey = process.env.RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"

  return NextResponse.json({
    siteKey,
    isTestKey: !process.env.RECAPTCHA_SITE_KEY,
  })
}
