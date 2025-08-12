import { NextResponse } from "next/server"

export async function GET() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
  const isEnabled = !!process.env.RECAPTCHA_SECRET_KEY

  return NextResponse.json({
    siteKey,
    isEnabled,
  })
}
