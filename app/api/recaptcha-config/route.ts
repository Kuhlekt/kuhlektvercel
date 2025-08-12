import { NextResponse } from "next/server"

export async function GET() {
  const siteKey = process.env.RECAPTCHA_SITE_KEY

  return NextResponse.json({
    siteKey: siteKey || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
    isEnabled: !!siteKey,
  })
}
